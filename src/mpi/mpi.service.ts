// import { Injectable } from '@nestjs/common';
// import { CreateOrUpdateMpiDto } from './dto/mpi.dto';
// import { PrismaService } from 'prisma/prisma.service';
// @Injectable()
// export class MpiService {
//   constructor(private readonly prisma: PrismaService) {}
// // async create(data: CreateOrUpdateMpiDto) {
//   const createdMpi = await this.prisma.mPI.create({
//     data: {
//       jobId: data.jobId,
//       assemblyId: data.assemblyId,
//     },
//   });

//   // Fetch with related stations and specifications
//   return this.prisma.mPI.findUnique({
//     where: { id: createdMpi.id },
//     include: {
//       stations: {
//         include: {
//           specifications: true,
//         },
//       },
//     },
//   });
// }


//   async findAll() {
//     return this.prisma.mPI.findMany({
//       include: {
//         stations: {
//           include: {
//             specifications: true,
//           },
//         },
//       },
//     });
//   }

//   async findOne(id: string) {
//     return this.prisma.mPI.findUnique({
//       where: { id },
//       include: {
//         stations: {
//           include: {
//             specifications: true,
//           },
//         },
//       },
//     });
//   }

// //nested update


// //   async update(id: string, data: CreateOrUpdateMpiDto) {
// //     // Basic fields update
// //     const updatedMpi = await this.prisma.mPI.update({
// //       where: { id },
// //       data: {
// //         jobId: data.jobId,
// //         assemblyId: data.assemblyId,
// //       },
// //     });

// //     // Optionally update stations (remove all and recreate)
// //     if (data.stations && data.stations.length > 0) {
// //       // Delete existing stations and specs
// //       await this.prisma.station.deleteMany({ where: { mpiId: id } });

// //       // Recreate stations with nested specifications
// //       await this.prisma.mPI.update({
// //         where: { id },
// //         data: {
// //           stations: {
// //             create: data.stations.map((station) => ({
// //               stationId: station.stationId,
// //               stationName: station.stationName,
// //               specifications: station.specifications
// //                 ? {
// //                     create: station.specifications.map((spec) => ({
// //                       name: spec.name,
// //                       slug: spec.slug,
// //                       inputType: spec.inputType || 'TEXT',
// //                     })),
// //                   }
// //                 : undefined,
// //             })),
// //           },
// //         },
// //       });
// //     }

// //     // Return updated with nested includes
// //     return this.findOne(id);
// //   }

// async update(id: string, data: CreateOrUpdateMpiDto) {
//   await this.prisma.mPI.update({
//     where: { id },
//     data: {
//       jobId: data.jobId,
//       assemblyId: data.assemblyId,
//     },
//   });

//   // Fetch updated MPI with related stations/specifications
//   return this.prisma.mPI.findUnique({
//     where: { id },
//     include: {
//       stations: {
//         include: {
//           specifications: true,
//         },
//       },
//     },
//   });
// }


//   async remove(id: string) {
//     return this.prisma.mPI.delete({ where: { id } });
//   }
// }



import { Prisma } from '@prisma/client';

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMpiDto, UpdateMpiDto, CreateChecklistItemDto } from './dto/mpi.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CHECKLIST_TEMPLATE } from './template/checklist-template';

@Injectable()
export class MpiService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    stations: {
      include: {
        specifications: {
          include: {
            stationSpecifications: true,
          },
        },
      },
    },
    orderForms: true,
    checklists: {
      include: {
        checklistItems: true,
      },
    },
  };

