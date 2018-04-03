require("dotenv").config();
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Random = require("./prng");
const kakoy = require("./kakoy.json");

const COMMAND = "/send@vkozulya_bot";
const HISTORY_DAYS_COUNT = 5;
const HISTORY_WORDS = [
  "Вчера",
  "Позавчера",
  "3 дня назад",
  "4 дня назад",
  "5 дней назад"
];

const getKakoy = (userId, date) => {
  const normalizedDate = new Date(date.setHours(0, 0, 0, 0));
  const seed = userId + Math.round(normalizedDate.getTime() / 1e7);
  const random = new Random(seed).next();
  const wordsCount = random % 4 + 1;

  return Array(wordsCount)
    .fill()
    .reduce((result, _, idx) => {
      const wordIdx = new Random(seed + idx).next() % kakoy.length;

      return `${result}${kakoy[wordIdx]} `;
    }, "");
};

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Добавь меня в чат и имитируй Козулю"));

bot.on("message", async ({ message, reply, telegram }, next) => {
  if (message.text && message.text.indexOf(COMMAND) === 0) {
    console.log(JSON.stringify(message));
    const extra = message.reply_to_message
      ? Extra.inReplyTo(message.reply_to_message.message_id)
      : null;
    await reply(message.text.slice(COMMAND.length).trim() || "Ух бля", extra);

    try {
      await telegram.deleteMessage(message.chat.id, message.message_id);
    } catch (err) {}
  } else {
		next();
	}
});

bot.command("kakoy", ({ message, reply }) => {
  const answer = getKakoy(message.from.id, new Date());

  reply(`Сегодня ты ${answer} Козуля!`);
});

bot.command("hist", ({ message, reply }) => {
  const answer = Array(HISTORY_DAYS_COUNT)
    .fill()
    .reduce((result, _, idx) => {
			const date = new Date();
			const resultDate = new Date(date.setDate(date.getDate() - idx));
      const kakoy = getKakoy(message.from.id, resultDate);

      return `${result}${HISTORY_WORDS[idx]} ты был ${kakoy} Козуля!\n`;
    }, "");

  reply(answer);
});

bot.startPolling();
