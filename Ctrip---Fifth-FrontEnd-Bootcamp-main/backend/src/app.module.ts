import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HotelsModule } from './hotels/hotels.module';
import { ReservationsModule } from './reservations/reservations.module';
import { GuestsModule } from './guests/guests.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [AuthModule, HotelsModule, ReservationsModule, GuestsModule, TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
