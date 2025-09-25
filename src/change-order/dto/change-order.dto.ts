
// change-order.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ChangeOrderDetailDto {
  @IsBoolean()
  isRequired: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  replaceEarlier?: boolean;

  @IsOptional()
  @IsBoolean()
  addRevision?: boolean;

  @IsOptional()
  @IsString()
  pullFromFiles?: string;
}

export class CreateChangeOrderDto {
  @IsString()
  changeorder_name: string;

  @IsOptional()
  @IsString()
  mpiId?: string;

  @ValidateNested()
  @Type(() => ChangeOrderDetailDto)
  detail: ChangeOrderDetailDto;
}

export class UpdateChangeOrderDto {
  @IsOptional()
  @IsString()
  changeorder_name?: string;

  @IsOptional()
  @IsString()
  mpiId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChangeOrderDetailDto)
  detail?: ChangeOrderDetailDto;
}
