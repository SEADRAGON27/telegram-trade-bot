import twilio from "twilio";
import "dotenv/config";
export const sendMessageSMS = async (phoneNumber, comment) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  try {
    const res = await client.messages.create({
      body: comment,
      from: process.env.PHONE_NUMBER,
      to: phoneNumber,
    });
    } catch (err) {
    console.log(err);
  }
};
