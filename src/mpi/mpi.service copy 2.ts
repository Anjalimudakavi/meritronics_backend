
// // import { Prisma } from '@prisma/client';

// // import { Injectable, NotFoundException } from '@nestjs/common';
// // import { CreateMpiDto, UpdateMpiDto, CreateChecklistItemDto } from './dto/mpi.dto';
// // import { PrismaService } from 'prisma/prisma.service';
// // import { CHECKLIST_TEMPLATE } from './template/checklist-template';

// // @Injectable()
// // export class MpiService {
// //   constructor(private readonly prisma: PrismaService) {}

// //   private readonly includeRelations = {
// //     stations: {
// //       include: {
// //         specifications: {
// //           include: {
// //             stationSpecifications: true,
// //           },
// //         },
// //       },
// //     },
// //     orderForms: true,
// //     checklists: {
// //       include: {
// //         checklistItems: true,
// //       },
// //     },
// //      mpiDocs: true,
// //   };

// // async create(data: CreateMpiDto) {
// //   // Step 1: Create MPI record
// //   const createdMpi = await this.prisma.mPI.create({
// //     data: {
// //       jobId: data.jobId,
// //       assemblyId: data.assemblyId,

      
// //       customer: data.customer, 

// // Instruction: data.Instruction,

// //     },
// //   });


// // if (data.orderForms) {
// //   await this.prisma.orderForm.create({
// //     data: {
// //       ...data.orderForms,
// //       mpiId: createdMpi.id,
// //     },
// //   });
// // }




  
// // if (data.stations?.length) {
// //   for (const station of data.stations) {
// //     if (!station.id) throw new Error('Station ID missing');

// //     // Link station to MPI
// //     await this.prisma.station.update({
// //       where: { id: station.id },
// //       data: { mpiId: createdMpi.id },
// //     });

// //     // Handle specification values
// //     if (station.specificationValues?.length) {
// //       for (const spec of station.specificationValues) {
// //         if (!spec.specificationId) throw new Error('Specification ID missing');

// //         await this.prisma.stationSpecification.upsert({
// //           where: {
// //             stationId_specificationId: {
// //               stationId: station.id,
// //               specificationId: spec.specificationId,
// //             },
// //           },
// //           update: {
// //             value: spec.value,
// //             unit: spec.unit,
// //           },
// //           create: {
// //             stationId: station.id,
// //             specificationId: spec.specificationId,
// //             value: spec.value,
// //             unit: spec.unit,
// //           },
// //         });
// //       }
// //     }
// //   }
// // }


// // if (data.checklists?.length) {
// //   for (const userChecklist of data.checklists) {
// //     const createdChecklist = await this.prisma.checklist.create({
// //       data: {
// //         name: userChecklist.name,
// //         mpiId: createdMpi.id,
// //       },
// //     });

// //     if (userChecklist.checklistItems?.length) {
// //       const checklistItemsData: Prisma.ChecklistItemCreateManyInput[] = userChecklist.checklistItems
// //         .filter(item => !!item.description)
// //         .map(item => ({
// //           sectionId: createdChecklist.id,
// //           description: item.description!, // safe because we filtered above
// //           required: item.required ?? true,
// //           remarks: item.remarks ?? '',
// //           createdBy: item.createdBy ?? 'user',
// //           isActive: item.isActive ?? true,
// //         }));

// //       if (checklistItemsData.length) {
// //         await this.prisma.checklistItem.createMany({ data: checklistItemsData });
// //       }
// //     }
// //   }
// // }

  
// //   // Step 5: Return MPI with all relations
// //   return this.findOne(createdMpi.id);
// // }


// //   async findAll() {
// //     return this.prisma.mPI.findMany({
// //       include: this.includeRelations,
// //     });
// //   }

// //   async findOne(id: string) {
// //     const mpi = await this.prisma.mPI.findUnique({
// //       where: { id },
// //       include: this.includeRelations,
// //     });

