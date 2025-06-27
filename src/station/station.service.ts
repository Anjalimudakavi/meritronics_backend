


import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
import { inputType as InputType } from '@prisma/client'; // Prisma Enum
// import { FIXED_STATION_ORDER } from './stationorder.constant';

@Injectable()
export class StationService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
private validateSpecifications(specs?: any[]) {
  return (specs ?? []).map((spec) => {
    if (!spec.name) {
      throw new BadRequestException('Each specification must have a name');
    }

    const enumValue = InputType[spec.inputType as keyof typeof InputType];
    if (!enumValue) {
      throw new BadRequestException(`Invalid inputType: ${spec.inputType}`);
    }

    return {
      name: spec.name,
      slug: spec.slug || this.slugify(spec.name),
      inputType: enumValue,
      suggestions: spec.suggestions ?? [],
      required: !!spec.required, // false if undefined
    };
  });
}

  async create(dto: CreateStationDto) {
    const { documentations, flowcharts, specifications, ...stationData } = dto;

    // Remove mpiId if it's undefined to satisfy Prisma type requirements
    if (stationData.mpiId === undefined) {
      delete stationData.mpiId;
    }

    const validatedSpecs = this.validateSpecifications(specifications);

    return this.prisma.station.create({
      data: {
        ...stationData,
        documentations: { create: documentations ?? [] },
        flowcharts: { create: flowcharts ?? [] },
        specifications: { create: validatedSpecs },
      },
      include: {
        documentations: true,
        flowcharts: true,
        specifications: true,
      },
    });
  }



  
  async findAll() {
    return this.prisma.station.findMany({
      include: {
        documentations: true,
        flowcharts: true,
        specifications: true,
      },
       orderBy: {
      priority: 'asc', // ✅ Sorts by priority from lowest to highest
    },
    });
    
  }


//   async findAll() {
//   const stations = await this.prisma.station.findMany({
//     include: {
//       documentations: true,
//       flowcharts: true,
//       specifications: true,
//     },
//   });

//   // Sort stations based on fixed station order
//   return stations.sort((a, b) => {
//     const indexA = FIXED_STATION_ORDER.indexOf(a.stationName);
//     const indexB = FIXED_STATION_ORDER.indexOf(b.stationName);

//     // If station name not in order list, push it to the end
//     return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
//   });
// }

  async findOne(id: string) {
    const station = await this.prisma.station.findUnique({
      where: { id },
      include: {
        documentations: true,
        flowcharts: true,
        specifications: true,
      },
    });

    if (!station) throw new NotFoundException('Station not found');
    return station;
  }


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


async update(id: string, dto: UpdateStationDto) {
  const {
    documentations,
    flowcharts,
    specifications,
    specificationValues,
    ...stationData
  } = dto;

  // Step 1: Update basic station fields
  await this.prisma.station.update({
    where: { id },
    data: stationData,
  });

  // Step 2: Sync Documentations
  if (documentations !== undefined) {
    const currentDocs = await this.prisma.documentation.findMany({ where: { stationId: id } });

    const incomingDocUrls = documentations.map(doc => doc.fileUrl).filter((url): url is string => url !== null && url !== undefined);
    const toDelete = currentDocs.filter(doc => doc.fileUrl !== null && doc.fileUrl !== undefined && !incomingDocUrls.includes(doc.fileUrl));

    // Delete removed docs
    await this.prisma.documentation.deleteMany({
      where: {
        id: { in: toDelete.map(d => d.id) },
      },
    });

    // Upsert documentations
    for (const doc of documentations) {
      if (!doc.fileUrl) continue;

      const existing = await this.prisma.documentation.findFirst({
        where: { stationId: id, fileUrl: doc.fileUrl },
      });

      if (existing) {
        await this.prisma.documentation.update({
          where: { id: existing.id },
          data: {
            description: doc.description ?? '',
          },
        });
      } else {
        await this.prisma.documentation.create({
          data: {
            stationId: id,
            fileUrl: doc.fileUrl,
            description: doc.description ?? '',
          },
        });
      }
    }
  }

  // Step 3: Sync Flowcharts
  if (flowcharts !== undefined) {
    const currentFlows = await this.prisma.flowchart.findMany({ where: { stationId: id } });

    const incomingFlowUrls = flowcharts.map(flow => flow.fileUrl).filter((url): url is string => url !== null && url !== undefined);
    const toDelete = currentFlows.filter(flow => flow.fileUrl !== null && flow.fileUrl !== undefined && !incomingFlowUrls.includes(flow.fileUrl));

    await this.prisma.flowchart.deleteMany({
      where: {
        id: { in: toDelete.map(f => f.id) },
      },
    });

    for (const flow of flowcharts) {
      if (!flow.fileUrl) continue;

      const existing = await this.prisma.flowchart.findFirst({
        where: { stationId: id, fileUrl: flow.fileUrl },
      });

      if (existing) {
        await this.prisma.flowchart.update({
          where: { id: existing.id },
          data: {
            description: flow.description ?? '',
          },
        });
      } else {
        await this.prisma.flowchart.create({
          data: {
            stationId: id,
            fileUrl: flow.fileUrl,
            description: flow.description ?? '',
          },
        });
      }
    }
  }

  // Step 4: Sync Specifications
  if (specifications !== undefined) {
    const currentSpecs = await this.prisma.specification.findMany({
      where: { stationId: id },
    });

    const incomingNames = specifications.map(s => s.name);
    const toDelete = currentSpecs.filter(spec => !incomingNames.includes(spec.name));

    // Delete removed specs
    await this.prisma.specification.deleteMany({
      where: { id: { in: toDelete.map(s => s.id) } },
    });

    for (const spec of specifications) {
      const slug = spec.slug || this.slugify(spec.name);

      const existing = await this.prisma.specification.findFirst({
        where: { stationId: id, name: spec.name },
      });

      if (existing) {
        await this.prisma.specification.update({
          where: { id: existing.id },
          data: { ...spec, slug },
        });
      } else {
        await this.prisma.specification.create({
          data: {
            ...spec,
            slug,
            stationId: id,
          },
        });
      }
    }
  }

  // Step 5: Sync SpecificationValues
  if (specificationValues !== undefined) {
    const currentValues = await this.prisma.stationSpecification.findMany({
      where: { stationId: id },
    });

    const incomingIds = specificationValues.map(sv => sv.specificationId);
    const toDelete = currentValues.filter(sv => !incomingIds.includes(sv.specificationId));

    await this.prisma.stationSpecification.deleteMany({
      where: {
        stationId: id,
        specificationId: { in: toDelete.map(sv => sv.specificationId) },
      },
    });

    for (const value of specificationValues) {
      if (!value.specificationId) continue;

      const existing = await this.prisma.stationSpecification.findUnique({
        where: {
          stationId_specificationId: {
            stationId: id,
            specificationId: value.specificationId,
          },
        },
      });

      if (existing) {
        await this.prisma.stationSpecification.update({
          where: {
            stationId_specificationId: {
              stationId: id,
              specificationId: value.specificationId,
            },
          },
          data: {
            value: value.value,
            unit: value.unit,
          },
        });
      } else {
        await this.prisma.stationSpecification.create({
          data: {
            stationId: id,
            specificationId: value.specificationId,
            value: value.value,
            unit: value.unit,
          },
        });
      }
    }
  }

  // Step 6: Return updated station with nested data
  return this.prisma.station.findUnique({
    where: { id },
    include: {
      documentations: true,
      flowcharts: true,
      specifications: true,
    },
  });
}

  
  async remove(id: string) {
    return this.prisma.station.delete({ where: { id } });
  }
}

