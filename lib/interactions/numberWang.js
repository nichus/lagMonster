const logger = require('../logger.js');

class NumberWang {

	constructor() {
		this.current = 0;
		this.regex = new RegExp(/numberWang/i);
		this.pickNumber();
		this.options = [
			'https://tenor.com/view/numberwang-thatsnumberwang-thatmitchellandwebblook-gif-7985932',
			'https://www.youtube.com/watch?v=0obMRztklqU',
		];
	}

	pickNumber() {
		this.current =  String(Math.floor(Math.random() * 100));
		// this.regex = new RegExp(`(^|\\s)[^<]*${this.current}[^>]*(\\s|$)`);
		this.regex = new RegExp(`(?<!<)\\b${this.current}\\b(?!>)`);
		// logger.error(`numberWang picked: ${this.current}`);
	}

	check(message) {
		// If the message received is just an embedded image/video, don't trigger
		// numberWang since noone can see the embedded url
		if (message.embeds[0] && message.embeds[0].data.url === message.content) {
			return;
		}
		let content = message.content;

		// Strip out mentions from our comparison...
		// channel mention
		content = content.replace(/<#\d+>/g, '');
		// role mention
		content = content.replace(/<@&\d+>/g, '');
		// user mention
		content = content.replace(/<@!?\d+>/g, '');

		// logger.debug(message);
		// logger.debug(message.content);
		// logger.debug(content);
		if (this.regex.test(content)) {
			const response = this.options[Math.floor(Math.random() * this.options.length)];
			message.reply(`${this.current}? That's Numberwang!\n${response}`);
			this.pickNumber();
		}
	}
}

module.exports.NumberWang = NumberWang;
