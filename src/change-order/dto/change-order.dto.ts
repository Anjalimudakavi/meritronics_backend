// import {
//   IsOptional,
//   IsString,
//   IsBoolean,
//   IsEnum,
//   ValidateNested,
//   IsArray,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { ChangeOrderSectionType } from '@prisma/client';

// export class CreateChangeOrderSectionDto {
//   @IsEnum(ChangeOrderSectionType)
//   section: ChangeOrderSectionType;

//   @IsOptional()
//   @IsString()
//   value?: string;

//   @IsOptional()
//   @IsBoolean()
//   replaceEarlier?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   addRevision?: boolean;

//   @IsOptional()
//   @IsString()
//   pullFromFiles?: string;
// }

// export class CreateChangeOrderDto {

//   @IsString()
//   mpiId: string;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateChangeOrderSectionDto)
//   sections: CreateChangeOrderSectionDto[];
// }

// export class UpdateChangeOrderSectionDto {
//   @IsOptional()
//   @IsEnum(ChangeOrderSectionType)
//   section?: ChangeOrderSectionType;

//   @IsOptional()
//   @IsString()
//   value?: string;

//   @IsOptional()
//   @IsBoolean()
//   replaceEarlier?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   addRevision?: boolean;

//   @IsOptional()
//   @IsString()
//   pullFromFiles?: string;
// }

// export class UpdateChangeOrderDto {
//   @IsOptional()
//   @IsString()
//   briefDescription?: string;

//   @IsOptional()
//   @IsString()
//   mpiId?: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => UpdateChangeOrderSectionDto)
//   sections?: UpdateChangeOrderSectionDto[];
// }


import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ChangeOrderSectionType } from '@prisma/client';

export class CreateChangeOrderDto {
  @IsEnum(ChangeOrderSectionType)
  section: ChangeOrderSectionType;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsBoolean()
  replaceEarlier?: boolean;

  @IsOptional()
  @IsBoolean()
  addRevision?: boolean;

  @IsOptional()
  @IsString()
  pullFromFiles?: string;

  @IsOptional()
  @IsString()
  mpiId?: string;
}

export class UpdateChangeOrderDto {
  @IsOptional()
  @IsEnum(ChangeOrderSectionType)
  section?: ChangeOrderSectionType;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsBoolean()
  replaceEarlier?: boolean;

  @IsOptional()
  @IsBoolean()
  addRevision?: boolean;

  @IsOptional()
  @IsString()
  pullFromFiles?: string;

  @IsOptional()
  @IsString()
  mpiId?: string;
}
