import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { EchoModule } from './echo/echo.module';
import { GreeterModule } from './greeter/greeter.module';
import { GreeterBotName } from './app.constants';
import { sessionMiddleware } from './middleware/session.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  // imports: [
  //   TelegrafModule.forRoot({
  //     token: '1701418155:AAHQ3NsKORFMCvn94C7psQoo46AtLE6lo2I',
  //     include: [EchoModule],
  //   }),
  // ],
  imports: [
    TelegrafModule.forRoot({
      token: '1701418155:AAHQ3NsKORFMCvn94C7psQoo46AtLE6lo2I',
      include: [EchoModule],
    }),
    TelegrafModule.forRootAsync({
      botName: GreeterBotName,
      useFactory: () => ({
        token: '612325678:AAFrCBsraxaRDORxEvc6i-Hf3lEBv4dlIpg',
        middlewares: [sessionMiddleware],
        include: [GreeterModule],
      }),
    }),
    EchoModule,
    GreeterModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
