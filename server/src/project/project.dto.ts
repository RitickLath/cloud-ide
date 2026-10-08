import { IsEnum, IsNotEmpty } from "class-validator";
import { Framework } from "src/common/types/project.types";

export class CreateProjectDto {
    @IsEnum(Framework)
    @IsNotEmpty()
    framework: Framework;
}