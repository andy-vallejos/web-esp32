import mqtt from "mqtt";
import TelegramBot from "node-telegram-bot-api";

const TOKEN = "8888500971:AAHCNVsbw5hBcFTRld-thRYuRsUuLik4Awo";
const CHAT_ID = "8191019043";

const bot = new TelegramBot(TOKEN);

const client = mqtt.connect("mqtts://b4185255.ala.us-east-1.emqxsl.com:8883", {
  username: "andy-vallejos",
  password: "agvbe26.",
});

let alertaEnviada = false;

client.on("connect", () => {
  console.log("MQTT conectado");
  client.subscribe("sensor/temperatura");
});

client.on("message", async (topic, message) => {
  const temperatura = parseFloat(message.toString());

  console.log(`Temperatura: ${temperatura}°C`);

  if (temperatura >= 30 && !alertaEnviada) {
    try {
      await bot.sendMessage(
        CHAT_ID,
        `🚨 ALERTA\nTemperatura crítica: ${temperatura}°C`,
      );

      console.log("Alerta enviada");

      alertaEnviada = true;
    } catch (err) {
      console.error(err);
    }
  }

  if (temperatura < 28) {
    alertaEnviada = false;
  }
});
