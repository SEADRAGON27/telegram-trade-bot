import 'dotenv/config';
import { Markup, Scenes } from 'telegraf';
import { db } from '../db/connection.js';
import { findUserInfo } from '../db/utils.js';
import { ApiKey } from '../db/models/apiKeys.js';
import { logger } from '../logs/logger.js';

export const changeDataAuthScene = new Scenes.WizardScene(
  'changeDataAuth',
  async (ctx) => {
    await ctx.reply(
      'Select data which would you change.',
      Markup.inlineKeyboard([
        [Markup.button.callback('💥Api secret', 'secret')],
        [Markup.button.callback('💥Api key', 'key')],
        [Markup.button.callback('💥Passphrase', 'phrase')],
      ])
    );
    ctx.wizard.next();
  },
  async (ctx) => {
    const userPromt = ctx.message;
    if (userPromt) {
      await ctx.reply('⛔ Please use the buttons to make a selection.');
    } else {
      switch (ctx.callbackQuery.data) {
        case 'secret':
          ctx.scene.state.secret = 'secret';
          await ctx.reply('✍Write a new api secret:');
          break;
        case 'key':
          ctx.scene.state.key = 'key';
          await ctx.reply('✍Write a new api key:');
          break;
        case 'phrase':
          ctx.scene.state.passPhrase = 'phrase';
          await ctx.reply('✍Write a new passphrase:');
          break;
      }
      ctx.wizard.next();
    }
  },
  async (ctx) => {
    const newData = ctx.message.text;
    const typeAuth = ctx.scene.state;
    const data = findUserInfo(ctx.from.id);
    try {
      const res = await db('getData', data, ApiKey);
      if (Object.hasOwn(typeAuth, 'secret')) {
        await db('updateData', { $set: { apiSecret: newData } }, ApiKey, {
          _id: res[0]._id,
        });
        await ctx.reply('✅Api secret is changed');
      }
      if (Object.hasOwn(typeAuth, 'key')) {
        db('updateData', { $set: { apiKey: newData } }, ApiKey, {
          _id: res[0]._id,
        });
        await ctx.reply('✅Api key is changed');
      }
      if (Object.hasOwn(typeAuth, 'passPhrase')) {
        await db('updateData', { $set: { passPhrase: newData } }, ApiKey, {
          _id: res[0]._id,
        });
        await ctx.reply('✅Passphrase is changed');
      }
      logger.info(
        `the fourth step in the changeDataAuth is completed.  User:${ctx.from.id}`
      );
      ctx.scene.leave();
    } catch (error) {
      await ctx.reply(
        `😓Sorry,something went wrong, make sure that you are registrated in our bot`
      );
      logger.error(
        `there is an error in the fourth step of cancelOrders ${error.message}. User:${ctx.from.id}`
      );
      ctx.scene.leave();
    }
  }
);
