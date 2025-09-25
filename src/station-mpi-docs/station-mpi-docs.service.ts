
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StationMpiDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    fileUrl: string;
    stationId: string;
    description?: string;
    mpiId?: string; // Optional during upload
    originalName?: string;
  }) {
    console.log('💾 Creating station document in database:', data);
    return this.prisma.stationMpiDocument.create({ 
      data,
      include: {
        station: {
          select: {
            id: true,
           
          }
        }
      }
    });
  }

  findAll() {
    return this.prisma.stationMpiDocument.findMany({
      include: {
        station: {
          select: {
            id: true,

          }
        }
      }
    });
  }

  findByMpiId(mpiId: string) {
    return this.prisma.stationMpiDocument.findMany({
      where: { mpiId },
      include: {
        station: {
          select: {
            id: true,
      
          }
        }
      }
    });
  }

  findByStationId(stationId: string) {
    return this.prisma.stationMpiDocument.findMany({
      where: { stationId },
      include: {
        station: {
          select: {
            id: true,
     
          }
        }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.stationMpiDocument.findUnique({ 
      where: { id },
      include: {
        station: {
          select: {
            id: true,
          
          }
        }
      }
    });
  }

  update(id: string, data: { description?: string; mpiId?: string }) {
    console.log('📝 Updating station document:', id, data);
    return this.prisma.stationMpiDocument.update({
      where: { id },
      data,
      include: {
        station: {
          select: {
            id: true,
          
          }
        }
      }
    });
  }

  remove(id: string) {
    return this.prisma.stationMpiDocument.delete({
      where: { id },
    });
  }

  // Bulk update method to link multiple documents to an MPI
  async linkDocumentsToMpi(documentIds: string[], mpiId: string) {
    console.log('🔗 Bulk linking documents to MPI:', { documentIds, mpiId });
    
    return this.prisma.stationMpiDocument.updateMany({
      where: {
        id: {
          in: documentIds
        }
      },
      data: {
        mpiId
      }
    });
  }
}