



// import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
// import { CreateMpiDto, UpdateMpiDto } from './dto/mpi.dto';
// import { PrismaService } from 'prisma/prisma.service';

// @Injectable()
// export class MpiService {
//   constructor(private readonly prisma: PrismaService) {}

//   private readonly includeRelations = {
//     stations: {
//       include: {
//         specifications: {
//           include: {
//             stationSpecifications: true,
//           },
//         },
//         documentations: true,
//       },
//     },
//      orderForms: {
//     include: {
//       services: true, // ✅ Add this to get services in each order
//     },
//   },
//     checklists: {
//       include: {
//         checklistItems: true,
//       },
//     },
//     mpiDocs: true,
//     stationMpiDocuments: true,
//   };

//   async create(data: CreateMpiDto) {
//     try {
//       const createdMpi = await this.prisma.mPI.create({
//         data: {
//           mpiName: data.mpiName,
//           assemblyName: data.assemblyName,
//           customer: data.customer,
//           Instruction: data.Instruction,
//         },
//       });

//       if (data.stationMpiDocuments?.length) {
//         for (const doc of data.stationMpiDocuments) {
//           if (doc.id) {
//             await this.prisma.stationMpiDocument.update({
//               where: { id: doc.id },
//               data: { mpiId: createdMpi.id },
//             });
//           } else {
//             if (!doc.stationId || !doc.fileUrl) {
//               throw new Error('Station ID and fileUrl are required for new StationMpiDocument');
//             }
//             await this.prisma.stationMpiDocument.create({
//               data: {
//                 fileUrl: doc.fileUrl,
//                 description: doc.description,
//                 originalName: doc.originalName,
//                 stationId: doc.stationId,
//                 mpiId: createdMpi.id,
//               },
//             });
//           }
//         }
//       }

//       if (data.orderForms?.length) {
//         for (const form of data.orderForms) {
          
//    console.log('Frontend OrderForm dates:', {
//           distributionDate_raw: form.distributionDate,
//           requiredBy_raw: form.requiredBy,
//         });
          


//             const distributionDate = form.distributionDate ? new Date(form.distributionDate) : null;
//         const requiredBy = form.requiredBy ? new Date(form.requiredBy) : null;

//   console.log('Converted dates for DB:', {
//           distributionDate_converted: distributionDate,
//           requiredBy_converted: requiredBy,
//         });

//           const orderform = await this.prisma.orderForm.create({
//             data: {
//               mpiId: createdMpi.id,
//               OrderType: form.OrderType ?? [],
//               distributionDate: form.distributionDate ?? null,
//                   // distributionDate: form.distributionDate ? new Date(form.distributionDate) : null,

//               requiredBy: form.requiredBy ?? null,
//                   // requiredBy: form.requiredBy ? new Date(form.requiredBy) : null,

//               changeOrderNumber: form.changeOrderNumber ?? null,
//               revision: form.revision ?? null,
//               otherAttachments: form.otherAttachments ?? null,
//               fileAction: form.fileAction ?? [],
//                services: form.serviceIds
//       ? {
//           connect: form.serviceIds.map((id) => ({ id })),
//         }
//       : undefined,
//             },
//           });
//                   console.log('OrderForm stored in DB:', orderform);

//         }
//       }

//       if (data.mpiDocs?.length) {
//         for (const doc of data.mpiDocs) {
//           await this.prisma.mpiDocumentation.create({
//             data: {
//               fileUrl: doc.fileUrl,
//               description: doc.description,
//               originalName: doc.originalName,
//               mpiId: createdMpi.id,
//             },
//           });
//         }
//       }

//       if (data.stations?.length) {
//         for (const station of data.stations) {
//           if (!station.id) throw new Error('Station ID missing');

//           await this.prisma.station.update({
//             where: { id: station.id },
//             data: { mpiId: createdMpi.id },
//           });

//           if (station.specificationValues?.length) {
//             for (const spec of station.specificationValues) {
//               if (!spec.specificationId) throw new Error('Specification ID missing');

//               await this.prisma.stationSpecification.upsert({
//                 where: {
//                   stationId_specificationId: {
//                     stationId: station.id,
//                     specificationId: spec.specificationId,
//                   },
//                 },
//                 update: { value: spec.value, unit: spec.unit },
//                 create: {
//                   stationId: station.id,
//                   specificationId: spec.specificationId,
//                   value: spec.value,
//                   unit: spec.unit,
//                 },
//               });
//             }
//           }
//         }
//       }

//       if (data.checklists?.length) {
//         for (const checklist of data.checklists) {
//           const createdChecklist = await this.prisma.checklist.create({
//             data: { name: checklist.name, mpiId: createdMpi.id },
//           });

