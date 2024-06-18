import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { cryptocurrencyPrice } from '../api.js';
import { sendMessageSMS } from '../utils/twilio.js';
import { UserNotification } from '../models/userNotification.js';
import { logger } from '../logs/logger.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

export const handler = async () => {
  
  try {
    
    const userNotifications = await UserNotification.find({});
    
    for (const data of userNotifications) {
      
      const currantPrice = await cryptocurrencyPrice(data.cryptocurrancy);
      
      const dataD = {
        cryptocurrancy:data.cryptocurrancy,
        price:data.price,
        userId:data.userId
      }
      
      const notification = `✅Price ${data.cryptocurrancy} reached the goal.
      ${data.notification ? `✍Comment:${data.notification}` : ''}`;

      if (data.telegram && currantPrice >= data.price) {
        
        await bot.telegram.sendMessage(data.userId, notification);
        await UserNotification.deleteOne(dataD)
      }

      if (data.sms && currantPrice >= data.price) {
        
        await sendMessageSMS(data.phone, notification);
        await UserNotification.deleteOne(dataD)
      
      }

      if (data.both && currantPrice >= data.price) {
        
        await bot.telegram.sendMessage(data.userId, notification);
        await sendMessageSMS(data.phone, notification);
        await UserNotification.deleteOne(dataD)
      
      }
    }
    
    logger.info(`the notificationHandler is comleted`);
  
  } catch (error) {
    logger.error(
      `there is an error in the notificationHandler ${error.message}`
    );
  }
};
