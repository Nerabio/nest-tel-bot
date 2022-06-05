import { NodeEventEnum } from "../enums/node-event.enum";
import { InlineKeyboardButton } from "../type/Inline-keyboard-button.type";

export function getBack(): InlineKeyboardButton {
    return [
      {
        text: '< BACK',
        callback_data: 'event/' + NodeEventEnum.BACK,
      },
    ];
  }