//           if (checklist.checklistItems?.length) {
//             const checklistItemsData = checklist.checklistItems
//               .filter(item => !!item.description)
//               .map(item => ({
//                 sectionId: createdChecklist.id,
//                 description: item.description!,
//                 required: item.required ?? true,
//                 remarks: item.remarks ?? '',
//                 createdBy: item.createdBy ?? 'user',
//                 isActive: item.isActive ?? true,
//               }));

//             if (checklistItemsData.length) {
//               await this.prisma.checklistItem.createMany({ data: checklistItemsData });
//             }
//           }
//         }
//       }

//       return this.findOne(createdMpi.id);
//     } catch (error) {
//       console.error('❌ Error creating MPI:', error);
//       throw new InternalServerErrorException(`Create failed: ${error.message}`);
//     }
//   }

//   async update(id: string, data: UpdateMpiDto) {
//     try {
//           console.log('📥 Incoming Update MPI data:', JSON.stringify(data, null, 2));

//       const updatedMpi = await this.prisma.mPI.update({
//         where: { id },
//         data: {
//           mpiName: data.mpiName,
//           assemblyName: data.assemblyName,
//           customer: data.customer,
//           Instruction: data.Instruction,
//         },
//       });

//       if (data.stationMpiDocuments?.length) {
//         for (const doc of data.stationMpiDocuments) {
//           if (!doc.stationId || !doc.fileUrl) {
//             throw new Error('Station ID and fileUrl are required for StationMpiDocument');
//           }
//           await this.prisma.stationMpiDocument.create({
//             data: {
//               fileUrl: doc.fileUrl,
//               description: doc.description,
//               originalName: doc.originalName,
//               stationId: doc.stationId,
//               mpiId: id,
//             },
//           });
//         }
//       }



// if (data.orderForms?.length) {
//   for (const form of data.orderForms) {
//       console.log('Frontend OrderForm dates:', {
//           distributionDate_raw: form.distributionDate,
//           requiredBy_raw: form.requiredBy,
//         });

//         const distributionDate = form.distributionDate ? new Date(form.distributionDate) : undefined;
//         const requiredBy = form.requiredBy ? new Date(form.requiredBy) : undefined;

//         console.log('✅ Converted dates for DB:', {
//           distributionDate_converted: distributionDate,
//           requiredBy_converted: requiredBy,
//         });

//     const commonData = {
//       OrderType: form.OrderType,
//       distributionDate: form.distributionDate ? new Date(form.distributionDate) : undefined,
//       requiredBy: form.requiredBy ? new Date(form.requiredBy) : undefined,
//       internalOrderNumber: form.internalOrderNumber,
//       changeOrderNumber: form.changeOrderNumber,
//       revision: form.revision,
//       otherAttachments: form.otherAttachments,
//       fileAction: form.fileAction,
//       services: form.serviceIds?.length
//         ? {
//             connect: form.serviceIds.map((id) => ({ id })),
//           }
//         : undefined,
//     };

//     if (form.id) {
//       const updatedOrder = await this.prisma.orderForm.update({
//         where: { id: form.id },
//         data: {
//           ...commonData,
//           // In update, use `set` to replace old service relations
//           services: {
//             set: form.serviceIds?.map((id) => ({ id })) ?? [],
//           },
//         },
//       });

      
//           console.log('Updated OrderForm in DB:', updatedOrder);
//     } else {
//         const newOrder = await this.prisma.orderForm.create({
//         data: {
//           ...commonData,
//           mpiId: id,
//         },
//       });

//          console.log('💾 Created new OrderForm in DB:', newOrder);
//     }
//   }
// }


//       if (data.mpiDocs?.length) {
//         for (const doc of data.mpiDocs) {
//           if (doc.id) {
//             await this.prisma.mpiDocumentation.update({
//               where: { id: doc.id },
//               data: {
//                 fileUrl: doc.fileUrl,
//                 description: doc.description,
//                 originalName: doc.originalName,
//               },
//             });
//           } else {
//             await this.prisma.mpiDocumentation.create({
//               data: {
//                 fileUrl: doc.fileUrl,
//                 description: doc.description,
//                 originalName: doc.originalName,
//                 mpiId: id,
//               },
//             });
//           }
//         }
//       }

//       if (data.stations?.length) {
//         await this.prisma.station.updateMany({
//           where: { mpiId: id },
//           data: { mpiId: null },
//         });

//         for (const station of data.stations) {
//           if (!station.id) throw new Error('Station ID is required');

//           await this.prisma.station.update({
//             where: { id: station.id },
//             data: {
//               mpiId: id,
//               status: station.status,
//               description: station.description,
//               location: station.location,
//               operator: station.operator,
//               priority: station.priority ?? 0,
//               Note: station.Note ?? [],
//             },
//           });

//           if (station.specificationValues?.length) {
//             for (const spec of station.specificationValues) {
//               if (!spec.specificationId) {
//                 throw new Error(`Missing specificationId for station: ${station.id}`);
//               }

