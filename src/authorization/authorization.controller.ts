
import {Controller, Post, Get, Body, Param, Delete, BadRequestException,Patch, Req, UseGuards, NotFoundException,} from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt.auth-guard';

import { Roles } from 'src/auth/decorator/public.decorator'; // adjust path to where your decorator file is
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto'; 

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) { }

//create role
@Post('roles')
async createRole(@Body() dto: CreateRoleDto) {
  try {
    return await this.authorizationService.createRole(dto);
  } catch (error) {
    return { error: error.message || 'Role creation failed' };
  }
}

//Fetch all roles
  @Get('roles')
  async getAllRoles() {
    return await this.authorizationService.getAllRoles();
  }


//get role by id 
   @Get('roles/:id')
  async getRoleById(@Param('id') id: string) {
    return this.authorizationService.getRoleById(id);
  }
  
// Update role by id
@Patch('roles/:id')
async updateRole(
  @Param('id') roleId: string,
  @Body() dto: UpdateRoleDto,
) {
  try {
    const updatedRole = await this.authorizationService.updateRole(roleId, dto);
    return {
      message: 'Role updated successfully',
      data: updatedRole,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    return {
      message: 'Failed to update role',
      error: error.message,
    };
  }
}

//delete roles
  @Delete('roles/:roleId')
  async deleteRole(@Param('roleId') roleId: string) {
    return await this.authorizationService.deleteRoleById(roleId);
  }

  //---------------permissions----------------------//

  //create permission 
  @Post('permissions')
  async createPermission(
    @Body() body: { name: string; description?: string }
  ) {
    return await this.authorizationService.createPermission(
      body.name,
      body.description,
    );
  }

  // Fetch all permissions
  @Get('permissions')
  async getAllPermissions() {
    return await this.authorizationService.getAllPermissions();
  }

   // Fetch permissions for a role
  @Get('roles/:roleId/permissions')
  async getPermissionsForRole(@Param('roleId') roleId: string) {
    return await this.authorizationService.getPermissionsForRole(roleId);
  }


 // Fetch permissions for a designation
@Get('designations/:designationId/permissions')
async getPermissionsForDesignation(@Param('designationId') designationId: string) {
  return await this.authorizationService.getPermissionsForDesignation(designationId);
}


  //delete permissions
  @Delete('permissions/:permissionId')
  async deletePermission(@Param('permissionId') permissionId: string) {
    return await this.authorizationService.deletePermissionById(permissionId);
  }

}