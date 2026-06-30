import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get('admin')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async getAdminStats() {
    return this.service.getAdminStats();
  }

  @Get('doctor')
  @Roles(Role.DOCTOR)
  async getDoctorStats(@CurrentUser('id') userId: string) {
    return this.service.getDoctorStats(userId);
  }
}
