import "dotenv/config";
import { Scenes, Markup, session, Telegraf } from "telegraf";
import { ordersScene } from "./orders.js";
import { withdrawScene } from "./withdraw.js";
import { listOrdersScene } from "./listaAllOrders.js";
import { cancelOrders } from "./cancelOrders.js";
import { changeDataAuthScene } from "./changeDataAuth.js";
const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([
  ordersScene,
  withdrawScene,
  listOrdersScene,
  cancelOrders,
  changeDataAuthScene,
]);
bot.use(session());
bot.use(stage.middleware());
export const wizardSceneTrade = new Scenes.WizardScene(
  "tradeScene",
  (ctx) => {
    ctx.reply(
      "🤔Choose command:",
      Markup.inlineKeyboard([
        [Markup.button.callback("⚡Open/Close order", "open/close")],
        [Markup.button.callback("⚡Withdraw", "withdraw")],
        [Markup.button.callback("⚡List all orders", "orders")],
        [Markup.button.callback("⚡Cancel order", "cancel")],
        [Markup.button.callback("⚡Change autorization data", "change")],
      ])
    );
    ctx.wizard.next();
  },
  (ctx) => {
    const userInput = ctx.message;

    if (userInput) {
      ctx.reply("⛔ Please use the buttons to make a selection.");
    } else {
      switch (ctx.callbackQuery.data) {
        case "open/close":
          ctx.scene.enter("openOrder");
          break;
        case "withdraw":
          ctx.scene.enter("withdraw");
          break;
        case "orders":
          ctx.scene.enter("listAllOrders");
          break;
        case "cancel":
          ctx.scene.enter("cancelOrders");
          break;
        case "change":
          ctx.scene.enter("changeDataAuth");
          break;
      }
    }
  }
);
