var pkgJson = require(__dirname + '/../package.json');
const config = require('./config');

console.log(`chirperbot bot v${pkgJson.version} is running`);
console.log('config loaded', config);

const { Bot, Composer } = require('grammy');
const NexmoHelper = require('./NexmoHelper');
const NexmoHelperError = require('./NexmoHelperError');  // Import NexmoHelperError

const Nexmo = require('nexmo');

const TOKEN = config.TELEGRAM_BOT_TOKEN
const bot = new Bot(TOKEN);

const nexmo = new Nexmo({
  apiKey: config.NEXMO_API_KEY,
  apiSecret: config.NEXMO_API_SECRET,
  applicationId: config.NEXMO_APP_ID,
  privateKey: './private.key'
}, { debug: true });

const nexmoHelper = new NexmoHelper(bot, nexmo, config);

// Middleware for handling incoming messages
bot.use(async (ctx, next) => {
  const message = ctx.message;
  const parsedMessage = nexmoHelper.telegramHelper.parse(message);

  try {
    nexmoHelper.handleMessage(parsedMessage);
  } catch (error) {
    // Handle errors accordingly
    if (error instanceof NexmoHelperError) {
      ctx.reply(`<b>[CAUTION!]⚠️:</b> There was a problem handling the message \`${message.text}\`\nThe error was \`${error.message}\``, {
        parse_mode: 'HTML',
      });
    } else {
      console.error(error);
      ctx.reply('<b>[CAUTION!]⚠️:</b> An unexpected error occurred. Please contact your nearest Ch1rp3r Communications specialist.', {
        parse_mode: 'HTML',
      });
    }
  }

  return next();
});

// Global error handler using bot.catch
bot.catch((err, ctx) => {
 // Check if ctx and ctx.update are defined
 const updateId = ctx && ctx.update ? ctx.update.update_id : 'unknown';
 console.error(`Error in update ${updateId}:`, err);
 // Handle the error or reply to the user accordingly
});

// Start the bot
bot.start();