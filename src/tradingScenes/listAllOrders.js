import 'dotenv/config';
import { Markup, Scenes } from 'telegraf';
import { listAllOrders } from '../api.js';
import { getDate } from '../date.js';
import { ApiKey } from '../models/apiKeys.js';
import { logger } from '../logs/logger.js';

export const listOrdersScene = new Scenes.WizardScene(
  'listAllOrders',
  async (ctx) => {
    await ctx.reply("✍Write status order 'active' or 'done': ");
    ctx.wizard.next();
  },
  async (ctx) => {
    
    const status = ctx.message.text;
    
    if (status == 'active' || status == 'done') {
      
      ctx.scene.state.status = status;
      await ctx.reply(
        "✍You can find list orders for trade pair.\nWrite trade pair or 'next':"
      );
      ctx.wizard.next();
    
    } else {
      
      await ctx.reply("⛔You must write word 'active' or 'done':");
    
    }
  },
  async (ctx) => {
    
    const tradePair = ctx.message.text;
    const symbolRegex = /^[A-Z]{3,}-[A-Z]{3,}$/;

    if (symbolRegex.test(tradePair)) {
      
      ctx.scene.state.tradePair = tradePair;
      ctx.reply("✍Write kind of orders 'buy' or 'sell':");
      ctx.wizard.next();
    
    } else if (ctx.message.text == 'next') {
      
      await ctx.reply("✍Write kind of orders 'buy' or 'sell' or 'all':");
      ctx.wizard.next();
    
    } else {
      
      await ctx.reply(
        "⛔You should write  trading pair(format:BTC-USDT) or word 'next':"
      );
    
    }
  },
  async (ctx) => {
    const kindOfOrders = ctx.message.text;
    
    if (kindOfOrders == 'buy' || kindOfOrders == 'sell') {
      
      ctx.scene.state.kindOfOrders = kindOfOrders;
      await ctx.reply("✍Write type of orders 'limit' or 'market' or 'all':");
      ctx.wizard.next();
    
    } else if (kindOfOrders == 'all') {
      
      await ctx.reply("✍Write type of orders 'limit' or 'market' or 'all':");
      ctx.wizard.next();
    
    } else {
      
      await ctx.reply("⛔You must write word 'buy' or 'sell'or 'all':");
    
    }
  },
  async (ctx) => {
    const typeOfOrders = ctx.message.text;
    
    if (typeOfOrders == 'limit' || typeOfOrders == 'market') {
      ctx.scene.state.typeOfOrders = typeOfOrders;
      await ctx.reply(
        '🤔Select type of trading',
        Markup.inlineKeyboard([
          [Markup.button.callback('💥Spot Trading', 'spot')],
          [Markup.button.callback('💥Cross Margin Trading', 'margin')],
          [Markup.button.callback('💥Isolated Margin Trading', 'isMargin')],
        ])
      );
      ctx.wizard.next();
    } else if (typeOfOrders == 'all') {
      
      await ctx.reply(
        '🤔Select type of trading',
        Markup.inlineKeyboard([
          [Markup.button.callback('💥Spot Trading', 'spot')],
          [Markup.button.callback('💥Cross Margin Trading', 'margin')],
          [Markup.button.callback('💥Isolated Margin Trading', 'isMargin')],
        ])
      );
      ctx.wizard.next();
    
    } else {
      
      await ctx.reply("⛔You should wtite 'limit' or 'market' or 'all':");
    
    }
  },
  async (ctx) => {
    const userPromt = ctx.message;
    
    if (userPromt) {
      await ctx.reply('⛔ Please use the buttons to make a selection.');
    } else {
      switch (ctx.callbackQuery.data) {
        case 'spot':
          ctx.scene.state.typeOfTrading = 'TRADE';
          break;
        case 'margin':
          ctx.scene.state.typeOfTrading = 'MARGIN_TRADE';
          break;
        case 'isMargin':
          ctx.scene.state.typeOfTrading = 'MARGIN_ISOLATED_TRADE';
          break;
      }
      const params = ctx.scene.state;
      
      try {
        const responce = await ApiKey.find({userId:ctx.from.id})
       
        const orders = await listAllOrders(
          responce[0].apiSecret,
          responce[0].apiKey,
          responce[0].password,
          params
        );

        if (orders.length === 0) {
          await ctx.reply("❗You haven't orders with the given params.");
        } else {
          for (const order of orders) {
            const time = getDate(order.createdAt);
            await ctx.reply(` ➤ order Id:${order.id}
            ➤ trading pair:${order.symbol}
            ➤ order type:${order.type}
            ➤ kind of order:${order.side}
            ➤ price:${order.price}
            ➤ size:${order.size}
            ➤ order funds: ${order.funds}
            ➤ isActive:${order.isActive}
            ➤ creation time:${time}
            ➤ tradeType:${order.tradeType}`);
          }
        }
        logger.info(
          `the sixth step in the listAllOrders is completed.  User:${ctx.from.id}`
        );
        ctx.scene.leave();
      } catch (error) {
        await ctx.reply(
          `😓Sorry,something went wrong, make sure that the registration data is written correctly `
        );
        logger.error(
          `there is an error in the sixth step of listAllOrders ${error.message}. User:${ctx.from.id}`
        );
        ctx.scene.leave();
      }
    }
  }
);
