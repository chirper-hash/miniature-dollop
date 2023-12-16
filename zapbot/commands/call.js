// callCommand.js
const { Composer } = require('grammy');
const axios = require('axios');
const qs = require('qs');
const config = require('../config');

const callCommand = new Composer();

callCommand.command('call', async (ctx) => {
    await handleCallCommand(ctx, false);
});

callCommand.command('calltest', async (ctx) => {
    await handleCallCommand(ctx, true);
});

async function handleCallCommand(ctx, isTest) {
    const args = ctx.message.text.split(' ').slice(1);

    if (args.length < 2) {
        return ctx.reply('Need more arguments\nYou need to give 2 arguments, example: /call 33612345678 paypal');
    }

    if (!args[0].match(/^\d{8,14}$/g)) {
        return ctx.reply('Bad phone number\nThis phone number is not good, a good one: 33612345678');
    }

    if (!args[1].match(/[a-zA-Z]+/gm)) {
        return ctx.reply('Bad service name\nThis service name is not good, a good one: paypal');
    }

    const user = isTest ? 'test' : ctx.from.username;
    const name = args[2] || null;

    try {
        await axios.post(config.apiurl + '/call/', qs.stringify({
            password: config.apipassword,
            to: args[0],
            user: user,
            service: args[1].toLowerCase(),
            name: name?.toLowerCase() || null
        }));
    } catch (error) {
        console.error(error);
        return ctx.reply('Error sending call request.');
    }

    const message = `The api call has been sent to ${args[0]} using ${args[1]} service.`;
    return ctx.reply(`Call sent\n${message}`);
}

module.exports = callCommand;
