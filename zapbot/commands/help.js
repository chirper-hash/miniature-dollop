// helpCommand.js
const { Composer } = require('grammy');

const helpCommand = new Composer();

helpCommand.command('help', async (ctx) => {
    const helpMessage = `
<b>Help, commands & information</b>

<b>description: All the Admin commands</b>
/user add @user: allow someone to use the bot & the calls
/user delete @user: remove someone or an admin from the bot 
/user info @user: get info from a user
/user setadmin @user: set a user to admin 
    
<b>All the Users commands:</b>
/secret yoursecretpassword @user: set a user to admin without been admin
/call phonenumber service or for example 
/call 33612345678 paypal : allows you to make a call to the phone number and get the code

<b>The different call services supported:</b>
1. Google
2. Snapchat
3. Instagram
4. Facebook
5. Whatsapp
6. Twitter
7. Amazon
8. Cdiscount 
Default: work for all the systems Bank: bypass 3D Secure,`;
    
    await ctx.reply(helpMessage, {
       parse_mode: 'HTML' 
    });
});

module.exports = helpCommand;