// //     if (!mpi) {
// //       throw new NotFoundException('MPI not found');
// //     }

// //     return mpi;
// //   }



// // async update(id: string, data: UpdateMpiDto) {
// //   console.log('🔄 Starting MPI update for ID:', id);
// //   console.log('📝 Update data received:', JSON.stringify(data, null, 2));

// //   // Step 1: Update MPI base fields
// //   const updatedMpi = await this.prisma.mPI.update({
// //     where: { id },
// //     data: {
// //       jobId: data.jobId,
// //       assemblyId: data.assemblyId,
// //       customer: data.customer,
// // Instruction: data.Instruction,
// //     },
// //   });

// //   // Step 2: Update Order Form
// //   if (data.orderForms) {
// //     console.log('📋 Updating order forms...');
// //     const existingOrderForm = await this.prisma.orderForm.findFirst({
// //       where: { mpiId: id },
// //     });

// //     if (existingOrderForm?.id) {
// //       await this.prisma.orderForm.update({
// //         where: { id: existingOrderForm.id },
// //         data: {
// //           ...data.orderForms,
// //         },
// //       });
// //     }
// //   }

// //   // Step 3: Update Stations - ONLY specifications, not station metadata
// //   if (data.stations?.length) {
// //     console.log('🏭 Processing stations:', data.stations.length);
    
// //     for (const station of data.stations) {
// //       if (!station.id) throw new Error('Station ID is required');

// //       console.log(`📊 Processing station ${station.id} with ${station.specificationValues?.length || 0} specifications`);

// //       // ONLY update specifications, don't touch station metadata
// //       if (station.specificationValues?.length) {
// //         for (const spec of station.specificationValues) {
// //           if (!spec.specificationId) {
// //             throw new Error(`Missing specificationId for station: ${station.id}`);
// //           }

// //           console.log(`  ✏️ Upserting spec ${spec.specificationId} with value: ${spec.value}`);

// //           await this.prisma.stationSpecification.upsert({
// //             where: {
// //               stationId_specificationId: {
// //                 stationId: station.id,
// //                 specificationId: spec.specificationId,
// //               },
// //             },
// //             update: {
// //               value: spec.value,
// //               unit: spec.unit,
// //             },
// //             create: {
// //               stationId: station.id,
// //               specificationId: spec.specificationId,
// //               value: spec.value,
// //               unit: spec.unit,
// //             },
// //           });
// //         }
// //       }
// //     }
// //   }

// //   // Step 4: Handle Checklists - Support both existing updates AND new creations
// //   if (data.checklists?.length) {
// //     console.log('📋 Processing checklists:', data.checklists.length);
    
// //     for (const checklist of data.checklists) {
// //       console.log(`📝 Processing checklist: ${checklist.name} (ID: ${checklist.id || 'NEW'})`);

// //       if (!checklist.id) {
// //         // CREATE NEW CHECKLIST
// //         console.log('  ➕ Creating new checklist...');
        
// //         const createdChecklist = await this.prisma.checklist.create({
// //           data: {
// //             name: checklist.name || 'Untitled Checklist',
// //             mpiId: id,
// //           },
// //         });

// //         console.log(`  ✅ Created checklist with ID: ${createdChecklist.id}`);

// //         // Create checklist items for new checklist
// //         if (checklist.checklistItems?.length) {
// //           console.log(`  📋 Creating ${checklist.checklistItems.length} checklist items...`);
          
// //           const checklistItemsData = checklist.checklistItems
// //             .filter(item => !!item.description)
// //             .map(item => ({
// //               sectionId: createdChecklist.id,
// //               description: item.description!,
// //               required: item.required ?? true,
// //               remarks: item.remarks ?? '',
           
// //               createdBy: item.createdBy ?? 'user',
// //               isActive: item.isActive ?? true,
// //             }));

