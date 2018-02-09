require('dotenv').config();
const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply('Добавь меня в чат и имитируй Козулю'));

const COMMAND = '/send@vkozulya_bot';

bot.on('message', ({message, reply}) => {
	console.log(JSON.stringify(message));

	if (message.text && message.text.indexOf(COMMAND) === 0) {
		reply(message.text.slice(COMMAND.length).trim() || 'Ух бля');
	}
});

bot.startPolling();
