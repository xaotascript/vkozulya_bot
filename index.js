require('dotenv').config();
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply('Добавь меня в чат и имитируй Козулю'));

const COMMAND = '/send@vkozulya_bot';

bot.on('message', async ({message, reply, telegram}) => {
	if (message.text && message.text.indexOf(COMMAND) === 0) {
		console.log(JSON.stringify(message));
		const extra = message.reply_to_message ? Extra.inReplyTo(message.reply_to_message.message_id) : null;
		await reply(message.text.slice(COMMAND.length).trim() || 'Ух бля', extra);

		try {
			await telegram.deleteMessage(message.chat.id, message.message_id);
		} catch(err) {};
	}
});

bot.startPolling();