//               await this.prisma.stationSpecification.upsert({
//                 where: {
//                   stationId_specificationId: {
//                     stationId: station.id,
//                     specificationId: spec.specificationId,
//                   },
//                 },
//                 update: { value: spec.value, unit: spec.unit },
//                 create: {
//                   stationId: station.id,
//                   specificationId: spec.specificationId,
//                   value: spec.value,
//                   unit: spec.unit,
//                 },
//               });
//             }
//           }
//         }
//       }

//       if (data.checklists?.length) {
//         for (const checklist of data.checklists) {
//           if (!checklist.id) {
//             const createdChecklist = await this.prisma.checklist.create({
//               data: {
//                 name: checklist.name || 'Untitled Checklist',
//                 mpiId: id,
//               },
//             });

//             if (checklist.checklistItems?.length) {
//               const checklistItemsData = checklist.checklistItems
//                 .filter(item => !!item.description)
//                 .map(item => ({
//                   sectionId: createdChecklist.id,
//                   description: item.description!,
//                   required: item.required ?? true,
//                   remarks: item.remarks ?? '',
//                   createdBy: item.createdBy ?? 'user',
//                   isActive: item.isActive ?? true,
//                 }));

//               await this.prisma.checklistItem.createMany({
//                 data: checklistItemsData,
//               });
//             }
//           } else {
//             await this.prisma.checklist.update({
//               where: { id: checklist.id },
//               data: { name: checklist.name },
//             });

//             if (checklist.checklistItems?.length) {
//               for (const item of checklist.checklistItems) {
//                 if (item.id) {
//                   await this.prisma.checklistItem.update({
//                     where: { id: item.id },
//                     data: {
//                       description: item.description,
//                       category: item.category,
//                       required: item.required ?? true,
//                       remarks: item.remarks ?? '',
//                       createdBy: item.createdBy ?? 'system',
//                       isActive: item.isActive ?? true,
//                     },
//                   });
//                 } else {
//                   await this.prisma.checklistItem.create({
//                     data: {
//                       sectionId: checklist.id,
//                       description: item.description!,
//                       required: item.required ?? true,
//                       remarks: item.remarks ?? '',
//                       createdBy: item.createdBy ?? 'user',
//                       isActive: item.isActive ?? true,
//                     },
//                   });
//                 }
//               }
//             }
//           }
//         }
//       }

//       return this.findOne(id);
//     } catch (error) {
//       console.error('❌ Error updating MPI:', error);
//       throw new InternalServerErrorException(`Update failed: ${error.message}`);
//     }
//   }

//   // async findAll() {
//   //   try {
//   //     return await this.prisma.mPI.findMany({
//   //       include: this.includeRelations,
//   //     });
//   //   } catch (error) {
//   //     console.error('❌ Error fetching all MPIs:', error);
//   //     throw new InternalServerErrorException('Could not fetch MPI list');
//   //   }
//   // }

// async findAll() {
//   try {
//     const mpis = await this.prisma.mPI.findMany({
//       include: this.includeRelations,
//     });

//     // ✅ Log dates for verification
//     mpis.forEach((mpi) => {
//       mpi.orderForms.forEach((form) => {
//         console.log('📤 Retrieved OrderForm dates for MPI:', mpi.id, {
//           distributionDate_fromDB: form.distributionDate,
//           requiredBy_fromDB: form.requiredBy,
//         });
//       });
//     });

//     return mpis;
//   } catch (error) {
//     console.error('❌ Error fetching all MPIs:', error);
//     throw new InternalServerErrorException('Could not fetch MPI list');
//   }
// }


//   async findOne(id: string) {
//   try {
//     const mpi = await this.prisma.mPI.findUnique({
//       where: { id },
//       include: this.includeRelations,
//     });

//     if (!mpi) throw new NotFoundException('MPI not found');

//     // ✅ Log dates for verification
//     mpi.orderForms.forEach((form) => {
//       console.log(`📤 Retrieved OrderForm dates for MPI ${id}:`, {
//         distributionDate_fromDB: form.distributionDate,
//         requiredBy_fromDB: form.requiredBy,
//       });
//     });

//     return mpi;
//   } catch (error) {
//     console.error(`❌ Error fetching MPI with ID ${id}:`, error);
//     throw error;
//   }
// }

//   // async findOne(id: string) {
//   //   try {
//   //     const mpi = await this.prisma.mPI.findUnique({
//   //       where: { id },
//   //       include: this.includeRelations,
//   //     });

//   //     if (!mpi) throw new NotFoundException('MPI not found');
//   //     return mpi;
//   //   } catch (error) {
//   //     console.error(`❌ Error fetching MPI with ID ${id}:`, error);
//   //     throw error;
//   //   }
//   // }

//   async remove(id: string) {
//     try {
//       return await this.prisma.mPI.delete({ where: { id } });
//     } catch (error) {
//       console.error('❌ Error deleting MPI:', error);
//       throw new InternalServerErrorException(`Delete failed: ${error.message}`);
//     }
//   }
// }




















