import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StationModule } from './station/station.module';
import { SpecificationModule } from './specification/specification.module';
import { PrismaModule } from 'prisma/prisma.module';
import { MpiModule } from './mpi/mpi.module';
import { StationSpecificationModule } from './station-specification/station-specification.module';
import { ChangeOrderModule } from './change-order/change-order.module';
import { MpiDocumentModule } from './mpi-document/mpi-document.module';
import { StationMpiDocsModule } from './station-mpi-docs/station-mpi-docs.module';
import { UploadModule } from './upload/upload.module';
import { StationDocModule } from './station-doc/station-doc.module';
import { StationFlowchartModule } from './station-flowchart/station-flowchart.module';
import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { DepartmentModule } from './department/department.module';
import { EmployeeModule } from './employee/employee.module';
import { UserModule } from './user/user.module';
import { DesignationModule } from './designation/designation.module';
import { ServiceModule } from './service/service.module';
import { CustomerModule } from './customer/customer.module';


@Module({
  imports: [PrismaModule,StationModule,UploadModule, SpecificationModule, MpiModule, StationSpecificationModule, ChangeOrderModule, MpiDocumentModule, StationMpiDocsModule, StationDocModule, StationFlowchartModule, AuthModule, AuthorizationModule, DepartmentModule, EmployeeModule, UserModule, DesignationModule, ServiceModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
