import { IsString, IsOptional, IsBoolean, IsUUID, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  roleId: string;  // Required since User also has roleId
}
export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

    @IsOptional()
    @IsString()
  phone:string;
  @IsEmail()
  email: string;

  @IsUUID()
  @IsOptional() // <-- ✅ make userId optional to match the Prisma model
  userId?: string;

    @IsUUID()
  @IsOptional()
  designationId?: string; // ✅ Added designationId

  @IsUUID()
  roleId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
    @IsOptional()

  @ValidateNested()
  @Type(() => CreateUserDto)

  user?: CreateUserDto;
}



export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
  @IsOptional()
    @IsString()
  phone:string;
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsUUID()
  @IsOptional()
  designationId?: string; // ✅ Added designationId

  @IsUUID()
  @IsOptional()
  userId?: string; // <-- ✅ include userId in update too

  @IsUUID()
  @IsOptional()
  roleId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  
 @ValidateNested()
  @Type(() => CreateUserDto)
  @IsOptional()
  user?: Partial<CreateUserDto>; 

}
