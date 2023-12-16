const config = {
 TELEGRAM_BOT_TOKEN: null,
 TELEGRAM_BOT_PHONE_NUMBERS: null,
 NEXMO_API_KEY: null,
 NEXMO_API_SECRET: null,
 NEXMO_APP_ID: null,
 NEXMO_PRIVATE_KEY: null,
 BASE_URL: null
}

const configErrors = [];

Object.keys(config).forEach((key) => {
 let configValue = process.env[key];
 if(!configValue) {
   configErrors.push(key);
 }
 else {
   config[key] = configValue;
 }
});

if(configErrors.length) {
 throw new Error(`Some required environmental variables were not found: ${configErrors.join(',')}`);
}

config.TELEGRAM_BOT_PHONE_NUMBERS = config.TELEGRAM_BOT_PHONE_NUMBERS.split(',');

module.exports = config;