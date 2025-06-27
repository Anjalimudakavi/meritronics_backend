// import {UseInterceptors, UploadedFile, UploadedFiles,
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { MpiService } from './mpi.service';
// import { CreateMpiDto,UpdateMpiDto } from './dto/mpi.dto';
// import { CHECKLIST_TEMPLATE } from './template/checklist-template';
// import { OrderType, FileAction } from '@prisma/client';
// import { extname } from 'path';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { AnyFilesInterceptor } from '@nestjs/platform-express';

// @Controller('mpi')
// export class MpiController {
//   constructor(private readonly mpiService: MpiService) {}
//   @Get('checklist-template')
//   getChecklistTemplate() {
//     return CHECKLIST_TEMPLATE;
//   }

//   // @Post()
//   // create(@Body() createMpiDto: CreateMpiDto) {
//   //   return this.mpiService.create(createMpiDto);
//   // }




// // @Post()
// // @UseInterceptors(FileInterceptor('file', {
// //   storage: diskStorage({
// //     destination: './uploads/mpidocs',
// //     filename: (req, file, cb) => {
// //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
// //       cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
// //     },
// //   }),
// // }))
// // async createWithFile(
// //   @UploadedFile() file: Express.Multer.File,
// //   @Body('dto') dto: string, // sent from frontend as JSON string
// // ) {
// //   const createMpiDto: CreateMpiDto = JSON.parse(dto);
// //   if (file) {
// //     createMpiDto.mpiDocs = [
// //       {
// //         fileUrl: `/uploads/mpidocs/${file.filename}`,
// //         description: 'Uploaded during MPI creation',
// //       },
// //     ];
// //   }

// //   return this.mpiService.create(createMpiDto);
// // }

// @Post()
// @UseInterceptors(
//   AnyFilesInterceptor({
//     storage: diskStorage({
//       destination: './uploads',
//       filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
//       },
//     }),
//   })
// )
// async createWithFiles(
//   @UploadedFiles() files: Express.Multer.File[],
//   @Body('dto') rawDto: string,
// ) {
//   const dto: CreateMpiDto = JSON.parse(rawDto);

//   // Separate files by custom field name
//   const mpiFiles = files.filter(f => f.fieldname === 'mpiFiles');
//   const stationFiles = files.filter(f => f.fieldname === 'stationFiles');

//   // Assign MPI docs
//   dto.mpiDocs = mpiFiles.map(file => ({
//     fileUrl: `/uploads/${file.filename}`,
//     description: 'Uploaded via mpiFiles',
//   }));

//   // Assign station docs by order
//   let i = 0;
//   for (const station of dto.stations || []) {
//     for (const doc of station.documentations || []) {
//       if (stationFiles[i]) {
//         doc.fileUrl = `/uploads/${stationFiles[i].filename}`;
//         i++;
//       }
//     }
//   }

//   return this.mpiService.create(dto);
// }

// @Get('enums')
// getEnums() {
//   return {
//     orderTypes: Object.values(OrderType),
//     fileActions: Object.values(FileAction),
//   };
// }

//   @Get()
//   findAll() {
//     return this.mpiService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.mpiService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateMpiDto: UpdateMpiDto) {
//     return this.mpiService.update(id, updateMpiDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.mpiService.remove(id);
//   }
// }















import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { MpiService } from './mpi.service';
import { CreateMpiDto, UpdateMpiDto } from './dto/mpi.dto';
import { CHECKLIST_TEMPLATE } from './template/checklist-template';
import { OrderType, FileAction } from '@prisma/client';

@Controller('mpi')
export class MpiController {
  private readonly logger = new Logger(MpiController.name);

  constructor(private readonly mpiService: MpiService) {}

  @Get('checklist-template')
  getChecklistTemplate() {
    return CHECKLIST_TEMPLATE;
  }

  @Get('enums')
  getEnums() {
    return {
      orderTypes: Object.values(OrderType),
      fileActions: Object.values(FileAction),
    };
  }

  // @Post()
  // async create(@Body() createMpiDto: CreateMpiDto) {
  //   try {
  //     this.logger.log('Creating new MPI');
  //     this.logger.debug('MPI DTO:', JSON.stringify(createMpiDto, null, 2));
      
  //     const result = await this.mpiService.create(createMpiDto);
      
  //     this.logger.log(`MPI created successfully with ID: ${result.id}`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error('Failed to create MPI:', error.message);
  //     this.logger.error('Stack trace:', error.stack);
  //     throw new BadRequestException(error.message || 'Failed to create MPI');
  //   }
  // }

  @Post()
  create(@Body() createMpiDto: CreateMpiDto) {
    return this.mpiService.create(createMpiDto);
  }



  @Get()
  async findAll() {
    try {
      return await this.mpiService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch MPIs:', error.message);
      throw new BadRequestException('Failed to fetch MPIs');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.mpiService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to fetch MPI ${id}:`, error.message);
      throw new BadRequestException('Failed to fetch MPI');
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMpiDto: UpdateMpiDto) {
    try {
      this.logger.log(`Updating MPI ${id}`);
      return await this.mpiService.update(id, updateMpiDto);
    } catch (error) {
      this.logger.error(`Failed to update MPI ${id}:`, error.message);
      throw new BadRequestException(error.message || 'Failed to update MPI');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting MPI ${id}`);
      return await this.mpiService.remove(id);
    } catch (error) {
      this.logger.error(`Failed to delete MPI ${id}:`, error.message);
      throw new BadRequestException('Failed to delete MPI');
    }
  }
}