import { Scenes } from 'telegraf';
import { cryptocurrencyPrice } from '../api.js';
import { logger } from '../logs/logger.js';

export const wizardScenePrice = new Scenes.WizardScene(
  'getCryptocurrencyPrice',
  async (ctx) => {
    
    await ctx.reply('✍ Write cryptocurrencies name(bitcoin,monero,ripple)');
    ctx.wizard.next();
  
  },
  async (ctx) => {
    
    const userPrompt = ctx.message.text;
  
    try {
    const res = await cryptocurrencyPrice(userPrompt);
     
    if (+res) {
        
        await ctx.reply(`Price:${res}`);
        logger.info(
          `the second step in the cryptocurrencyPrice is completed. User:${ctx.from.id}`
        );
        ctx.scene.leave();
      
      } else {
        
        await ctx.reply('⛔Cryptocurrency not found, please re-enter the text');
      
      }
    
    } catch (error) {
      
      logger.error(
        `there is an error in the second step of cryptocurrencyPrice ${error.message}. User:${ctx.from.id}`
      );
      ctx.scene.leave();
    
    }
  }
);
