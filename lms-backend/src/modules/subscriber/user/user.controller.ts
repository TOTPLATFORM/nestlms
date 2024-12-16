import { Body, Controller, Post } from '@nestjs/common';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriberService } from '../subscriber.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Public()
@Controller('user')
export class UserSubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}
  @Post('subscribe')
  subscribe(@Body() payload: SubscribeDto) {
    return this.subscriberService.subscribe(payload);
  }
}
