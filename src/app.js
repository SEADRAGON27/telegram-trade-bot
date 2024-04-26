import 'dotenv/config';
import { Telegraf, Markup, session, Scenes } from 'telegraf';
import { wizardScenePrice } from './tradingScenes/cryptocurrencyPrice.js';
import { wizardSceneNotification } from './notificationScenes/setNotification.js';
import { wizardSceneDelete } from './notificationScenes/deleteNotification.js';
import { SceneTradingAuthorization } from './authorization.js';
import { handler } from './notificationScenes/notificationHandler.js';
import { wizardSceneTrade } from './tradingScenes/handler.js';
import { ordersScene } from './tradingScenes/openOrder.js';
import { withdrawScene } from './tradingScenes/withdraw.js';
import { listOrdersScene } from './tradingScenes/listAllOrders.js';
import { cancelOrdersScene } from './tradingScenes/cancelOrder.js';
import { changeDataAuthScene } from './tradingScenes/changeDataAuth.js';

function startBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const stage = new Scenes.Stage([
    wizardScenePrice,
    wizardSceneNotification,
    wizardSceneDelete,
    SceneTradingAuthorization,
    wizardSceneTrade,
    ordersScene,
    withdrawScene,
    listOrdersScene,
    cancelOrdersScene,
    changeDataAuthScene,
  ]);
  bot.use(session());
  bot.use(stage.middleware());

  bot.command('start', async (ctx) => {
    await ctx.reply(
      'Welcome, select a option:',
      Markup.inlineKeyboard([
        [Markup.button.callback('💵Get prices of cryptocurrencies', 'prices')],
        [
          Markup.button.callback(
            '📨Set a token price notification',
            'notification'
          ),
        ],
        [Markup.button.callback('❌Delete notification', 'delete')],
        [Markup.button.callback('📈Start to Trade', 'trade')],
      ])
    );
  });

  bot.on('message', async (ctx) => {
    await ctx.reply('No such answer!');
  });

  bot.action('prices', async (ctx) => {
    await ctx.scene.enter('getCryptocurrencyPrice');
  });

  bot.action('notification', async (ctx) => {
    await ctx.scene.enter('getNotification');
  });

  bot.action('delete', async (ctx) => {
    await ctx.scene.enter('deleteNotification');
  });
  bot.action('trade', async (ctx) => {
    await ctx.scene.enter('authorization');
  });

  setInterval(handler, 50000);
  bot.launch();
}

startBot();
