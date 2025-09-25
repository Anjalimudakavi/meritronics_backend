// // // src/station/station.service.ts
// // import { Injectable, NotFoundException } from '@nestjs/common';
// // import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
// // import { PrismaService } from 'prisma/prisma.service';
// // @Injectable()
// // export class StationService {
// //   constructor(private prisma: PrismaService) {}

// //   async create(dto: CreateStationDto) {
// //     return this.prisma.station.create({ data: dto });
// //   }

// //   async findAll() {
// //     return this.prisma.station.findMany();
// //   }

// //   async findOne(id: string) {
// //     const station = await this.prisma.station.findUnique({ where: { id } });
// //     if (!station) throw new NotFoundException('Station not found');
// //     return station;
// //   }

// //   async update(id: string, dto: UpdateStationDto) {
// //     return this.prisma.station.update({ where: { id }, data: dto });
// //   }

// //   async remove(id: string) {
// //     return this.prisma.station.delete({ where: { id } });
// //   }
// // }



// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';
// import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
// import { inputType as InputType } from '@prisma/client'; // Prisma Enum

// @Injectable()
// export class StationService {
//   constructor(private prisma: PrismaService) {}

//   private slugify(text: string): string {
//     return text
//       .toLowerCase()
//       .trim()
//       .replace(/[\s\W-]+/g, '-')
//       .replace(/^-+|-+$/g, '');
//   }
// private validateSpecifications(specs?: any[]) {
//   return (specs ?? []).map((spec) => {
//     if (!spec.name) {
//       throw new BadRequestException('Each specification must have a name');
//     }

//     const enumValue = InputType[spec.inputType as keyof typeof InputType];
//     if (!enumValue) {
//       throw new BadRequestException(`Invalid inputType: ${spec.inputType}`);
//     }

//     return {
//       name: spec.name,
//       slug: spec.slug || this.slugify(spec.name),
//       inputType: enumValue,
//       suggestions: spec.suggestions ?? [],
//       required: !!spec.required, // false if undefined
//     };
//   });
// }

//   async create(dto: CreateStationDto) {
//     const { documentations, flowcharts, specifications, ...stationData } = dto;

//     const validatedSpecs = this.validateSpecifications(specifications);

//     return this.prisma.station.create({
//       data: {
//         ...stationData,
//         documentations: { create: documentations ?? [] },
//         flowcharts: { create: flowcharts ?? [] },
//         specifications: { create: validatedSpecs },
//       },
//       include: {
//         documentations: true,
//         flowcharts: true,
//         specifications: true,
//       },
//     });
//   }

//   async findAll() {
//     return this.prisma.station.findMany({
//       include: {
//         documentations: true,
//         flowcharts: true,
//         specifications: true,
//       },
//     });
//   }

//   async findOne(id: string) {
//     const station = await this.prisma.station.findUnique({
//       where: { id },
//       include: {
//         documentations: true,
//         flowcharts: true,
//         specifications: true,
//       },
//     });

//     if (!station) throw new NotFoundException('Station not found');
//     return station;
//   }

//   // async update(id: string, dto: UpdateStationDto) {
//   //   const { documentations, flowcharts, specifications, ...stationData } = dto;

//   //   const validatedSpecs = this.validateSpecifications(specifications);

//   //   // Clean up previous nested entities before recreating them
//   //   await this.prisma.documentation.deleteMany({ where: { stationId: id } });
//   //   await this.prisma.flowchart.deleteMany({ where: { stationId: id } });
//   //   await this.prisma.specification.deleteMany({ where: { stationId: id } });

//   //   return this.prisma.station.update({
//   //     where: { id },
//   //     data: {
//   //       ...stationData,
//   //       documentations: { create: documentations ?? [] },
//   //       flowcharts: { create: flowcharts ?? [] },
//   //       specifications: { create: validatedSpecs },
//   //     },
//   //     include: {
//   //       documentations: true,
//   //       flowcharts: true,
//   //       specifications: true,
//   //     },
//   //   });
//   // }


// // async update(id: string, dto: UpdateStationDto) {
// //   const { documentations, flowcharts, specifications, ...stationData } = dto;

// //   // Start with basic data object
// //   const data: any = { ...stationData };

// //   // Conditionally handle specifications
// //   if (specifications) {
// //     await this.prisma.specification.deleteMany({ where: { stationId: id } });
// //     const validatedSpecs = this.validateSpecifications(specifications);
// //     data.specifications = { create: validatedSpecs };
// //   }

// //   // Conditionally handle flowcharts
// //   if (flowcharts) {
// //     await this.prisma.flowchart.deleteMany({ where: { stationId: id } });
// //     data.flowcharts = { create: flowcharts };
// //   }

// //   // Conditionally handle documentations
// //   if (documentations) {
// //     await this.prisma.documentation.deleteMany({ where: { stationId: id } });
// //     data.documentations = { create: documentations };
// //   }

