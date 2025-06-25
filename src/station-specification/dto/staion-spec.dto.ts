import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStationSpecificationDto {
  @IsNotEmpty()
  @IsString()
  stationId: string;

  @IsNotEmpty()
  @IsString()
  specificationId: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  unit?: string;
}

export class UpdateStationSpecificationDto{
    @IsNotEmpty()
  @IsString()
  stationId: string;

  @IsNotEmpty()
  @IsString()
  specificationId: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  unit?: string;
}
