const test = require('ava');
const sinon = require('sinon');
const NexmoHelper = require('../lib/NexmoHelper');

// Mock objects or modules as needed for testing
const mockBot = {
  api: {
    sendMessage: sinon.stub(),
  },
};

const mockNexmo = {
  calls: {
    create: sinon.stub(),
    update: sinon.stub(),
  },
};

const mockConfig = {
  BASE_URL: 'https://17da-20-115-105-176.ngrok-free.app',
  TELEGRAM_BOT_PHONE_NUMBERS: ['16128657890'],
};

test.beforeEach(t => {
  // Reset stubs before each test
  mockBot.api.sendMessage.resetHistory();
  mockNexmo.calls.create.resetHistory();
  mockNexmo.calls.update.resetHistory();
});

test('Test _conferenceIntent with valid input', async t => {
  const nexmoHelper = new NexmoHelper(mockBot, mockNexmo, mockConfig);
  const message = {
    chat: { id: 123 },
    tokens: ['/call', 'otp', '14155550123'],
  };

  await t.notThrowsAsync(async () => {
    await nexmoHelper._conferenceIntent(message);
  });

  t.true(mockNexmo.calls.create.calledOnce);
  // Add more assertions as needed
});

test('Test _helpIntent', async t => {
  const nexmoHelper = new NexmoHelper(mockBot, mockNexmo, mockConfig);
  const message = {
    chat: { id: 123 },
    tokens: ['/help', 'help'],
  };

  await t.notThrowsAsync(async () => {
    await nexmoHelper._helpIntent(message);
  });

  t.true(mockBot.api.sendMessage.calledOnce);
  // Add more assertions as needed
});

// Add more test cases for other functions and edge cases
