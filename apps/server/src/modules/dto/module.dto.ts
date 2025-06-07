import { IsString, IsNotEmpty } from 'class-validator';

export class InstallModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}

export class UninstallModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}
