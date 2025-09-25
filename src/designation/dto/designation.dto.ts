
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateDesignationDto {
  @IsNotEmpty()
  @IsString()
  title: string;


  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

    @IsOptional()
  @IsString()
  roleId?: string; // ✅ Optional roleId

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[]; // ✅ Optional array of permission IDs
}


export class UpdateDesignationDto {
  @IsOptional()
  @IsString()
  title?: string;


  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  
  @IsOptional()
  @IsString()
  roleId?: string; // ✅ Optional update to roleId

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[]; 
}
