import "dotenv/config";
import { Markup, Scenes } from "telegraf";
import { listAllOrders, cancelOrder } from "../../api.js";
import { extractFromDB, findUserInfo } from "../db.js";
import { getDate } from "../date.js";
export const cancelOrdersScene = new Scenes.WizardScene(
  "cancelOrders",
  async (ctx) => {
   await ctx.reply(
      "🤔Choose orders type",
      Markup.inlineKeyboard([
        [Markup.button.callback("💥Spot Trading", "spot")],
        [Markup.button.callback("💥Cross Margin Trading", "margin")],
        [Markup.button.callback("💥Isolated Margin Trading", "isMargin")],
      ])
    );
    ctx.wizard.next();
  },

  async (ctx) => {
    const userPromt = ctx.message;
    if (userPromt) {
      await ctx.reply("⛔ Please use the buttons to make a selection.");
    } else {
      ctx.scene.state.status = "active";
      ctx.scene.state.typeOfOrders = "limit";

      switch (ctx.callbackQuery.data) {
        case "spot":
          ctx.scene.state.typeOfTrading = "TRADE";
          break;
        case "margin":
          ctx.scene.state.typeOfTrading = "MARGIN_TRADE";
          break;
        case "isMargin":
          ctx.scene.state.typeOfTrading = "MARGIN_ISOLATED_TRADE";
          break;
      }

      const params = ctx.scene.state;
      const data = findUserInfo(ctx.from.id);
      try {
        const responce = await DB("getData", data,"userKeys");
        const orders = await listAllOrders(
          responce[0].apiSecret,
          responce[0].apiKey,
          responce[0].passPhrase,
          params
        );
        if (orders.length === 0) {
          await ctx.reply("❗You haven't orders with the given params.");
          ctx.scene.leave();
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

            ctx.scene.state.apiSecret = responce[0].apiSecret;
            ctx.scene.state.apiKey = responce[0].apiKey;
            ctx.scene.state.passPhrase = responce[0].passPhrase;
            await ctx.reply("✍Write order id which you want to cancel:");
            ctx.wizard.next();
          }
        }
      } catch (err) {
        await ctx.reply(
          `😓Sorry,something went wrong, make sure that the registration data is written correctly.`
        );
        ctx.scene.leave();
      }
    }
  },
  async (ctx) => {
    const orderId = ctx.message.text;
    const data = ctx.scene.state;
    await cancelOrder(data, orderId);
    await ctx.reply("✅Order is canceld");
    ctx.scene.leave()
  }
);