async create(data: CreateMpiDto) {
  // Step 1: Create MPI record
  const createdMpi = await this.prisma.mPI.create({
    data: {
      jobId: data.jobId,
      assemblyId: data.assemblyId,

      
      customer: data.customer, 
    },
  });


if (data.orderForms) {
  await this.prisma.orderForm.create({
    data: {
      ...data.orderForms,
      mpiId: createdMpi.id,
    },
  });
}




  
if (data.stations?.length) {
  for (const station of data.stations) {
    if (!station.id) throw new Error('Station ID missing');

    // Link station to MPI
    await this.prisma.station.update({
      where: { id: station.id },
      data: { mpiId: createdMpi.id },
    });

    // Handle specification values
    if (station.specificationValues?.length) {
      for (const spec of station.specificationValues) {
        if (!spec.specificationId) throw new Error('Specification ID missing');

        await this.prisma.stationSpecification.upsert({
          where: {
            stationId_specificationId: {
              stationId: station.id,
              specificationId: spec.specificationId,
            },
          },
          update: {
            value: spec.value,
            unit: spec.unit,
          },
          create: {
            stationId: station.id,
            specificationId: spec.specificationId,
            value: spec.value,
            unit: spec.unit,
          },
        });
      }
    }
  }
}

  // Step 4: Create Checklists with preloaded template (sections + descriptions)
  // and user-defined required, remarks, etc.
  if (data.checklists?.length) {
  //   for (const section of CHECKLIST_TEMPLATE) {
  //     const userChecklist = data.checklists.find(c => c.name === section.name);
  //     if (!userChecklist) continue;

  //     const createdChecklist = await this.prisma.checklist.create({
  //       data: {
  //         name: section.name,
  //         mpiId: createdMpi.id,
  //       },
  //     });

  //     // Fix: Explicit type to avoid TS error
  //     const checklistItemsData: Prisma.ChecklistItemCreateManyInput[] = [];

  //     for (const templateItem of section.checklistItems) {
  //       const userItem = userChecklist.checklistItems?.find(
  //         i => i.description === templateItem.description
  //       );

  //       checklistItemsData.push({
  //         sectionId: createdChecklist.id,
  //         description: templateItem.description,
  //         required: userItem?.required ?? true,
  //         remarks: userItem?.remarks ?? '',
  //         createdBy: userItem?.createdBy ?? 'user',
  //         isActive: userItem?.isActive ?? true,
  //       });
  //     }

  //     if (checklistItemsData.length) {
  //       await this.prisma.checklistItem.createMany({
  //         data: checklistItemsData,
  //       });
  //     }
  //   }

  // Step 4: Create Checklists with preloaded template (sections + descriptions)
// and user-defined required, remarks, isActive, createdBy
for (const section of CHECKLIST_TEMPLATE) {
  // Find matching user-provided checklist section by name
  const userChecklist = data.checklists?.find(c => c.name === section.name);

  // Create checklist section
  const createdChecklist = await this.prisma.checklist.create({
    data: {
      name: section.name,
      mpiId: createdMpi.id,
    },
  });

  // Prepare checklist items
  const checklistItemsData: Prisma.ChecklistItemCreateManyInput[] = section.checklistItems.map(
    templateItem => {
      // Try to get dynamic fields from user data (matched by description)
      const userItem = userChecklist?.checklistItems?.find(
        i => i.description === templateItem.description
      );

      return {
        sectionId: createdChecklist.id,
        description: templateItem.description, // always from template
        required: userItem?.required ?? true,
        remarks: userItem?.remarks ?? '',
        createdBy: userItem?.createdBy ?? 'system',
        isActive: userItem?.isActive ?? true,
      };
    }
  );

  // Insert all checklist items
  if (checklistItemsData.length) {
    await this.prisma.checklistItem.createMany({
      data: checklistItemsData,
    });
  }
}

  }


  
  // Step 5: Return MPI with all relations
  return this.findOne(createdMpi.id);
}


  async findAll() {
    return this.prisma.mPI.findMany({
      include: this.includeRelations,
    });
  }

  async findOne(id: string) {
    const mpi = await this.prisma.mPI.findUnique({
      where: { id },
      include: this.includeRelations,
    });

    if (!mpi) {
      throw new NotFoundException('MPI not found');
    }

    return mpi;
  }

  // async update(id: string, data: UpdateMpiDto) {
  //   await this.prisma.mPI.update({
  //     where: { id },
  //     data: {
  //       jobId: data.jobId,
  //       assemblyId: data.assemblyId,
  //     },
  //   });

  //   if (data.stations?.length) {
  //     for (const station of data.stations) {
  //       await this.prisma.station.update({
  //         where: { id: station.id },
  //         data: { mpiId: id },
  //       });
  //     }
  //   }

  //   return this.findOne(id);
  // }

