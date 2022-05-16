import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { EchoModule } from './echo/echo.module';
import { GreeterModule } from './greeter/greeter.module';
import { GreeterBotName } from './app.constants';
import { sessionMiddleware } from './middleware/session.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getEnvPath } from './environments/env.helper';
import { ConfigModule } from '@nestjs/config';

const envFilePath: string = getEnvPath(`${__dirname}/environments`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TelegrafModule.forRoot({
      token: `${process.env.TOKEN_BOT}`,
      include: [EchoModule],
    }),
    TelegrafModule.forRootAsync({
      botName: GreeterBotName,
      useFactory: () => ({
        token: `${process.env.TOKEN_BOT_2}`,
        middlewares: [sessionMiddleware],
        include: [GreeterModule],
      }),
    }),
    EchoModule,
    GreeterModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
