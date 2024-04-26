import { Scenes } from 'telegraf';
import { db } from '../db/connection.js';
import { deleteUserInfo } from '../db/utils.js';
import { UserNotification } from '../db/models/userNotification.js';

export const wizardSceneDelete = new Scenes.WizardScene(
  'deleteNotification',
  async (ctx) => {
    await ctx.reply('✍ Write cryptocurrancy youre notification:');
    ctx.wizard.next();
  },
  async (ctx) => {
    ctx.scene.state.cryptocurrancy = ctx.message.text;
    await ctx.reply('✍ Write the set price in the notice:');
    ctx.wizard.next();
  },
  async (ctx) => {
    const id = +ctx.from.id;
    const price = +ctx.message.text;
    const cryptocurrancy = ctx.scene.state.cryptocurrancy;
    try {
      const data = deleteUserInfo(cryptocurrancy, price, id);
      await db('deleteData', data, UserNotification);
      await ctx.reply('✅Notification has been removed.');
      logger.info(`the deleteNotifications is completed.  User:${ctx.from.id}`);
      ctx.scene.leave();
    } catch (error) {
      await ctx.reply(`😓Sorry,We have problem in our application.`);
      logger.error(
        `there is an error in the deleteNotification  ${error.message}. User:${ctx.from.id}`
      );
      ctx.scene.leave();
    }
  }
);
