import { Module } from '@nestjs/common';
import { HotelsController, AdminHotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';

@Module({
  controllers: [HotelsController, AdminHotelsController],
  providers: [HotelsService],
  exports: [HotelsService],
})
export class HotelsModule { }
