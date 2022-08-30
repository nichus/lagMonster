class NumberWang {

	constructor() {
		this.current = 0;
		this.regex = new RegExp(/numberWang/i);
		this.pickNumber();
	}

	pickNumber() {
		this.current =  String(Math.floor(Math.random() * 100));
		this.regex = new RegExp(`(^|\\s)[^<]*${this.current}[^>]*(\\s|$)`);
		// console.log("numberWang picked: ",this.current);
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

		// console.log(message);
		// console.log(message.content);
		// console.log(content);
		if (this.regex.test(content)) {
			message.reply(`${this.current}? That's Numberwang!\n<https://www.youtube.com/watch?v=0obMRztklqU>`);
			this.pickNumber();
		}
	}
}

module.exports.NumberWang = NumberWang;
