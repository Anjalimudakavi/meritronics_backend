// // import {
// //   IsString,
// //   IsOptional,
// //   IsArray,
// //   ValidateNested,
// //   IsEnum,
// //   IsNotEmpty,
// // } from 'class-validator';
// // import { Type } from 'class-transformer';

// // enum InputType {
// //   TEXT = 'TEXT',
// //   CHECKBOX = 'CHECKBOX',
// //   DROPDOWN = 'DROPDOWN',
// //   FILE_UPLOAD = 'FILE_UPLOAD',
// //   number = 'number',
// // }

// // class SpecificationDto {
// //   @IsString()
// //   @IsNotEmpty()
// //   name: string;

// //   @IsString()
// //   @IsNotEmpty()
// //   slug: string;

// //   @IsOptional()
// //   @IsEnum(InputType)
// //   inputType?: InputType;
// // }

// // class StationDto {
// // //   @IsString()
// // //   @IsNotEmpty()
// // //   stationId: string;

// //   @IsString()
// //   @IsNotEmpty()
// //   id: string; // ✅ Add this

// //   @IsString()
// //   @IsNotEmpty()
// //   stationName: string;

// //   @IsOptional()
// //   @IsArray()
// //   @ValidateNested({ each: true })
// //   @Type(() => SpecificationDto)
// //   specifications?: SpecificationDto[];
// // }

// // export class CreateOrUpdateMpiDto {
// //   @IsString()
// //   @IsNotEmpty()
// //   jobId: string;

// //   @IsString()
// //   @IsNotEmpty()
// //   assemblyId: string;

// //   @IsOptional()
// //   @IsArray()
// //   @ValidateNested({ each: true })
// //   @Type(() => StationDto)
// //   stations?: StationDto[];
// // }




// // import {
// //   IsString,
// //   IsOptional,
// //   IsArray,
// //   ValidateNested,
// //   IsEnum,
// //   IsNotEmpty,
// // } from 'class-validator';
// // import { Type } from 'class-transformer';

// // enum InputType {
// //   TEXT = 'TEXT',
// //   CHECKBOX = 'CHECKBOX',
// //   DROPDOWN = 'DROPDOWN',
// //   FILE_UPLOAD = 'FILE_UPLOAD',
// //   number = 'number',
// // }

// // class SpecificationDto {
// //   @IsString()
// //   @IsNotEmpty()
// //   name: string;

// //   @IsString()
// //   @IsNotEmpty()
// //   slug: string;

// //   @IsOptional()
// //   @IsEnum(InputType)
// //   inputType?: InputType;
// // }

// // class DocumentationDto {
// //   @IsOptional()
// //   @IsString()
// //   fileUrl?: string;

// //   @IsOptional()
// //   @IsString()
// //   description?: string;
// // }

// // class FlowchartDto {
// //   @IsOptional()
// //   @IsString()
// //   fileUrl?: string;

// //   @IsOptional()
// //   @IsString()
// //   description?: string;
// // }

// // class StationDto {
// //   @IsString()
// //   @IsNotEmpty()
// //   id: string;

// //   @IsString()
// //   @IsNotEmpty()
// //   stationName: string;

// //   @IsOptional()
// //   @IsString()
// //   stationId?: string;

// //   @IsOptional()
// //   @IsString()
// //   mpiId?: string;

// //   @IsOptional()
// //   @IsString()
// //   status?: string;

// //   @IsOptional()
// //   @IsString()
// //   description?: string;

// //   @IsOptional()
// //   @IsString()
// //   location?: string;

// //   @IsOptional()
// //   @IsString()
// //   operator?: string;

// //   @IsOptional()
// //   @IsArray()
// //   @ValidateNested({ each: true })
// //   @Type(() => SpecificationDto)
// //   specifications?: SpecificationDto[];

// //   @IsOptional()
// //   @IsArray()
// //   @ValidateNested({ each: true })
// //   @Type(() => DocumentationDto)
// //   documentations?: DocumentationDto[];

// //   @IsOptional()
// //   @IsArray()
// //   @ValidateNested({ each: true })
// //   @Type(() => FlowchartDto)
// //   flowcharts?: FlowchartDto[];
// // }

// // export class CreateOrUpdateMpiDto {
// //   @IsString()
// //   @IsNotEmpty()
// //   jobId: string;

// //   @IsString()
// //   @IsNotEmpty()
// //   assemblyId: string;

// //   @IsOptional()
// //   @IsArray()
// //   @ValidateNested({ each: true })
// //   @Type(() => StationDto)
// //   stations?: StationDto[];
// // }


// import {
//   IsString,
//   IsOptional,
//   IsArray,
//   ValidateNested,
//   IsNotEmpty,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { CreateStationDto, UpdateStationDto } from '../../station/dto/station.dto';

// export class CreateMpiDto {
//   @IsString()
//   @IsNotEmpty()
//   jobId: string;

//   @IsString()
//   @IsNotEmpty()
//   assemblyId: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateStationDto)
//   stations?: CreateStationDto[];
// }

// export class UpdateMpiDto {
//   @IsOptional()
//   @IsString()
//   jobId?: string;

//   @IsOptional()
//   @IsString()
//   assemblyId?: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => UpdateStationDto)
//   stations?: UpdateStationDto[];
// }


// dto/mpi.dto.ts


import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStationDto, UpdateStationDto } from '../../station/dto/station.dto';
import { OrderType, FileAction } from '@prisma/client';

class CreateOrderFormDto {
  // @IsOptional()
  // @IsArray()
  // @IsEnum(OrderType, { each: true })
  // orderTypes?: OrderType[];
@IsOptional()
@IsArray()
@IsEnum(OrderType, { each: true })
orderType?: OrderType[];  // ✅ array of enums



  @IsOptional()
  @IsDate()
  @Type(() => Date)
  distributionDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  requiredBy?: Date;


  @IsOptional()
  @IsString()
  internalOrderNumber?: string;

  @IsOptional()
  @IsString()
  revision?: string;

  @IsOptional()
  @IsString()
  otherAttachments?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(FileAction, { each: true })
  fileAction?: FileAction[];
  

}

export class CreateChecklistItemDto {
 
  @IsOptional() // ✅ Optional, used for mapping only
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string; // allow this only if your system lets user override it

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  required?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}


export class CreateChecklistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistItemDto)
  checklistItems?: CreateChecklistItemDto[];
}

export class CreateMpiDto {
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @IsString()
  @IsNotEmpty()
  assemblyId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOrderFormDto)
  orderForms?: CreateOrderFormDto;

  
  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStationDto)
  stations?: CreateStationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistDto)
  checklists?: CreateChecklistDto[];
}

class UpdateChecklistItemDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  required?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

class UpdateChecklistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateChecklistItemDto)
  checklistItems?: UpdateChecklistItemDto[];
}

export class UpdateMpiDto {
  @IsOptional()
  @IsString()
  jobId?: string;

  @IsOptional()
  @IsString()
  assemblyId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOrderFormDto)
  orderForm?: CreateOrderFormDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateStationDto)
  stations?: UpdateStationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateChecklistDto)
  checklists?: UpdateChecklistDto[];
}
