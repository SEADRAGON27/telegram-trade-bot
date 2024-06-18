import 'dotenv/config';
import { Scenes } from 'telegraf';
import { ApiKey } from './models/apiKeys.js';
import { logger } from './logs/logger.js';

export const SceneTradingAuthorization = new Scenes.WizardScene(
  'authorization',

  async (ctx) => {
    
    try {
      
      const res = await ApiKey.find({userId:ctx.from.id});
    
      if (res.length == 0) {
        
        await ctx.reply(
          `For introducing with с API Kucoin.\n✍Write password:\n ✍Add this IP ${process.env.SERVER} to the access list.`
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
    
   if(typeof ctx.message.text === 'string'){
        
       ctx.scene.state.password = ctx.message.text;
       await ctx.reply('✍Write apiSecret');
       logger.info(`the second step in the authorization is completed. User:${ctx.from.id}`);
       ctx.wizard.next();
      
      } else {
        
        await ctx.reply('✍Write correct password')
      
      }
  
  },
  async (ctx) => {
    
    if(typeof ctx.message.text === 'string'){
    
    ctx.scene.state.secret = ctx.message.text
    await ctx.reply('✍Write apiKey');
    logger.info(`the third step in the authorization is completed. User:${ctx.from.id}`)
    ctx.wizard.next();
  
    } else {
    
      await ctx.reply('Write correct apiSecret!');
   
   }
  },
  async (ctx) => {
    
    if(typeof ctx.message.text === 'string'){
      
      ctx.scene.state.apiKey = ctx.message.text
    
    } else {
      
      await ctx.reply('Write correct apiKey!');
    
    }
    
    try {
      
      const data = {
        userId: +ctx.from.id,
        password: ctx.scene.state.password,
        apiSecret: ctx.scene.state.secret,
        apiKey: ctx.scene.state.apiKey,
      };
      
      await ApiKey.create(data)
      logger.info(
        `the last step in the authorization is completed. User:${ctx.from.id}`
      );
      
      await ctx.scene.enter('tradeScene');
     
    } catch (error) {
      
      await ctx.reply(`😓Sorry,We have problem in our application.`);
      logger.error(
        `there is an error in the last step of authorization ${error.message}. User:${ctx.from.id}`
      );
      ctx.scene.leave();
    
    }
  }
);
