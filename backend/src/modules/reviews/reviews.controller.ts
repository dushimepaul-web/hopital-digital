import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Public()
  @Get('doctor/:doctorId')
  async findByDoctor(@Param('doctorId') doctorId: string, @Query('page') page?: number) {
    return this.service.findByDoctor(doctorId, page);
  }

  @Post()
  async create(@Body() dto: any, @CurrentUser('id') userId: string) {
    return this.service.create(dto, userId);
  }
}
