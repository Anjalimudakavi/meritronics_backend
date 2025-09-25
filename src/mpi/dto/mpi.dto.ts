

import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStationDto, UpdateStationDto } from '../../station/dto/station.dto';
import { OrderType, FileAction } from '@prisma/client';



export class CreateMpiDocumentationDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
@IsOptional()
@IsString()
originalName?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class CreateOrderFormDto {

    @IsOptional() // ✅ Add this
   @IsArray()
  @IsEnum(OrderType, { each: true })
  OrderType: OrderType[];

  @IsOptional()
  @IsDateString()
  distributionDate?: string;

  @IsOptional()
  @IsDateString()
  requiredBy?: string;

  

  @IsOptional()
  @IsString()
  revision?: string;

  @IsOptional()
  @IsString()
  otherAttachments?: string;

  @IsArray()
  @IsEnum(FileAction, { each: true })
  fileAction: FileAction[];



  @IsOptional()
  @IsString()
  changeOrderNumber?: string;

  @IsOptional()
  @IsString()
  mpiId?: string;
    @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceIds?: string[];
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
  @IsOptional()
  id?: string;
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistItemDto)
  checklistItems?: CreateChecklistItemDto[];
}
export class CreateStationMpiDocumentDto {
    @IsOptional()
  @IsString()
  id?: string;
 

  @IsString()
  fileUrl: string;
@IsOptional()
@IsString()
originalName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  stationId?: string;
}

export class CreateMpiDto {
  @IsString()
  @IsNotEmpty()
  mpiName: string;

  @IsString()
  @IsNotEmpty()
  assemblyName: string;

  // @IsOptional()
  //   @IsArray()
  // @ValidateNested()
  // @Type(() => CreateOrderFormDto)
  // orderForms?: CreateOrderFormDto;

@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => CreateOrderFormDto)
orderForms?: CreateOrderFormDto[];


  @IsOptional()
  @IsString()
  customer?: string;


   
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Instruction?: string[];


  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStationDto)
  stations?: CreateStationDto[];

@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => CreateStationMpiDocumentDto)
stationMpiDocuments?: CreateStationMpiDocumentDto[];

  @IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => CreateMpiDocumentationDto)
mpiDocs?: CreateMpiDocumentationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChecklistDto)
  checklists?: CreateChecklistDto[];

    @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceIds?: string[];

}

export class UpdateMpiDocumentationDto {
  @IsOptional()
  @IsString()
  id?: string;


  @IsString()
  fileUrl: string;

  @IsOptional()
@IsString()
originalName?: string;

  @IsOptional()
  @IsString()
  description?: string;
}


class UpdateChecklistItemDto {
    @IsString()
  @IsOptional()
  id?: string;
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
    @IsString()
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateChecklistItemDto)
  checklistItems?: UpdateChecklistItemDto[];
}


class UpdateOrderFormDto {
  @IsOptional()
@IsString()
id?: string;
  @IsArray()
  @IsEnum(OrderType, { each: true })
  OrderType: OrderType[];

  @IsOptional()
  @IsDateString()
  distributionDate?: string;

  @IsOptional()
  @IsDateString()
  requiredBy?: string;

  @IsOptional()
  @IsString()
  internalOrderNumber?: string;

  @IsOptional()
  @IsString()
  revision?: string;

  @IsOptional()
  @IsString()
  otherAttachments?: string;

  @IsArray()
  @IsEnum(FileAction, { each: true })
  fileAction: FileAction[];



  @IsOptional()
  @IsString()
  changeOrderNumber?: string;

    @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceIds?: string[];
 
}

export class UpdateStationMpiDocumentDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
@IsOptional()
@IsString()
originalName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  stationId?: string;
}
export class UpdateMpiDto {
  @IsOptional()
  @IsString()
  mpiName?: string;

  @IsOptional()
  @IsString()
  assemblyName?: string;

    @IsOptional()
  @IsString()
  customer?: string; // ✅ ADD THIS


  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Instruction?: string[];

@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => UpdateOrderFormDto)
orderForms?: UpdateOrderFormDto[];

@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => UpdateMpiDocumentationDto)
mpiDocs?: UpdateMpiDocumentationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateStationMpiDocumentDto)
  stationMpiDocuments?: UpdateStationMpiDocumentDto[];
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
