
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateStationDto, UpdateStationDto } from './dto/station.dto';
import { inputType as InputType } from '@prisma/client';

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
        required: !!spec.required,
      };
    });
  }

  async create(dto: CreateStationDto) {
    try {
      const { documentations, flowcharts, specifications, ...stationData } = dto;

      if (stationData.mpiId === undefined) {
        delete stationData.mpiId;
      }

      const validatedSpecs = this.validateSpecifications(specifications);

      return await this.prisma.station.create({
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
    } catch (error) {
      console.error('❌ Error creating station:', error);
      throw new InternalServerErrorException(`Create failed: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.station.findMany({
        include: {
          documentations: true,
          flowcharts: true,
          specifications: true,
        },
        orderBy: {
          priority: 'asc',
        },
      });
    } catch (error) {
      console.error('❌ Error fetching stations:', error);
      throw new InternalServerErrorException('Could not fetch stations');
    }
  }

  async findFlowchartById(id: string) {
    try {
      return await this.prisma.flowchart.findUnique({ where: { id } });
    } catch (error) {
      console.error('❌ Error fetching flowchart:', error);
      throw new InternalServerErrorException('Could not fetch flowchart');
    }
  }

  async findDocumentationById(id: string) {
    try {
      return await this.prisma.documentation.findUnique({ where: { id } });
    } catch (error) {
      console.error('❌ Error fetching documentation:', error);
      throw new InternalServerErrorException('Could not fetch documentation');
    }
  }

  async findOne(id: string) {
    try {
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
    } catch (error) {
      console.error(`❌ Error fetching station with ID ${id}:`, error);
      throw error;
    }
  }

async update(id: string, dto: UpdateStationDto) {
  try {
    const {
      documentations,
      flowcharts,
      specifications,
      specificationValues,
      ...stationData
    } = dto;

    // Precompute slugs for specifications
    const specsWithSlug = specifications?.map(s => ({
      ...s,
      slug: s.slug || this.slugify(s.name),
    })) ?? [];

    // Wrap all DB operations in a transaction
    const updatedStation = await this.prisma.$transaction(async (prisma) => {

      // 1️⃣ Update basic station data
      await prisma.station.update({
        where: { id },
        data: stationData,
      });

      // ==================== Documentations ====================
      if (documentations !== undefined) {
        const currentDocs = await prisma.documentation.findMany({ where: { stationId: id } });
        const incomingDocUrls = documentations.map(d => d.fileUrl).filter(Boolean) as string[];

        // Delete removed docs
        const toDeleteDocs = currentDocs.filter(d => d.fileUrl && !incomingDocUrls.includes(d.fileUrl));
        if (toDeleteDocs.length) {
          await prisma.documentation.deleteMany({
            where: { id: { in: toDeleteDocs.map(d => d.id) } },
          });
        }

        // Update or create docs
        await Promise.all(
          documentations
            .filter(d => d.fileUrl)
            .map(async (doc) => {
              const existing = await prisma.documentation.findFirst({
                where: { stationId: id, fileUrl: doc.fileUrl! },
              });

              if (existing) {
                await prisma.documentation.update({
                  where: { id: existing.id },
                  data: { description: doc.description ?? '' },
                });
              } else {
                await prisma.documentation.create({
                  data: {
                    stationId: id,
                    fileUrl: doc.fileUrl!,
                    description: doc.description ?? '',
                  },
                });
              }
            })
        );
      }

      // ==================== Flowcharts ====================
      if (flowcharts !== undefined) {
        const currentFlows = await prisma.flowchart.findMany({ where: { stationId: id } });
        const incomingFlowUrls = flowcharts.map(f => f.fileUrl).filter(Boolean) as string[];

        const toDeleteFlows = currentFlows.filter(f => f.fileUrl && !incomingFlowUrls.includes(f.fileUrl));
        if (toDeleteFlows.length) {
          await prisma.flowchart.deleteMany({
            where: { id: { in: toDeleteFlows.map(f => f.id) } },
          });
        }

        await Promise.all(
          flowcharts
            .filter(f => f.fileUrl)
            .map(async (flow) => {
              const existing = await prisma.flowchart.findFirst({
                where: { stationId: id, fileUrl: flow.fileUrl! },
              });

              if (existing) {
                await prisma.flowchart.update({
                  where: { id: existing.id },
                  data: { description: flow.description ?? '' },
                });
              } else {
                await prisma.flowchart.create({
                  data: {
                    stationId: id,
                    fileUrl: flow.fileUrl!,
                    description: flow.description ?? '',
                  },
                });
              }
            })
        );
      }

      // ==================== Specifications ====================
      if (specifications !== undefined) {
        const currentSpecs = await prisma.specification.findMany({ where: { stationId: id } });
        const incomingNames = specsWithSlug.map(s => s.name);

        // Delete removed specs
        const toDeleteSpecs = currentSpecs.filter(s => !incomingNames.includes(s.name));
        if (toDeleteSpecs.length) {
          await prisma.specification.deleteMany({
            where: { id: { in: toDeleteSpecs.map(s => s.id) } },
          });
        }

        // Update or create specs
        await Promise.all(
          specsWithSlug.map(async (spec) => {
            const existing = await prisma.specification.findFirst({
              where: { stationId: id, name: spec.name },
            });

            if (existing) {
              await prisma.specification.update({
                where: { id: existing.id },
                data: { ...spec },
              });
            } else {
              await prisma.specification.create({
                data: { ...spec, stationId: id },
              });
            }
          })
        );
      }

      // ==================== Specification Values ====================
      if (specificationValues !== undefined) {
        const currentValues = await prisma.stationSpecification.findMany({ where: { stationId: id } });
        const incomingIds = specificationValues.map(v => v.specificationId).filter(Boolean) as string[];

        // Delete removed values
        const toDeleteValues = currentValues.filter(sv => !incomingIds.includes(sv.specificationId));
        if (toDeleteValues.length) {
          await prisma.stationSpecification.deleteMany({
            where: {
              stationId: id,
              specificationId: { in: toDeleteValues.map(sv => sv.specificationId) },
            },
          });
        }

        // Update or create values
        await Promise.all(
          specificationValues
            .filter(v => v.specificationId)
            .map(async (value) => {
              const existing = await prisma.stationSpecification.findUnique({
                where: {
                  stationId_specificationId: {
                    stationId: id,
                    specificationId: value.specificationId!,
                  },
                },
              });

              if (existing) {
                await prisma.stationSpecification.update({
                  where: {
                    stationId_specificationId: {
                      stationId: id,
                      specificationId: value.specificationId!,
                    },
                  },
                  data: { value: value.value, unit: value.unit },
                });
              } else {
                await prisma.stationSpecification.create({
                  data: {
                    stationId: id,
                    specificationId: value.specificationId!,
                    value: value.value,
                    unit: value.unit,
                  },
                });
              }
            })
        );
      }

      // 5️⃣ Return updated station with relations
      return prisma.station.findUnique({
        where: { id },
        include: {
          documentations: true,
          flowcharts: true,
          specifications: true,
        },
      });
    });

    return updatedStation;
  } catch (error) {
    console.error('❌ Error updating station:', error);
    throw new InternalServerErrorException(`Update failed: ${error.message}`);
  }
}


  async remove(id: string) {
    try {
      return await this.prisma.station.delete({ where: { id } });
    } catch (error) {
      console.error('❌ Error deleting station:', error);
      throw new InternalServerErrorException(`Delete failed: ${error.message}`);
    }
  }
}
