require('dotenv').config();
const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply('Добавь меня в чат и имитируй Козулю'));

const COMMAND = '/send@vkozulya_bot';

bot.on('message', async ({message, reply, telegram}) => {
	if (message.text && message.text.indexOf(COMMAND) === 0) {
		console.log(JSON.stringify(message));
		await reply(message.text.slice(COMMAND.length).trim() || 'Ух бля');

		try {
			await telegram.deleteMessage(message.chat.id, message.message_id);
		} catch(err) {};
	}
});

bot.startPolling();
