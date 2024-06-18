import 'dotenv/config';
import { Scenes, Markup } from 'telegraf';
import { cryptocurrencyPrice } from '../api.js';
import { UserNotification } from '../models/userNotification.js';
import { logger } from '../logs/logger.js';

export const wizardSceneNotification = new Scenes.WizardScene(
  'getNotification',
  
  async (ctx) => {
    await ctx.reply('✍ Write cryptocurrencies name(bitcoin,monero,ripple):');
    ctx.wizard.next();
  },
  async (ctx) => {
    
    const userPrompt = ctx.message.text;
    
    try {
      const res = await cryptocurrencyPrice(userPrompt);

      if (+res) {
        
        ctx.scene.state.cryptocurrancy = userPrompt;
        await ctx.reply('✍Write Price');
        logger.info(
          `the second step in the setNotifications is completed.  User:${ctx.from.id}`
        );
        ctx.wizard.next();
      
      } else {
        
        await ctx.reply('⛔Cryptocurrency not found, please re-enter the text');
      
      }
    } catch (error) {
      
      ctx.reply('😓Sorry,We have problem in our application.');
      logger.error(
        `there is an error in the second step of setNotificatios  ${error.message}. User:${ctx.from.id}`
      );
      ctx.scene.leave();
    
    }
  },
  async (ctx) => {
    
    const userPrompt = ctx.message.text;
    
    if (+userPrompt) {
      
      ctx.scene.state.price = +userPrompt;
      await ctx.reply(
        '✍ Add comment for notice,\nwrite "no" if you don\'t want'
      );
      ctx.wizard.next();
    
    } else {
      
      await ctx.reply('⛔You can write only numbers, please re-enter the text');
    
    }
  },
  async (ctx) => {
    
    const userPrompt = ctx.message.text;
    userPrompt != 'no' ? (ctx.scene.state.notification = userPrompt) : '';
    ctx.scene.state.userId = +ctx.from.id;

    await ctx.reply(
      `🤔Choose how to send the notification`,
      Markup.inlineKeyboard([
        [Markup.button.callback('⚡Telegram', 'telegram')],
        [Markup.button.callback('⚡SMS(phone number)', 'sms')],
        [Markup.button.callback('⚡SMS and Telegram', 'sms/telegram')],
      ])
    );
    ctx.wizard.next();
  },
  async (ctx) => {
    
    if (ctx.callbackQuery.data === 'telegram') {
      
      try {
        
        ctx.scene.state.telegram = true;
        await UserNotification.create(ctx.scene.state);
        
        await ctx.reply('✅the notice is registrated!');
        logger.info(
          `the fifth step in the setNotifications is completed. User:${ctx.from.id}`
        );
        
        ctx.scene.leave();
      
      } catch (error) {
        
        await ctx.reply(`😓Sorry,We have problem in our application.`);
        logger.error(
          `there is an error in the fifth step of setNotificatios ${error.message}. User:${ctx.from.id}`
        );
        ctx.scene.leave();
      
      }
    } else {
      
      await ctx.reply('✍ Write phone number');
      ctx.scene.state.callbackQuery = ctx.callbackQuery.data;
    
    }

    ctx.wizard.next();
  },
  async (ctx) => {
    
    const phoneNumber = ctx.message.text;
    const callbackQuery = ctx.scene.state.callbackQuery;
    const phoneRegex = /^(\+\d{1,3}\s?)?(\d{10})$/;
    
    phoneRegex.test(phoneNumber)
      ? (ctx.scene.state.phone = phoneNumber)
      : await ctx.reply('⛔Write correct phone number');
    
    if (callbackQuery == 'sms') {
      
      ctx.scene.state.sms = true;
    
    } else if (callbackQuery == 'sms/telegram') {
      
      ctx.scene.state.both = true;
    
    }
    
    delete ctx.scene.state.callbackQuery;
    
    try {
      
      await UserNotification.create(ctx.scene.state);
      await ctx.reply('✅the notice is registrated!');
      logger.info(
        `the last step in the setNotifications is completed.  User:${ctx.from.id}`
      );
      ctx.scene.leave();
    
    } catch (error) {
      
      await ctx.reply('😓Sorry,We have problem in our application.');
      logger.error(
        `there is an error in the last step of setNotificatios ${error.message}. User:${ctx.from.id}`
      );

      ctx.scene.leave();
    
    }
  }
);
