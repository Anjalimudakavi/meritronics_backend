import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMpiDto, UpdateMpiDto } from './dto/mpi.dto';
import { PrismaService } from 'prisma/prisma.service';
import { isoToUtc, isoToUtcOrUndefined } from '../common/helpers/time.util';

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
        documentations: true,
      },
    },
    orderForms: {
      include: {
        services: true,
      },
    },
    checklists: {
      include: {
        checklistItems: true,
      },
    },
    mpiDocs: true,
    stationMpiDocuments: true,
  };

async create(data: CreateMpiDto) {
  try {
    const result = await this.prisma.$transaction(async (prisma) => {
      // 1️⃣ Create MPI
      const createdMpi = await prisma.mPI.create({
        data: {
          mpiName: data.mpiName,
          assemblyName: data.assemblyName,
          customer: data.customer,
          Instruction: data.Instruction,
        },
      });

      // 2️⃣ StationMpiDocuments
      if (data.stationMpiDocuments?.length) {
        const validDocs = data.stationMpiDocuments.map((doc) => {
          if (!doc.stationId || !doc.fileUrl) {
            throw new Error(
              'Station ID and fileUrl are required for new StationMpiDocument'
            );
          }
          return { ...doc, mpiId: createdMpi.id };
        });

        await prisma.stationMpiDocument.createMany({
          data: validDocs.map((doc) => ({
            fileUrl: doc.fileUrl!,
            description: doc.description,
            originalName: doc.originalName,
            stationId: doc.stationId!,
            mpiId: createdMpi.id,
          })),
        });
      }

      // 3️⃣ OrderForms
      if (data.orderForms?.length) {
        await Promise.all(
          data.orderForms.map(async (form) => {
            await prisma.orderForm.create({
              data: {
                mpiId: createdMpi.id,
                OrderType: form.OrderType ?? [],
                distributionDate: isoToUtc(form.distributionDate),
                requiredBy: isoToUtc(form.requiredBy),
                changeOrderNumber: form.changeOrderNumber ?? null,
                revision: form.revision ?? null,
                otherAttachments: form.otherAttachments ?? null,
                fileAction: form.fileAction ?? [],
                services: form.serviceIds
                  ? { connect: form.serviceIds.map((id) => ({ id })) }
                  : undefined,
              },
            });
          })
        );
      }

      // 4️⃣ MpiDocs
      if (data.mpiDocs?.length) {
        await prisma.mpiDocumentation.createMany({
          data: data.mpiDocs.map((doc) => ({
            fileUrl: doc.fileUrl,
            description: doc.description,
            originalName: doc.originalName,
            mpiId: createdMpi.id,
          })),
        });
      }

      // 5️⃣ Stations + Specifications
      if (data.stations?.length) {
        for (const station of data.stations) {
          if (!station.id) throw new Error('Station ID is required');

          await prisma.station.update({
            where: { id: station.id },
            data: { mpiId: createdMpi.id },
          });

          if (station.specificationValues?.length) {
            for (const spec of station.specificationValues) {
              if (!spec.specificationId)
                throw new Error(`Missing specificationId for station: ${station.id}`);

              await prisma.stationSpecification.upsert({
                where: {
                  stationId_specificationId: {
                    stationId: station.id!,
                    specificationId: spec.specificationId,
                  },
                },
                update: { value: spec.value, unit: spec.unit },
                create: {
                  stationId: station.id!,
                  specificationId: spec.specificationId,
                  value: spec.value,
                  unit: spec.unit,
                },
              });
            }
          }
        }
      }

      // 6️⃣ Checklists + Items
      if (data.checklists?.length) {
        for (const checklist of data.checklists) {
          const createdChecklist = await prisma.checklist.create({
            data: { name: checklist.name, mpiId: createdMpi.id },
          });

          if (checklist.checklistItems?.length) {
            await prisma.checklistItem.createMany({
              data: checklist.checklistItems
                .filter((item) => !!item.description)
                .map((item) => ({
                  sectionId: createdChecklist.id,
                  description: item.description!,
                  required: item.required ?? true,
                  remarks: item.remarks ?? '',
                  createdBy: item.createdBy ?? 'user',
                  isActive: item.isActive ?? true,
                })),
            });
          }
        }
      }

      return createdMpi.id;
    });

    return this.findOne(result); // fetch with relations
  } catch (error) {
    console.error('❌ Error creating MPI:', error);
    throw new InternalServerErrorException(`Create failed: ${error.message}`);
  }
}


