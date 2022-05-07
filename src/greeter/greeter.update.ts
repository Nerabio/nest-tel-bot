import {
  Command,
  Ctx,
  Hears,
  Start,
  Update,
  Sender,
  Action,
  Message,
} from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { Context } from '../interfaces/context.interface';
import { HELLO_SCENE_ID, NODE_SCENE_ID } from '../app.constants';
import { UpdateType } from '../common/decorators/update-type.decorator';
import { Update as UT } from 'telegraf/typings/core/types/typegram';

@Update()
export class GreeterUpdate {
  @Start()
  onStart(): string {
    return 'Say hello to me';
  }

  @Hears(['hi', 'hello', 'hey', 'qq'])
  onGreetings(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
  ): string {
    return `Hey ${firstName}`;
  }

  @Command('scene')
  async onSceneCommand(
    @Ctx() ctx: Context,
    @Message('text') text: string,
  ): Promise<void> {
    if (text === 'rnd') {
      await ctx.scene.enter(HELLO_SCENE_ID);
    } else {
      await ctx.scene.enter(NODE_SCENE_ID);
    }
  }

  @Command('name')
  async enter(@Ctx() ctx: Context) {
    ctx.reply('2+2 = ?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Может быть 4?', callback_data: '4' }],
          [{ text: 'Точно пять!', callback_data: '5' }],
        ],
      },
    });
  }

  @Action(/4|5/)
  async onAnswer(@Ctx() context: Context & { update: UT.CallbackQueryUpdate }) {
    const cbQuery = context.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    context.answerCbQuery();
    if (userAnswer === '4') {
      context.reply('верно! ✅');
      context.scene.enter(HELLO_SCENE_ID);
    } else {
      context.reply('подумай еще ❌');
    }
  }
}
