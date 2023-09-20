import "dotenv/config";
import { Scenes, Markup, session, Telegraf } from "telegraf";
import { ordersScene } from "./orders.js";
import { withdrawScene } from "./withdraw.js";
import { listOrdersScene } from "./listaAllOrders.js";
import { cancelOrders } from "./cancelOrders.js";
import { changeDataAuthScene } from "./changeDataAuth.js";

export const wizardSceneTrade = new Scenes.WizardScene(
  "tradeScene",
  async (ctx) => {
    await ctx.reply(
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
 async (ctx) => {
    const userInput = ctx.message;

    if (userInput) {
      await ctx.reply("⛔ Please use the buttons to make a selection.");
    } else {
      switch (ctx.callbackQuery.data) {
        case "open/close":
          await ctx.scene.enter("openOrder");
          break;
        case "withdraw":
          await ctx.scene.enter("withdraw");
          break;
        case "orders":
          await ctx.scene.enter("listAllOrders");
          break;
        case "cancel":
          await ctx.scene.enter("cancelOrders");
          break;
        case "change":
          await ctx.scene.enter("changeDataAuth");
          break;
      }
     ctx.scene.leave()
    }
  }
);
