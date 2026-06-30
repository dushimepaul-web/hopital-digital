import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findAll(@Query() query: any) {
    return this.auditService.findAll(query);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findByUser(@Param('userId') userId: string) {
    return this.auditService.findByUser(userId);
  }
}
