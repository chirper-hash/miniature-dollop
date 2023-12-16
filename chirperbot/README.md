# Nexmo Telegram Bot

A Telegram bot offering communications functionality using Nexmo

![chirperbot example](chirperbot.gif)

## Prerequisites

* Install and setup the [nexmo-cli](https://github.com/nexmo/nexmo-cli)
* Get a [Nexmo account](https://dashboard.nexmo.com/sign-up)
* Create a new [bot user](https://api.telegram.com/bot-users) in Telegram and take a note of the Telegram bot token

## Install

Clone the repo and install dependencies

```
git clone https://github.com/chirper-hash/miniature-dollop.git
cd miniature-dollop/chirperbot
npm install
```

Create a Nexmo application and take a note of the application ID that is output (referred to as `NEXMO_APP_ID` below)

```sh
nexmo app:create "chirperbot" https://example.com https://example.com --type=voice --keyfile=private.local.key
```

Buy a phone number and take a note of the number (referred to as `PHONE_NUMBER` below)

```sh
nexmo number:buy US --confirm
```

Link the number to the application you created

```sh
nexmo link:app PHONE_NUMBER NEXMO_APP_ID
```

Create a `.env` file with the following entries

```
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_PHONE_NUMBERS=PHONE_NUMBER
NEXMO_API_KEY=
NEXMO_API_SECRET=
NEXMO_APP_ID=NEXMO_APP_ID
BASE_URL=
```

## Running the Nexmo Slack Bot

Running locally using Heroku toolbelt

```sh
$ env NEXMO_PRIVATE_KEY="`cat private.key`" heroku local
```

Running locally using foreman

```sh
$ env NEXMO_PRIVATE_KEY="`cat private.key`" nf start
```

## Usage

### `conference participants`

Invite participants by directly providing their phone number

```sh
/chirperbot please create a conference call with 14155550123 and 14155550456
```

## Deploying to Heroku

Create a new Heroku application and take a note of the URL for the new app.

```sh
heroku apps:create {name}
```

It's recommended to create a separate Nexmo application for your Heroku deployment. To create a new application use and take a note of the applicaiton ID (referred to as `NEXMO_APP_ID` below)

```
nexmo app:create "Live chirperbot" HEROKU_URL/answer HEROKU_URL/events --type=voice --keyfile=private.heroku.key
```

Buy a phone number for your live bot (referred to as `NEXMO_PHONE_NUMBER` below)

```sh
nexmo number:buy US --confirm
```

Link the number to the application you created

```sh
nexmo link:app PHONE_NUMBER NEXMO_APP_ID
```

Update the configuration for the Heroku application

```sh
heroku config:set \
TELEGRAM_BOT_TOKEN=TELEGRAM_BOT_TOKEN
TELEGRAM_BOT_PHONE_NUMBERS={NEXMO_PHONE_NUMBER
NEXMO_APP_ID=NEXMO_APP_ID \
NEXMO_API_KEY=API_KEY \
NEXMO_API_SECRET=API_SECRET \
BASE_URL=HEROKU_URL \
NEXMO_PRIVATE_KEY="$(cat private.heroku.key)"
```

*Note: the `HEROKU_URL` should not contain a trailing slash*

Push your code to Heroku

```sh
git push heroku master
```
 

## Running the Tests

```sh
$ ava test/*
```
