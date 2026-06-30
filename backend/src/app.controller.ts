import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  @Redirect('api/v1/health', 302)
  root() {}
}
