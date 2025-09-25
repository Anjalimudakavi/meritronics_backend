import { Controller, Get, Post, Body, Param, Put, Delete, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //user creation 
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);



  }

//Fetch all users
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
  //Fetch user by email
 @Get('by-email')
async getUserByEmail(@Query('email') email: string) {
  if (!email) {
    throw new BadRequestException('Email query parameter is required');
  }
  const user = await this.userService.getUserByEmail(email);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

  //Fetch user by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
 
// update user
@Put(':id')
async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.userService.updateUser(id, updateUserDto);
}

//delete user
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}