async update(id: string, data: UpdateMpiDto) {
  // Step 1: Update MPI basic fields
  const updatedMpi = await this.prisma.mPI.update({
    where: { id },
    data: {
      jobId: data.jobId,
      assemblyId: data.assemblyId,
    },
  });

  // Step 2: Update existing Order Form only
  if (data.orderForm) {
    const existingOrderForm = await this.prisma.orderForm.findFirst({
      where: { mpiId: id },
    });

    if (existingOrderForm) {
      await this.prisma.orderForm.update({
        where: { id: existingOrderForm.id },
        data: data.orderForm,
      });
    }
    // No create logic here
  }

  // Step 3: Update existing Stations and their existing Specification Values
  if (data.stations?.length) {
    for (const station of data.stations) {
      if (!station.id) throw new Error('Station ID is required');

      await this.prisma.station.update({
        where: { id: station.id },
        data: {
          stationName: station.stationName,
          description: station.description,
          location: station.location,
          status: station.status,
          operator: station.operator,
          mpiId: id,
        },
      });

      if (station.specificationValues?.length) {
        for (const spec of station.specificationValues) {
          if (!spec.specificationId) throw new Error('Specification ID is required');

          const existingSpec = await this.prisma.stationSpecification.findUnique({
            where: {
              stationId_specificationId: {
                stationId: station.id,
                specificationId: spec.specificationId,
              },
            },
          });

          if (existingSpec) {
            await this.prisma.stationSpecification.update({
              where: {
                stationId_specificationId: {
                  stationId: station.id,
                  specificationId: spec.specificationId,
                },
              },
              data: {
                value: spec.value,
                unit: spec.unit,
              },
            });
          }
        }
      }
    }
  }

  // Step 4: Update existing Checklist Items only
  if (data.checklists?.length) {
    // Step 4: Upsert Checklists using template and user overrides
for (const section of CHECKLIST_TEMPLATE) {
  // Find user-supplied checklist section, if any
  const userChecklist = data.checklists?.find(c => c.name === section.name);

  // Check if this section already exists for this MPI
  const existingChecklist = await this.prisma.checklist.findFirst({
    where: {
      name: section.name,
      mpiId: id,
    },
  });

  let checklistId: string;

  if (existingChecklist) {
    checklistId = existingChecklist.id;
  } else {
    const createdChecklist = await this.prisma.checklist.create({
      data: {
        name: section.name,
        mpiId: id,
      },
    });
    checklistId = createdChecklist.id;
  }

  for (const templateItem of section.checklistItems) {
    const userItem = userChecklist?.checklistItems?.find(
      i => i.description === templateItem.description
    );

    const existingItem = await this.prisma.checklistItem.findFirst({
      where: {
        sectionId: checklistId,
        description: templateItem.description,
      },
    });

    const itemData = {
      description: templateItem.description,
      required: userItem?.required ?? true,
      remarks: userItem?.remarks ?? '',
      createdBy: userItem?.createdBy ?? 'system',
      isActive: userItem?.isActive ?? true,
      sectionId: checklistId,
    };

    if (existingItem) {
      await this.prisma.checklistItem.update({
        where: { id: existingItem.id },
        data: itemData,
      });
    } else {
      await this.prisma.checklistItem.create({
        data: itemData,
      });
    }
  }
}

  }

  return updatedMpi;
}


  async remove(id: string) {
    return this.prisma.mPI.delete({ where: { id } });
  }
}

