import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { FeaturesService } from './features.service';

/**
 * Generic Features Controller
 * Provides REST API endpoints for all feature types
 * 
 * Endpoints:
 * GET    /api/features                 - Get all available feature types
 * GET    /api/features/:type           - Get all items of a feature type
 * GET    /api/features/:type/schema    - Get schema for a feature type
 * GET    /api/features/:type/:id       - Get single item by ID
 * POST   /api/features/:type           - Create new item
 * PUT    /api/features/:type/:id       - Update item
 * DELETE /api/features/:type/:id       - Delete item
 */
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get()
  async getAvailableFeatures() {
    return this.featuresService.getAvailableFeatures();
  }

  @Get(':type')
  async findAll(
    @Param('type') type: string,
    @Query('filter') filter?: string,
  ) {
    return this.featuresService.findAll(type, filter);
  }

  @Get(':type/schema')
  async getSchema(@Param('type') type: string) {
    return this.featuresService.getSchema(type);
  }

  @Get(':type/:id')
  async findOne(@Param('type') type: string, @Param('id') id: string) {
    return this.featuresService.findOne(type, id);
  }

  @Post(':type')
  async create(@Param('type') type: string, @Body() data: any) {
    return this.featuresService.create(type, data);
  }

  @Put(':type/:id')
  async update(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.featuresService.update(type, id, data);
  }

  @Delete(':type/:id')
  async delete(@Param('type') type: string, @Param('id') id: string) {
    return this.featuresService.delete(type, id);
  }
}