async update(id: string, data: UpdateMpiDto) {
  try {
    const result = await this.prisma.$transaction(async (prisma) => {
      // 1️⃣ Update MPI basic info
      await prisma.mPI.update({
        where: { id },
        data: {
          mpiName: data.mpiName,
          assemblyName: data.assemblyName,
          customer: data.customer,
          Instruction: data.Instruction,
        },
      });

      // 2️⃣ StationMpiDocuments
      if (data.stationMpiDocuments?.length) {
        const validDocs = data.stationMpiDocuments.map((doc) => {
          if (!doc.stationId || !doc.fileUrl) {
            throw new Error(
              'Station ID and fileUrl are required for StationMpiDocument'
            );
          }
          return doc;
        });

        await prisma.stationMpiDocument.createMany({
          data: validDocs.map((doc) => ({
            fileUrl: doc.fileUrl!,
            description: doc.description,
            originalName: doc.originalName,
            stationId: doc.stationId!,
            mpiId: id,
          })),
        });
      }

      // 3️⃣ OrderForms
      if (data.orderForms?.length) {
        await Promise.all(
          data.orderForms.map(async (form) => {
            const commonData = {
              OrderType: form.OrderType,
              distributionDate: isoToUtcOrUndefined(form.distributionDate),
              requiredBy: isoToUtcOrUndefined(form.requiredBy),
              internalOrderNumber: form.internalOrderNumber,
              changeOrderNumber: form.changeOrderNumber,
              revision: form.revision,
              otherAttachments: form.otherAttachments,
              fileAction: form.fileAction,
              services: form.serviceIds?.length
                ? { connect: form.serviceIds.map((id) => ({ id })) }
                : undefined,
            };

            if (form.id) {
              await prisma.orderForm.update({
                where: { id: form.id },
                data: {
                  ...commonData,
                  services: {
                    set: form.serviceIds?.map((id) => ({ id })) ?? [],
                  },
                },
              });
            } else {
              await prisma.orderForm.create({
                data: { ...commonData, mpiId: id },
              });
            }
          })
        );
      }

      // 4️⃣ MpiDocs
      if (data.mpiDocs?.length) {
        await Promise.all(
          data.mpiDocs.map((doc) =>
            doc.id
              ? prisma.mpiDocumentation.update({
                  where: { id: doc.id },
                  data: {
                    fileUrl: doc.fileUrl,
                    description: doc.description,
                    originalName: doc.originalName,
                  },
                })
              : prisma.mpiDocumentation.create({
                  data: {
                    fileUrl: doc.fileUrl,
                    description: doc.description,
                    originalName: doc.originalName,
                    mpiId: id,
                  },
                })
          )
        );
      }

      // 5️⃣ Stations + Specifications
      if (data.stations?.length) {
        // reset previous MPI assignments
        await prisma.station.updateMany({
          where: { mpiId: id },
          data: { mpiId: null },
        });

        for (const station of data.stations) {
          if (!station.id) throw new Error('Station ID is required');

          await prisma.station.update({
            where: { id: station.id },
            data: {
              mpiId: id,
              status: station.status,
              description: station.description,
              location: station.location,
              operator: station.operator,
              priority: station.priority ?? 0,
              Note: station.Note ?? [],
            },
          });

          if (station.specificationValues?.length) {
            for (const spec of station.specificationValues) {
              if (!spec.specificationId)
                throw new Error(`Missing specificationId for station: ${station.id}`);

              await prisma.stationSpecification.upsert({
                where: {
                  stationId_specificationId: {
                    stationId: station.id!,
                    specificationId: spec.specificationId,
                  },
                },
                update: { value: spec.value, unit: spec.unit },
                create: {
                  stationId: station.id!,
                  specificationId: spec.specificationId,
                  value: spec.value,
                  unit: spec.unit,
                },
              });
            }
          }
        }
      }

      // 6️⃣ Checklists + Items
      if (data.checklists?.length) {
        for (const checklist of data.checklists) {
          if (!checklist.id) {
            const createdChecklist = await prisma.checklist.create({
              data: { name: checklist.name || 'Untitled Checklist', mpiId: id },
            });

            if (checklist.checklistItems?.length) {
              await prisma.checklistItem.createMany({
                data: checklist.checklistItems
                  .filter((item) => !!item.description)
                  .map((item) => ({
                    sectionId: createdChecklist.id,
                    description: item.description!,
                    required: item.required ?? true,
                    remarks: item.remarks ?? '',
                    createdBy: item.createdBy ?? 'user',
                    isActive: item.isActive ?? true,
                  })),
              });
            }
          } else {
            await prisma.checklist.update({
              where: { id: checklist.id },
              data: { name: checklist.name },
            });

            if (checklist.checklistItems?.length) {
              for (const item of checklist.checklistItems) {
                if (item.id) {
                  await prisma.checklistItem.update({
                    where: { id: item.id },
                    data: {
                      description: item.description,
                      category: item.category,
                      required: item.required ?? true,
                      remarks: item.remarks ?? '',
                      createdBy: item.createdBy ?? 'system',
                      isActive: item.isActive ?? true,
                    },
                  });
                } else {
                  await prisma.checklistItem.create({
                    data: {
                      sectionId: checklist.id!,
                      description: item.description!,
                      required: item.required ?? true,
                      remarks: item.remarks ?? '',
                      createdBy: item.createdBy ?? 'user',
                      isActive: item.isActive ?? true,
                    },
                  });
                }
              }
            }
          }
        }
      }

      return id; // return MPI id
    });

    return this.findOne(result); // fetch updated MPI with relations
  } catch (error) {
    console.error('❌ Error updating MPI:', error);
    throw new InternalServerErrorException(`Update failed: ${error.message}`);
  }
}


  async findAll() {
    try {
      return await this.prisma.mPI.findMany({
        include: this.includeRelations,
      });
    } catch (error) {
      console.error('❌ Error fetching all MPIs:', error);
      throw new InternalServerErrorException('Could not fetch MPI list');
    }
  }

  // ================== FIND ONE ==================
  async findOne(id: string) {
    try {
      const mpi = await this.prisma.mPI.findUnique({
        where: { id },
        include: this.includeRelations,
      });

      if (!mpi) throw new NotFoundException('MPI not found');
      return mpi;
    } catch (error) {
      console.error(`❌ Error fetching MPI with ID ${id}:`, error);
      throw error;
    }
  }

  // ================== REMOVE ==================
  async remove(id: string) {
    try {
      return await this.prisma.mPI.delete({ where: { id } });
    } catch (error) {
      console.error('❌ Error deleting MPI:', error);
      throw new InternalServerErrorException(`Delete failed: ${error.message}`);
    }
  }
}






