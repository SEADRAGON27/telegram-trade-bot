import { Scenes } from 'telegraf';
import { UserNotification } from '../models/userNotification.js';
import { logger } from '../logs/logger.js';

export const wizardSceneDelete = new Scenes.WizardScene(
  'deleteNotification',
  
  async (ctx) => {
    
    await ctx.reply('✍ Write cryptocurrancy your notification:');
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
      
      const data = {
        cryptocurrancy: cryptocurrancy,
        price: price,
        userId: id,
      };
      
      await UserNotification.delteOne(data)
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
