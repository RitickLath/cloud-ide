import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto, RegisterAuthDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'src/common/types/roles.enum';
import { MailService } from 'src/mail/mail.service';
import Redis from 'ioredis';
import * as crypto from 'crypto';
import { BloomFilter } from 'src/common/utils/bloom';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private redis: Redis,
    private mailService: MailService,
    private bloom: BloomFilter,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  // Warm up BloomFilter & seed roles on application boot
  async onModuleInit() {
    // Seed default roles if they don't exist
    for (const role of Object.values(UserRole)) {
      await this.prisma.role.upsert({
        where: { name: role },
        update: {},
        create: { name: role },
      });
    }

    const users = await this.prisma.user.findMany({
      select: { username: true },
    });
    for (const u of users) {
      this.bloom.add(u.username);
    }
  }

  // bloom filter based implementation with zero false negatives
  async checkUsernameAvailability(username: string) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const normalizedUsername = username.trim().toLowerCase();

    // 1. Fast Bloom Filter check:
    const mightBeTaken = this.bloom.has(normalizedUsername);
    if (!mightBeTaken) {
      return { isAvailable: true };
    }

    // 2. Candidate false-positive check: verify in database
    const user = await this.prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: { id: true },
    });

    return { isAvailable: !user };
  }

  async verifyEmail(token: string, email: string) {
    if (!token || !email) {
      throw new BadRequestException('Token and email are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Fetch token stored in Redis
    const storedToken = await this.redis.get(`verify:${normalizedEmail}`);

    if (!storedToken) {
      throw new BadRequestException(
        'Verification link is invalid or has expired',
      );
    }

    // 2. Validate token matches
    if (storedToken !== token) {
      throw new BadRequestException('Invalid verification token');
    }

    // 3. Find user in database
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      // Clean up Redis token if already verified
      await this.redis.del(`verify:${normalizedEmail}`);
      return {
        message: 'Email is already verified. You can log in.',
      };
    }

    // 4. Mark user as verified in database
    await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: { isVerified: true },
    });

    // 5. Invalidate token in Redis after successful verification
    await this.redis.del(`verify:${normalizedEmail}`);

    return {
      message: 'Email verified successfully! You can now log in.',
    };
  }

  async register(body: RegisterAuthDto) {
    // 1. Check for existing username or email conflict
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === body.username) {
        throw new ConflictException('Username is already taken');
      }
      throw new ConflictException('Email is already registered');
    }

    // 2. Resolve Role (defaults to STUDENT if not provided)
    const targetRole = body.role || UserRole.STUDENT;

    // 3. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const isDev = this.configService.get('NODE_ENV') === 'development';

    // 4. Create User in database
    const user = await this.prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        passwordHash,
        role: {
          connectOrCreate: {
            where: { name: targetRole },
            create: { name: targetRole },
          },
        },
        isVerified: isDev,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    // 5. Reserve username in BloomFilter immediately
    this.bloom.add(user.username);

    // 6. Generate verification token and send email
    if (!isDev) {
      const verificationToken = crypto.randomUUID();
      await this.redis.set(
        `verify:${user.email}`,
        verificationToken,
        'EX',
        60 * 60 * 24,
      );
      await this.mailService.queueVerificationEmail(
        user.email,
        verificationToken,
        user.username,
      );
    }
    return {
      message: isDev
        ? 'User registered successfully (Auto-verified in dev).'
        : 'User registered successfully. Please verify your email.',
      user,
    };
  }

  async login(body: LoginAuthDto) {
    const identifier = body.username.trim().toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role?.name,
      },
    };
  }

  async logout() {
    return {
      message: 'Logged out successfully',
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
        profile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      ...user,
      role: user.role?.name,
    };
  }
}