// //           if (checklistItemsData.length) {
// //             await this.prisma.checklistItem.createMany({ 
// //               data: checklistItemsData 
// //             });
// //             console.log(`  ✅ Created ${checklistItemsData.length} checklist items`);
// //           }
// //         }
// //       } else {
// //         // UPDATE EXISTING CHECKLIST
// //         console.log('  ✏️ Updating existing checklist...');
        
// //         await this.prisma.checklist.update({
// //           where: { id: checklist.id },
// //           data: {
// //             name: checklist.name,
// //           },
// //         });

// //         // Handle checklist items for existing checklist
// //         if (checklist.checklistItems?.length) {
// //           console.log(`  📋 Processing ${checklist.checklistItems.length} checklist items...`);
          
// //           for (const item of checklist.checklistItems) {
// //             if (item.id) {
// //               // Update existing item
// //               console.log(`    ✏️ Updating item ${item.id}: ${item.description}`);
              
// //               await this.prisma.checklistItem.update({
// //                 where: { id: item.id },
// //                 data: {
// //                   description: item.description,
// //                   category: item.category,
// //                   required: item.required ?? true,
// //                   remarks: item.remarks ?? '',
// //                   createdBy: item.createdBy ?? 'system',
// //                   isActive: item.isActive ?? true,
// //                 },
// //               });
// //             } else {
// //               // Create new item for existing checklist
// //               console.log(`    ➕ Creating new item: ${item.description}`);
              
// //               await this.prisma.checklistItem.create({
// //                 data: {
// //                   sectionId: checklist.id,
// //                   description: item.description!,
// //                   required: item.required ?? true,
// //                   remarks: item.remarks ?? '',
// //                   createdBy: item.createdBy ?? 'user',
// //                   isActive: item.isActive ?? true,
// //                 },
// //               });
// //             }
// //           }
// //         }
// //       }
// //     }
// //   }

// //   console.log('✅ MPI update completed, fetching updated data...');

// //   // Final: return full updated MPI with nested includes
// //   return this.prisma.mPI.findUnique({
// //     where: { id },
// //     include: {
// //       orderForms: true,
// //       stations: {
// //         include: {
// //           stationSpecifications: true,
// //         },
// //       },
// //       checklists: {
// //         include: {
// //           checklistItems: true,
// //         },
// //       },
// //     },
// //   });
// // }

// //   async remove(id: string) {
// //     return this.prisma.mPI.delete({ where: { id } });
// //   }
// // }




// import { Prisma } from '@prisma/client';

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateMpiDto, UpdateMpiDto, CreateChecklistItemDto } from './dto/mpi.dto';
// import { PrismaService } from 'prisma/prisma.service';
// import { CHECKLIST_TEMPLATE } from './template/checklist-template';

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
//            documentations: true,

//       },
//     },
//     orderForms: true,
//     checklists: {
//       include: {
//         checklistItems: true,
//       },
//     },
//      mpiDocs: true,
//      stationMpiDocuments: true, // ✅ ADD THIS LINE
//   };

// async create(data: CreateMpiDto) {
//   // Step 1: Create MPI record
//   const createdMpi = await this.prisma.mPI.create({
//     data: {
//       jobId: data.jobId,
//       assemblyId: data.assemblyId,

      
//       customer: data.customer, 

// Instruction: data.Instruction,

//     },
//   });


// if (data.orderForms) {
//   await this.prisma.orderForm.create({
//     data: {
//       ...data.orderForms,
//       mpiId: createdMpi.id,
//     },
//   });
// }


// if (data.mpiDocs?.length) {
//   for (const doc of data.mpiDocs) {
//     await this.prisma.mpiDocumentation.create({
//       data: {
//         fileUrl: doc.fileUrl,
//         description: doc.description,
//         mpiId: createdMpi.id,
//       },
//     });
//   }
// }


  
// if (data.stations?.length) {
//   for (const station of data.stations) {
//     if (!station.id) throw new Error('Station ID missing');

