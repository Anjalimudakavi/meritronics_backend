// // src/station/dto/station.dto.ts
// import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// export class CreateStationDto {
//   @IsNotEmpty()
//   @IsString()
//   stationId: string;

//   @IsNotEmpty()
//   @IsString()
//   stationName: string;

//   @IsOptional()
//   @IsString()
//   mpiId?: string;
// }

// export class UpdateStationDto {
//   @IsOptional()
//   @IsString()
//   stationName?: string;

//   @IsOptional()
//   @IsString()
//   mpiId?: string;
// }

// src/station/dto/station.dto.ts


// import {
//   IsArray,
//   IsBoolean,
//   IsEnum,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   ValidateNested,
// } from 'class-validator';
// import { Type } from 'class-transformer';

// import {
//   CreateSpecificationDto,
//   UpdateSpecificationDto,
// } from '../../specification/dto/specification.dto';

// // Inline inputs for documentations and flowcharts
// class CreateDocumentationInput {
//   @IsOptional()
//   @IsString()
//   fileUrl?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;
// }

// class UpdateDocumentationInput {
//   @IsOptional()
//   @IsString()
//   fileUrl?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;
// }

// class CreateFlowchartInput {
//   @IsOptional()
//   @IsString()
//   fileUrl?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;
// }

// class UpdateFlowchartInput {
//   @IsOptional()
//   @IsString()
//   fileUrl?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;
// }

// export class CreateStationDto {
//   @IsOptional()
//   @IsString()
//   id?: string; // Optional for cases like nested updates

//   @IsNotEmpty()
//   @IsString()
//   stationId: string;

//   @IsNotEmpty()
//   @IsString()
//   stationName: string;

//   @IsOptional()
//   @IsString()
//   mpiId?: string;

//   @IsOptional()
//   @IsString()
//   status?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsString()
//   location?: string;

//   @IsOptional()
//   @IsString()
//   operator?: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateDocumentationInput)
//   documentations?: CreateDocumentationInput[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateFlowchartInput)
//   flowcharts?: CreateFlowchartInput[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateSpecificationDto)
//   specifications?: CreateSpecificationDto[];
// }

// export class UpdateStationDto {
//   @IsOptional()
//   @IsString()
//   id?: string;

//   @IsOptional()
//   @IsString()
//   stationId?: string;

//   @IsOptional()
//   @IsString()
//   stationName?: string;

//   @IsOptional()
//   @IsString()
//   mpiId?: string;

//   @IsOptional()
//   @IsString()
//   status?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsString()
//   location?: string;

//   @IsOptional()
//   @IsString()
//   operator?: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => UpdateDocumentationInput)
//   documentations?: UpdateDocumentationInput[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => UpdateFlowchartInput)
//   flowcharts?: UpdateFlowchartInput[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => UpdateSpecificationDto)
//   specifications?: UpdateSpecificationDto[];
// }

import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
} from '../../specification/dto/specification.dto';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SpecificationValueDto {
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

class CreateDocumentationInput {
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class UpdateDocumentationInput {
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
  id: boolean;
}

class CreateFlowchartInput {
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class UpdateFlowchartInput {
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
  id: boolean;
}

export class CreateStationDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  stationId: string;

  @IsNotEmpty()
  @IsString()
  stationName: string;

  @IsOptional()
  @IsString()
  mpiId?: string;

  @IsOptional()
  @IsString()
  status?: string;


   @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  operator?: string;


  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Note?: string[];


  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentationInput)
  documentations?: CreateDocumentationInput[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlowchartInput)
  flowcharts?: CreateFlowchartInput[];


    @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpecificationDto)
  specifications?: CreateSpecificationDto[];
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationValueDto)
  specificationValues?: SpecificationValueDto[];
}

export class UpdateStationDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  stationId?: string;

  @IsOptional()
  @IsString()
  stationName?: string;

  @IsOptional()
  @IsString()
  mpiId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;


  @IsOptional()
  @IsInt()
  priority?: number;
  @IsOptional()
  @IsString()
  operator?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Note?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDocumentationInput)
  documentations?: UpdateDocumentationInput[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFlowchartInput)
  flowcharts?: UpdateFlowchartInput[];

    @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpecificationDto)
  specifications?: CreateSpecificationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationValueDto)
  specificationValues?: SpecificationValueDto[];
}