// //   // Final update call
// //   return this.prisma.station.update({
// //     where: { id },
// //     data,
// //     include: {
// //       documentations: true,
// //       flowcharts: true,
// //       specifications: true,
// //     },
// //   });
// // }

// // async update(id: string, dto: UpdateStationDto) {
// //   const { documentations, flowcharts, specifications, ...stationData } = dto;

// //   const data: any = { ...stationData };

// //   // ⚙️ Handle specifications (update or recreate if needed)
// //   if (specifications?.length) {
// //     // Optionally: match by slug or ID for better upsert
// //     await this.prisma.specification.deleteMany({ where: { stationId: id } });

// //     const validatedSpecs = this.validateSpecifications(specifications);
// //     data.specifications = { create: validatedSpecs };
// //   }

// //   // ⚙️ Handle flowcharts
// //   if (flowcharts?.length) {
// //     await this.prisma.flowchart.deleteMany({ where: { stationId: id } });
// //     data.flowcharts = { create: flowcharts };
// //   }

// //   // ⚙️ Handle documentations
// //   if (documentations?.length) {
// //     await this.prisma.documentation.deleteMany({ where: { stationId: id } });
// //     data.documentations = { create: documentations };
// //   }

// //   // 🔄 Update station with updated parts
// //   return this.prisma.station.update({
// //     where: { id },
// //     data,
// //     include: {
// //       documentations: true,
// //       flowcharts: true,
// //       specifications: true,
// //     },
// //   });
// // }

// async update(id: string, dto: UpdateStationDto) {
//   const {
//     documentations,
//     flowcharts,
//     specifications,
//     specificationValues,
//     ...stationData
//   } = dto;

//   // Step 1: Update basic station fields
//   await this.prisma.station.update({
//     where: { id },
//     data: stationData,
//   });

 

// // Step 2: Update or Create Documentations
// if (documentations?.length) {
//   for (const doc of documentations) {
//     if (!doc.fileUrl) continue; // Skip if no fileUrl provided

//     // Try to find an existing doc with same stationId and fileUrl
//     const existing = await this.prisma.documentation.findFirst({
//       where: {
//         stationId: id,
//         fileUrl: doc.fileUrl,
//       },
//     });

//     if (existing) {
//       // Update description only
//       await this.prisma.documentation.update({
//         where: { id: existing.id },
//         data: {
//           description: doc.description ?? '',
//         },
//       });
//     } else {
//       // Create new if not exists
//       await this.prisma.documentation.create({
//         data: {
//           stationId: id,
//           fileUrl: doc.fileUrl,
//           description: doc.description ?? '',
//         },
//       });
//     }
//   }
// }

// // Step 3: Update or Create Flowcharts
// if (flowcharts?.length) {
//   for (const flow of flowcharts) {
//     if (!flow.fileUrl) continue;

//     const existing = await this.prisma.flowchart.findFirst({
//       where: {
//         stationId: id,
//         fileUrl: flow.fileUrl,
//       },
//     });

//     if (existing) {
//       await this.prisma.flowchart.update({
//         where: { id: existing.id },
//         data: {
//           description: flow.description ?? '',
//         },
//       });
//     } else {
//       await this.prisma.flowchart.create({
//         data: {
//           stationId: id,
//           fileUrl: flow.fileUrl,
//           description: flow.description ?? '',
//         },
//       });
//     }
//   }
// }

  
//   // Step 4: Update existing Specifications only
//   if (specifications?.length) {
//     for (const spec of specifications) {
//       const slug = spec.slug || this.slugify(spec.name);

//       const existing = await this.prisma.specification.findFirst({
//         where: {
//           stationId: id,
//           name: spec.name,
//         },
//       });

//       if (existing) {
//         await this.prisma.specification.update({
//           where: { id: existing.id },
//           data: {
//             ...spec,
//             slug,
//           },
//         });
//       }
//     }
//   }

//   // Step 5: Update existing Specification Values only
//   if (specificationValues?.length) {
//     for (const value of specificationValues) {
//       if (!value.specificationId) continue;

//       const existing = await this.prisma.stationSpecification.findUnique({
//         where: {
//           stationId_specificationId: {
//             stationId: id,
//             specificationId: value.specificationId,
//           },
//         },
//       });

//       if (existing) {
//         await this.prisma.stationSpecification.update({
//           where: {
//             stationId_specificationId: {
//               stationId: id,
//               specificationId: value.specificationId,
//             },
//           },
//           data: {
//             value: value.value,
//             unit: value.unit,
//           },
//         });
//       }
//     }
//   }

//   // Step 6: Return updated station with nested data
//   return this.prisma.station.findUnique({
//     where: { id },
//     include: {
//       documentations: true,
//       flowcharts: true,
//       specifications: true,
//     },
//   });
// }

  
//   async remove(id: string) {
//     return this.prisma.station.delete({ where: { id } });
//   }
// }

