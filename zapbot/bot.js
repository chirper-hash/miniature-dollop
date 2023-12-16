const { Bot, session } = require('grammy');

const help = require('./commands/help');
const call = require('./commands/call');
const user = require('./commands/user');
const config = require('./config');

const TOKEN = config.token
const bot = new Bot(TOKEN);

// Attach the middleware to the bot
bot.use(session());
bot.use(user)
bot.use(help);
bot.use(call);

// Start the bot
bot.start();