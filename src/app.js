import "dotenv/config";
import { Telegraf, Markup, session, Scenes } from "telegraf";
import { wizardScenePrice } from "./tradingScenes/priceCurrancy.js";
import { wizardSceneNotification } from "./notificationScenes/setNotifications.js";
import { wizardSceneDelete } from "./notificationScenes/deleteNotification.js";
import { SceneTradingAutorization } from "./autorization.js";
import { handler } from "./notificationScenes/notificationHandler.js";
import { wizardSceneTrade } from "./tradingScenes/handler.js";
import { ordersScene } from "./tradingScenes/orders.js";
import { withdrawScene } from "./tradingScenes/withdraw.js";
import { listOrdersScene } from "./tradingScenes/listaAllOrders.js";
import { cancelOrders } from "./tradingScenes/cancelOrders.js";
import { changeDataAuthScene } from "./tradingScenes/changeDataAuth.js";

function startBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const stage = new Scenes.Stage([
    wizardScenePrice,
    wizardSceneNotification,
    wizardSceneDelete,
    SceneTradingAutorization,
    wizardSceneTrade,
    ordersScene,
    withdrawScene,
    listOrdersScene,
    cancelOrders,
    changeDataAuthScene,
  ]);
  bot.use(session());
  bot.use(stage.middleware());
  
  bot.command("start", (ctx) => {
    ctx.reply(
      "Добро пожаловать, выберите команду:",
      Markup.inlineKeyboard([
        [Markup.button.callback("💵Get prices of cryptocurrencies", "prices")],
        [Markup.button.callback("📨Set a token price notification","notification")],
        [Markup.button.callback("❌Delete notification", "delete")],
        [Markup.button.callback("📈Start to Trade", "trade")],
      ])
    );
  });
  
 
  bot.on("message", (ctx) => {
    ctx.reply("No such answer!");
  });

  bot.action("prices", (ctx) => {
    ctx.scene.enter("getPricesCrypto");
  });

  bot.action("notification", (ctx) => {
    ctx.scene.enter("getNotification");
  });

  bot.action("delete", (ctx) => {
    ctx.scene.enter("deleteNotification");
  });
  bot.action("trade", (ctx) => {
    ctx.scene.enter("autorization");
  });
  
  setInterval(handler, 50000);
  bot.launch();
}

startBot();
