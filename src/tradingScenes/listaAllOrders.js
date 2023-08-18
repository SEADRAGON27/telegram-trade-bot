import "dotenv/config";
import { Markup, Scenes } from "telegraf";
import { listAllOrders } from "../../api.js";
import { extractFromDB, findUserInfo } from "../db.js";
import { getDate } from "../date.js";
export const listOrdersScene = new Scenes.WizardScene(
  "listAllOrders",
  (ctx) => {
    ctx.reply("✍Write status order 'active' or 'done': ");
    ctx.wizard.next();
  },
  (ctx) => {
    const status = ctx.message.text;
    if (status == "active" || status == "done") {
      ctx.scene.state.status = status;
      ctx.reply(
        "✍You can find list orders for trade pair.\nWrite trade pair or 'next':"
      );
      ctx.wizard.next();
    } else {
      ctx.reply("⛔You must write word 'active' or 'done':");
    }
  },
  (ctx) => {
    const tradePair = ctx.message.text;
    const symbolRegex = /^[A-Z]{3,}-[A-Z]{3,}$/;
    if (symbolRegex.test(tradePair)) {
      ctx.scene.state.tradePair = tradePair;
      ctx.reply("✍Write kind of orders 'buy' or 'sell':");
      ctx.wizard.next();
    } else if (ctx.message.text == "next") {
      ctx.reply("✍Write kind of orders 'buy' or 'sell' or 'all':");
      ctx.wizard.next();
    } else {
      ctx.reply(
        "⛔You should write  trading pair(format:BTC-USDT) or word 'next':"
      );
    }
  },
  (ctx) => {
    const kindOfOrders = ctx.message.text;
    if (kindOfOrders == "buy" || kindOfOrders == "sell") {
      ctx.scene.state.kindOfOrders = kindOfOrders;
      ctx.reply("✍Write type of orders'limit' or 'market' or 'all':");
      ctx.wizard.next();
    } else if (kindOfOrders == "all") {
      ctx.reply("✍Write type of orders'limit' or 'market' or 'all':");
      ctx.wizard.next();
    } else {
      ctx.reply("⛔You must write word 'buy' or 'sell'or 'all':");
    }
  },
  (ctx) => {
    const typeOfOrders = ctx.message.text;
    if (typeOfOrders == "limit" || typeOfOrders == "market") {
      ctx.scene.state.typeOfOrders = typeOfOrders;
      ctx.reply(
        "🤔Select type of trading",
        Markup.inlineKeyboard([
          [Markup.button.callback("💥Spot Trading", "spot")],
          [Markup.button.callback("💥Cross Margin Trading", "margin")],
          [Markup.button.callback("💥Isolated Margin Trading", "isMargin")],
        ])
      );
      ctx.wizard.next();
    } else if (typeOfOrders == "all") {
      ctx.reply(
        "🤔Select type of trading",
        Markup.inlineKeyboard([
          [Markup.button.callback("💥Spot Trading", "spot")],
          [Markup.button.callback("💥Cross Margin Trading", "margin")],
          [Markup.button.callback("💥Isolated Margin Trading", "isMargin")],
        ])
      );
      ctx.wizard.next();
    } else {
      ctx.reply("⛔You should wtite 'limit' or 'market' or 'all':");
    }
  },
  async (ctx) => {
    const userPromt = ctx.message;
    if (userPromt) {
      ctx.reply("⛔ Please use the buttons to make a selection.");
    } else {
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
        const responce = await extractFromDB("usersKey", data);
        const orders = await listAllOrders(
          responce[0].apiSecret,
          responce[0].apiKey,
          responce[0].passPhrase,
          params
        );

        if (orders.length === 0) {
          ctx.reply("❗You haven't orders with the given params.");
        } else {
          for (const order of orders) {
            const time = getDate(order.createdAt);
            ctx.reply(` ➤ order Id:${order.id}
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
        ctx.scene.leave();
      } catch (err) {
        ctx.reply(
          `😓Sorry,something went wrong, make sure that the registration data is written correctly `
        );
        ctx.scene.leave();
      }
    }
  }
);