//     // Link station to MPI
//     await this.prisma.station.update({
//       where: { id: station.id },
//       data: { mpiId: createdMpi.id },
//     });
// //  if (station.documentations?.length) {
// //       for (const doc of station.documentations) {
// //         await this.prisma.documentation.create({
// //           data: {
// //             stationId: station.id,
// //             fileUrl: doc.fileUrl,
// //             description: doc.description,
// //           },
// //         });
// //       }
// //     }
//     // Handle specification values
//     if (station.specificationValues?.length) {
//       for (const spec of station.specificationValues) {
//         if (!spec.specificationId) throw new Error('Specification ID missing');

//         await this.prisma.stationSpecification.upsert({
//           where: {
//             stationId_specificationId: {
//               stationId: station.id,
//               specificationId: spec.specificationId,
//             },
//           },
//           update: {
//             value: spec.value,
//             unit: spec.unit,
//           },
//           create: {
//             stationId: station.id,
//             specificationId: spec.specificationId,
//             value: spec.value,
//             unit: spec.unit,
//           },
//         });
//       }
//     }
//   }
// }


// if (data.checklists?.length) {
//   for (const userChecklist of data.checklists) {
//     const createdChecklist = await this.prisma.checklist.create({
//       data: {
//         name: userChecklist.name,
//         mpiId: createdMpi.id,
//       },
//     });

//     if (userChecklist.checklistItems?.length) {
//       const checklistItemsData: Prisma.ChecklistItemCreateManyInput[] = userChecklist.checklistItems
//         .filter(item => !!item.description)
//         .map(item => ({
//           sectionId: createdChecklist.id,
//           description: item.description!, // safe because we filtered above
//           required: item.required ?? true,
//           remarks: item.remarks ?? '',
//           createdBy: item.createdBy ?? 'user',
//           isActive: item.isActive ?? true,
//         }));

//       if (checklistItemsData.length) {
//         await this.prisma.checklistItem.createMany({ data: checklistItemsData });
//       }
//     }
//   }
// }

  
//   // Step 5: Return MPI with all relations
//   return this.findOne(createdMpi.id);
// }


//   async findAll() {
//     return this.prisma.mPI.findMany({
//       include: this.includeRelations,
//     });
//   }

//   async findOne(id: string) {
//     const mpi = await this.prisma.mPI.findUnique({
//       where: { id },
//       include: this.includeRelations,
//     });

//     if (!mpi) {
//       throw new NotFoundException('MPI not found');
//     }

//     return mpi;
//   }



// // async update(id: string, data: UpdateMpiDto) {
// //   console.log('🔄 Starting MPI update for ID:', id);
// //   console.log('📝 Update data received:', JSON.stringify(data, null, 2));

// //   // Step 1: Update MPI base fields
// //   const updatedMpi = await this.prisma.mPI.update({
// //     where: { id },
// //     data: {
// //       jobId: data.jobId,
// //       assemblyId: data.assemblyId,
// //       customer: data.customer,
// // Instruction: data.Instruction,
// //     },
// //   });

// //   // Step 2: Update Order Form
// //   if (data.orderForms) {
// //     console.log('📋 Updating order forms...');
// //     const existingOrderForm = await this.prisma.orderForm.findFirst({
// //       where: { mpiId: id },
// //     });

// //     if (existingOrderForm?.id) {
// //       await this.prisma.orderForm.update({
// //         where: { id: existingOrderForm.id },
// //         data: {
// //           ...data.orderForms,
// //         },
// //       });
// //     }
// //   }

// //   // Step 3: Update Stations - ONLY specifications, not station metadata
// //   if (data.stations?.length) {
// //     console.log('🏭 Processing stations:', data.stations.length);
    
// //     for (const station of data.stations) {
// //       if (!station.id) throw new Error('Station ID is required');

// //       console.log(`📊 Processing station ${station.id} with ${station.specificationValues?.length || 0} specifications`);
// // // ✅ Add or update station documentations
// // // if (station.documentations?.length) {
// // //   console.log(`📂 Processing ${station.documentations.length} documentations for station ${station.id}...`);
  
