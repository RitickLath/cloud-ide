import { IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { Framework } from "src/common/types/project.types";

export class CreateProjectDto {
    @IsEnum(Framework)
    @IsNotEmpty()
    framework: Framework;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CreateProjectGitDto {
    @IsUrl()
    @IsNotEmpty()
    gitUrl: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}