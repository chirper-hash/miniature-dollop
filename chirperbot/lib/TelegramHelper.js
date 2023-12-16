class TelegramHelper {
  constructor() {
    this.commandRegExStr = /^\/(call|help)(?:\s+([\s\S]+))?/; // Updated command regex
    this.commandRegEx = new RegExp(this.commandRegExStr);
  }

  parse(message) {
    const parsedMessage = Object.assign({}, message);

    parsedMessage.isCommand = this.commandRegEx.test(message.text);

    if (parsedMessage.isCommand) {
      const matchResult = this.commandRegEx.exec(message.text);
      if (matchResult) {
        parsedMessage.command = matchResult[1]; // Extract the command
        parsedMessage.tokens = matchResult[2] ? matchResult[2].trim().split(' ') : [];
      }
    }

    return parsedMessage;
  }
}

module.exports = TelegramHelper;
