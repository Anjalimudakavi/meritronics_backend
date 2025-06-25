// // src/specification/dto/specification.dto.ts
// import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
// import { inputType } from '@prisma/client'; // import Prisma enum

// export class CreateSpecificationDto { //nest start -w 
//   @IsNotEmpty()
//   @IsString()
//   name: string;

 
//   @IsOptional()
//   inputType?: inputType;  // Prisma enum

//   @IsNotEmpty()
//   @IsString()
//   stationId: string;
  
//   @IsBoolean()
//   @IsOptional()
//   required?: boolean; // Only relevant for CHECKBOX

//     @IsOptional()
//   @IsArray()
//   @IsString({ each: true }) // ensure every item in the array is a string
//   suggestions?: string[];
// }

// export class UpdateSpecificationDto {
//   @IsOptional()
//   @IsString()
//   name?: string;

//   @IsOptional()
//   @IsString()
//   slug?: string;

//   @IsBoolean()
//   @IsOptional()
//   required?: boolean; 
//   @IsOptional()
//   inputType?: inputType;
//     @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   suggestions?: string[];
// }



import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { inputType } from '@prisma/client';

export class CreateSpecificationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(inputType)
  inputType?: inputType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestions?: string[];

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsNotEmpty()
  @IsString()
  stationId: string;
}

export class UpdateSpecificationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(inputType)
  inputType?: inputType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestions?: string[];

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsString()
  stationId?: string;
}
