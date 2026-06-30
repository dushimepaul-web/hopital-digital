import { Controller, Get, Post, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly service: FavoritesService) {}

  @Get()
  async findByUser(@CurrentUser('id') userId: string) {
    return this.service.findByUser(userId);
  }

  @Post('doctor/:doctorId')
  async toggleDoctor(@CurrentUser('id') userId: string, @Param('doctorId') doctorId: string) {
    return this.service.toggleDoctor(userId, doctorId);
  }
}
