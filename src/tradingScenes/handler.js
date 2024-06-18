import 'dotenv/config';
import { Scenes, Markup } from 'telegraf';

export const wizardSceneTrade = new Scenes.WizardScene(
  'tradeScene',
  async (ctx) => {
    await ctx.reply(
      '🤔Choose command:',
      Markup.inlineKeyboard([
        [Markup.button.callback('⚡Open/Close order', 'open/close')],
        [Markup.button.callback('⚡Withdraw', 'withdraw')],
        [Markup.button.callback('⚡List all orders', 'orders')],
        [Markup.button.callback('⚡Cancel order', 'cancel')],
        [Markup.button.callback('⚡Change autorization data', 'change')],
      ])
    );
    ctx.wizard.next();
  },
  async (ctx) => {
    const userInput = ctx.message;
    console.log('ffff',userInput);
    if (userInput) {
      await ctx.reply('⛔ Please use the buttons to make a selection.');
    } else {
      switch (ctx.callbackQuery.data) {
        case 'open/close':
          await ctx.scene.enter('openOrder');
          break;
        case 'withdraw':
          await ctx.scene.enter('withdraw');
          break;
        case 'orders':
          await ctx.scene.enter('listAllOrders');
          break;
        case 'cancel':
          await ctx.scene.enter('cancelOrder');
          break;
        case 'change':
          await ctx.scene.enter('changeDataAuth');
          break;
      }
      
    }
  }
);
