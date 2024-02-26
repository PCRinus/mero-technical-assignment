import { Module } from '@nestjs/common';
import { CalendarModule } from './calendar/calendar.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    CalendarModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
  ],
})
export class AppModule {}
