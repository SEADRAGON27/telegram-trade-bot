import 'dotenv/config';
import { Scenes } from 'telegraf';
import { db } from './db/connection.js';
import { findUserInfo } from './db/utils.js';
import { hashPassword } from '../lib/argon2.js';
import { ApiKey } from './db/models/apiKeys.js';
import { logger } from './logs/logger.js';

export const SceneTradingAuthorization = new Scenes.WizardScene(
  'authorization',

  async (ctx) => {
    const data = findUserInfo(ctx.from.id);
    try {
      const res = await db('getData', data, ApiKey);
      if (res.length == 0) {
        await ctx.reply(
          `For introducing with с API Kucoin.\n✍Write passphrase:\n ✍Add this IP:${process.env.IP_SERVER} to the access list`
        );
        ctx.wizard.next();
      } else {
        logger.info(`User: ${ctx.from.id} is authorizated`);
        await ctx.scene.enter('tradeScene');
      }
    } catch (error) {
      await ctx.reply(`😓Sorry,We have problem in our application.`);
      logger.error(
        `there is an error in the first step of authorization ${error.message}. User:${ctx.from.id}`
      );
      ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      ctx.message.text === 'string'
        ? await hashPassword(ctx.message.text)
        : await ctx.reply('Write correct passPhrase!');
      await ctx.reply('✍Write apiSecret');
      ctx.wizard.next();
    } catch (error) {
      await ctx.reply(`😓Sorry,We have problem in our application.`);
      logger.error(
        `there is an error in the second step of authorization ${error.message}. User:${ctx.from.id}`
      );
      ctx.scene.leave();
    }
  },
  async (ctx) => {
    ctx.message.text === 'string'
      ? (ctx.scene.state.secret = ctx.message.text)
      : await ctx.reply('Write correct apiSecret!');
    await ctx.reply('Write apiKey');
    ctx.wizard.next();
  },
  async (ctx) => {
    ctx.message.text === 'string'
      ? (ctx.scene.state.apiKey = ctx.message.text)
      : await ctx.reply('Write correct apiKey!');
    try {
      const data = {
        userId: +ctx.from.id,
        passPhrase: ctx.scene.state.phrase,
        apiSecret: ctx.scene.state.secret,
        apiKey: ctx.scene.state.apiKey,
      };
      await db('recordData', data, ApiKey);
      logger.info(
        `the last step in the authorization is completed. User:${ctx.from.id}`
      );
      await ctx.scene.enter('tradeScene');
      ctx.scene.leave();
    } catch (error) {
      await ctx.reply(`😓Sorry,We have problem in our application.`);
      logger.error(
        `there is an error in the last step of authorization ${error.message}. User:${ctx.from.id}`
      );
      ctx.scene.leave();
    }
  }
);
