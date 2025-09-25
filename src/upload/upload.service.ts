// file-upload.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { StationService } from '../station/station.service';
import { StationMpiDocumentService } from '../station-mpi-docs/station-mpi-docs.service';
import { MpiDocumentService } from '../mpi-document/mpi-document.service';


@Injectable()
export class FileUploadService {
  constructor(
    private readonly stationService: StationService,
    private readonly stationMpiDocService: StationMpiDocumentService,
    private readonly mpiDocumentService: MpiDocumentService,
  ) {}

  async handleUpload(uploadType: string, files: Express.Multer.File[], body: any) {
    const fileUrls = files.map(file => {
      const folder =
        uploadType === 'station' ? 'station' :
        uploadType === 'station-mpi' ? 'station-mpi-docs' :
        uploadType === 'mpi-docs' ? 'mpidocs' :
        '';
      return `http://54.177.111.218:4000/uploads/${folder}/${file.filename}`;
    });

    try {
      if (uploadType === 'station') {
        return this.handleStationWithFiles(files, fileUrls, body);

      }

      if (uploadType === 'station-mpi') {
        if (!body.stationId) throw new BadRequestException('stationId is required');

        return Promise.all(files.map((file, i) =>
          this.stationMpiDocService.create({
            fileUrl: fileUrls[i],
            stationId: body.stationId,
            mpiId: body.mpiId || null,
            description: body.description || file.originalname,
            originalName: file.originalname,
          }),
        ));
      }

      if (uploadType === 'mpi-docs') {
        if (!body.mpiId) throw new BadRequestException('mpiId is required');

        return Promise.all(files.map((file, i) =>
          this.mpiDocumentService.create({
            fileUrl: fileUrls[i],
            mpiId: body.mpiId,
            description: body.description || file.originalname,
            originalName: file.originalname,
          }),
        ));
      }

      throw new BadRequestException('Invalid upload type');

    } catch (error) {
      files.forEach(file => {
        try {
          unlinkSync(file.path);
        } catch {}
      });
      throw error;
    }
  }

 private async handleStationWithFiles(
  files: Array<Express.Multer.File & { fieldname: string }>,
  fileUrls: string[],
  dto: any,
) {
  dto.flowcharts = [];
  dto.documentations = [];

  files.forEach((file, i) => {
    const fileUrl = fileUrls[i];
    const entry = { name: file.originalname, fileUrl };

    if (file.fieldname === 'flowcharts') {
      dto.flowcharts.push(entry);
    } else if (file.fieldname === 'documentations') {
      dto.documentations.push(entry);
    }
  });

  return this.stationService.create(dto);
}
}
