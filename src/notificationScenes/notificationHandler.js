import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { cryptocurrencyPrice } from '../api.js';
import { sendMessageSMS } from '../../lib/twilio.js';
import { db } from '../db/connection.js';
import { UserNotification } from '../db/models/userNotification.js';
import { deleteUserInfo } from '../db/utils.js';
import { logger } from '../logs/logger.js';
const bot = new Telegraf(process.env.BOT_TOKEN);

export const handler = async () => {
  try {
    const userNotifications = await db('getData', {}, UserNotification);
    for (const data of userNotifications) {
      const currantPrice = await cryptocurrencyPrice(data.cryptocurrancy);
      const dataD = deleteUserInfo(
        data.cryptocurrancy,
        data.price,
        data.userId
      );
      const notification = `✅Price ${data.cryptocurrancy} reached the goal.
      ${data.notification ? `✍Comment:${data.notification}` : ''}`;

      if (data.telegram && currantPrice >= data.price) {
        await bot.telegram.sendMessage(data.userId, notification);
        await db('deleteData', dataD, UserNotification);
      }

      if (data.sms && currantPrice >= data.price) {
        await sendMessageSMS(data.phone, notification);
        await db('deleteData', dataD, UserNotification);
      }

      if (data.both && currantPrice >= data.price) {
        await bot.telegram.sendMessage(data.userId, notification);
        await sendMessageSMS(data.phone, notification);
        await db('deleteData', dataD, UserNotification);
      }
    }
    logger.info(`the notificationHandler is comleted`);
  } catch (error) {
    logger.error(
      `there is an error in the notificationHandler ${error.message}`
    );
  }
};
