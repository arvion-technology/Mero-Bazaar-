import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create_vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(@Body() dto: CreateVehicleDto) {
    const result = await this.vehiclesService.create(dto);
    return {
      message: 'Vehicle created successfully',
      data: result,
    };
  }

  @Get()
  async findAll() {
    const vehicles = await this.vehiclesService.findAll();

    return {
      message: 'Vehicles fetched successfully',
      data: vehicles,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findById(id);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle not found with id: ${id}`);
    }

    return {
      message: 'Vehicle fetched successfully',
      data: vehicle,
    };
  }

  @Get('listing/:listingId')
  async findByListingId(@Param('listingId') listingId: string) {
    const vehicle = await this.vehiclesService.findByListingId(listingId);

    if (!vehicle) {
      throw new NotFoundException(`Vehicle not found for listingId: ${listingId}`);
    }

    return {
      message: 'Vehicle fetched successfully',
      data: vehicle,
    };
  }
}