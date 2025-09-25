import { IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() phone: string;

  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() county?: string;
  @IsOptional() @IsString() zipCode?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() status?: string;

  @IsOptional() @IsString() createdBy?: string;
}

export class UpdateCustomerDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() county?: string;
  @IsOptional() @IsString() zipCode?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() status?: string;

  @IsOptional() @IsString() updatedBy?: string;
}
