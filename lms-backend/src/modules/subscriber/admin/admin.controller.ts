import { Controller, Get, Query } from '@nestjs/common';
import { SubscriberService } from '../subscriber.service';

@Controller('admin')
export class AdminSubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Get('get-subscriber-list')
  getSubscriberList(@Query() payload: any) {
    return this.subscriberService.getSubscriberListByFilterPaginate(payload);
  }
}