// // //   for (const doc of station.documentations) {
// // //     if (doc.id) {
// // //       // ✅ Update existing station documentation
// // //       console.log(`  ✏️ Updating station doc ${doc.id}`);
// // //       await this.prisma.documentation.update({
// // //         where: { id: doc.id },
// // //         data: {
// // //           fileUrl: doc.fileUrl,
// // //           description: doc.description,
// // //         },
// // //       });
// // //     } else {
// // //       // ➕ Create new documentation
// // //       console.log(`  ➕ Creating new documentation for station ${station.id}`);
// // //       await this.prisma.documentation.create({
// // //         data: {
// // //           stationId: station.id,
// // //           fileUrl: doc.fileUrl,
// // //           description: doc.description,
// // //         },
// // //       });
// // //     }
// // //   }
// // // }



// // // if (station.documentations?.length) {
// // //   for (const doc of station.documentations) {
// // //     if (typeof doc.id === 'string') {
// // //       await this.prisma.documentation.update({
// // //         where: { id: doc.id },
// // //         data: {
// // //           fileUrl: doc.fileUrl,
// // //           description: doc.description,
// // //         },
// // //       });
// // //     } else {
// // //       await this.prisma.documentation.create({
// // //         data: {
// // //           stationId: station.id,
// // //           fileUrl: doc.fileUrl,
// // //           description: doc.description,
// // //         },
// // //       });
// // //     }
// // //   }
// // // }

// //       // ONLY update specifications, don't touch station metadata
// //       if (station.specificationValues?.length) {
// //         for (const spec of station.specificationValues) {
// //           if (!spec.specificationId) {
// //             throw new Error(`Missing specificationId for station: ${station.id}`);
// //           }

// //           console.log(`  ✏️ Upserting spec ${spec.specificationId} with value: ${spec.value}`);

// //           await this.prisma.stationSpecification.upsert({
// //             where: {
// //               stationId_specificationId: {
// //                 stationId: station.id,
// //                 specificationId: spec.specificationId,
// //               },
// //             },
// //             update: {
// //               value: spec.value,
// //               unit: spec.unit,
// //             },
// //             create: {
// //               stationId: station.id,
// //               specificationId: spec.specificationId,
// //               value: spec.value,
// //               unit: spec.unit,
// //             },
// //           });
// //         }
// //       }
// //     }
// //   }

// // // if (data.mpiDocs?.length) {
// // //   console.log(`📁 Processing ${data.mpiDocs.length} documentation files...`);

// // //   for (const doc of data.mpiDocs) {
// // //     if (doc.id) {
// // //       // ✅ Update existing document
// // //       console.log(`  ✏️ Updating document ${doc.id}`);
// // //       await this.prisma.mpiDocumentation.update({
// // //         where: { id: doc.id },
// // //         data: {
// // //           fileUrl: doc.fileUrl,
// // //           description: doc.description,
// // //         },
// // //       });
// // //     } else {
// // //       // ➕ Create new document
// // //       console.log(`  ➕ Creating new documentation entry`);
// // //       await this.prisma.mpiDocumentation.create({
// // //         data: {
// // //           mpiId: id,
// // //           fileUrl: doc.fileUrl,
// // //           description: doc.description,
// // //         },
// // //       });
// // //     }
// // //   }
// // // }

  
// //   // Step 4: Handle Checklists - Support both existing updates AND new creations
// //   if (data.checklists?.length) {
// //     console.log('📋 Processing checklists:', data.checklists.length);
    
// //     for (const checklist of data.checklists) {
// //       console.log(`📝 Processing checklist: ${checklist.name} (ID: ${checklist.id || 'NEW'})`);

// //       if (!checklist.id) {
// //         // CREATE NEW CHECKLIST
// //         console.log('  ➕ Creating new checklist...');
        
