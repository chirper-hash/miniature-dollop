const test = require('ava');
const TelegramHelper = require('../lib/TelegramHelper');

test('Parse command message with /call', t => {
  const telegramHelper = new TelegramHelper();
  const message = {
    text: '/call otp 14155550123 14155550456',
  };

  const parsedMessage = telegramHelper.parse(message);

  t.true(parsedMessage.isCommand);
  t.is(parsedMessage.command, 'call');
  t.deepEqual(parsedMessage.tokens, ['otp', '14155550123', '14155550456']);
});

test('Parse command message with /help', t => {
  const telegramHelper = new TelegramHelper();
  const message = {
    text: '/help',
  };

  const parsedMessage = telegramHelper.parse(message);

  t.true(parsedMessage.isCommand);
  t.is(parsedMessage.command, 'help');
  t.deepEqual(parsedMessage.tokens, []);
});