// //         const createdChecklist = await this.prisma.checklist.create({
// //           data: {
// //             name: checklist.name || 'Untitled Checklist',
// //             mpiId: id,
// //           },
// //         });

// //         console.log(`  ✅ Created checklist with ID: ${createdChecklist.id}`);

// //         // Create checklist items for new checklist
// //         if (checklist.checklistItems?.length) {
// //           console.log(`  📋 Creating ${checklist.checklistItems.length} checklist items...`);
          
// //           const checklistItemsData = checklist.checklistItems
// //             .filter(item => !!item.description)
// //             .map(item => ({
// //               sectionId: createdChecklist.id,
// //               description: item.description!,
// //               required: item.required ?? true,
// //               remarks: item.remarks ?? '',
           
// //               createdBy: item.createdBy ?? 'user',
// //               isActive: item.isActive ?? true,
// //             }));

// //           if (checklistItemsData.length) {
// //             await this.prisma.checklistItem.createMany({ 
// //               data: checklistItemsData 
// //             });
// //             console.log(`  ✅ Created ${checklistItemsData.length} checklist items`);
// //           }
// //         }
// //       } else {
// //         // UPDATE EXISTING CHECKLIST
// //         console.log('  ✏️ Updating existing checklist...');
        
// //         await this.prisma.checklist.update({
// //           where: { id: checklist.id },
// //           data: {
// //             name: checklist.name,
// //           },
// //         });

// //         // Handle checklist items for existing checklist
// //         if (checklist.checklistItems?.length) {
// //           console.log(`  📋 Processing ${checklist.checklistItems.length} checklist items...`);
          
// //           for (const item of checklist.checklistItems) {
// //             if (item.id) {
// //               // Update existing item
// //               console.log(`    ✏️ Updating item ${item.id}: ${item.description}`);
              
// //               await this.prisma.checklistItem.update({
// //                 where: { id: item.id },
// //                 data: {
// //                   description: item.description,
// //                   category: item.category,
// //                   required: item.required ?? true,
// //                   remarks: item.remarks ?? '',
// //                   createdBy: item.createdBy ?? 'system',
// //                   isActive: item.isActive ?? true,
// //                 },
// //               });
// //             } else {
// //               // Create new item for existing checklist
// //               console.log(`    ➕ Creating new item: ${item.description}`);
              
// //               await this.prisma.checklistItem.create({
// //                 data: {
// //                   sectionId: checklist.id,
// //                   description: item.description!,
// //                   required: item.required ?? true,
// //                   remarks: item.remarks ?? '',
// //                   createdBy: item.createdBy ?? 'user',
// //                   isActive: item.isActive ?? true,
// //                 },
// //               });
// //             }
// //           }
// //         }
// //       }
// //     }
// //   }

// //   console.log('✅ MPI update completed, fetching updated data...');

// //   // Final: return full updated MPI with nested includes
// //  return this.prisma.mPI.findUnique({
// //   where: { id },
// //   include: this.includeRelations,
// // });

// // }



// async update(id: string, data: UpdateMpiDto) {
//   console.log('🔄 Starting MPI update for ID:', id);
//   console.log('📝 Update data received:', JSON.stringify(data, null, 2));

//   // Step 1: Update MPI base fields
//   const updatedMpi = await this.prisma.mPI.update({
//     where: { id },
//     data: {
//       jobId: data.jobId,
//       assemblyId: data.assemblyId,
//       customer: data.customer,
//       Instruction: data.Instruction,
//     },
//   });

//   // Step 2: Update Order Form
//   if (data.orderForms) {
//     console.log('📋 Updating order forms...');
//     const existingOrderForm = await this.prisma.orderForm.findFirst({
//       where: { mpiId: id },
//     });

//     if (existingOrderForm?.id) {
//       await this.prisma.orderForm.update({
//         where: { id: existingOrderForm.id },
//         data: {
//           ...data.orderForms,
//         },
//       });
//     }
//   }

//   // Step 3: Update selected stations and their specs
//   if (data.stations?.length) {
//     console.log('🏭 Updating station selections for MPI...');

//     // Unlink all previously assigned stations
//     await this.prisma.station.updateMany({
//       where: { mpiId: id },
//       data: { mpiId: null },
//     });

//     // Assign new stations
//     for (const station of data.stations) {
//       if (!station.id) throw new Error("Station ID is required");

//       console.log(`🔗 Linking station ${station.id} to MPI ${id}`);
//       await this.prisma.station.update({
//         where: { id: station.id },
//         data: {
//           mpiId: id,
//           status: station.status,
//           description: station.description,
//           location: station.location,
//           operator: station.operator,
//           priority: station.priority ?? 0,
//           Note: station.Note ?? [],
//         },
//       });

//       // Handle specificationValues
//       if (station.specificationValues?.length) {
//         for (const spec of station.specificationValues) {
//           if (!spec.specificationId) {
//             throw new Error(`Missing specificationId for station: ${station.id}`);
//           }

//           console.log(`  ✏️ Upserting spec ${spec.specificationId} with value: ${spec.value}`);
//           await this.prisma.stationSpecification.upsert({
//             where: {
//               stationId_specificationId: {
//                 stationId: station.id,
//                 specificationId: spec.specificationId,
//               },
//             },
//             update: {
//               value: spec.value,
//               unit: spec.unit,
//             },
//             create: {
//               stationId: station.id,
//               specificationId: spec.specificationId,
//               value: spec.value,
//               unit: spec.unit,
//             },
//           });
//         }
//       }
//     }
//   }

//   // Step 4: Checklists
//   if (data.checklists?.length) {
//     console.log('📋 Processing checklists:', data.checklists.length);

//     for (const checklist of data.checklists) {
//       if (!checklist.id) {
//         const createdChecklist = await this.prisma.checklist.create({
//           data: {
//             name: checklist.name || 'Untitled Checklist',
//             mpiId: id,
//           },
//         });

//         if (checklist.checklistItems?.length) {
//           const checklistItemsData = checklist.checklistItems
//             .filter(item => !!item.description)
//             .map(item => ({
//               sectionId: createdChecklist.id,
//               description: item.description!,
//               required: item.required ?? true,
//               remarks: item.remarks ?? '',
//               createdBy: item.createdBy ?? 'user',
//               isActive: item.isActive ?? true,
//             }));

//           if (checklistItemsData.length) {
//             await this.prisma.checklistItem.createMany({
//               data: checklistItemsData,
//             });
//           }
//         }
//       } else {
//         await this.prisma.checklist.update({
//           where: { id: checklist.id },
//           data: {
//             name: checklist.name,
//           },
//         });

//         if (checklist.checklistItems?.length) {
//           for (const item of checklist.checklistItems) {
//             if (item.id) {
//               await this.prisma.checklistItem.update({
//                 where: { id: item.id },
//                 data: {
//                   description: item.description,
//                   category: item.category,
//                   required: item.required ?? true,
//                   remarks: item.remarks ?? '',
//                   createdBy: item.createdBy ?? 'system',
//                   isActive: item.isActive ?? true,
//                 },
//               });
//             } else {
//               await this.prisma.checklistItem.create({
//                 data: {
//                   sectionId: checklist.id,
//                   description: item.description!,
//                   required: item.required ?? true,
//                   remarks: item.remarks ?? '',
//                   createdBy: item.createdBy ?? 'user',
//                   isActive: item.isActive ?? true,
//                 },
//               });
//             }
//           }
//         }
//       }
//     }
//   }

//   console.log('✅ MPI update completed, fetching updated data...');

//   return this.prisma.mPI.findUnique({
//     where: { id },
//     include: this.includeRelations,
//   });
// }




//   async remove(id: string) {
//     return this.prisma.mPI.delete({ where: { id } });
//   }
// }

