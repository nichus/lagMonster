const fs = require('node:fs');
const logger = require('../logger.js');

class PlusPlus {

	constructor(dataFile) {
		this.fileName = dataFile;
		this.data = require(this.fileName);
		// logger.debug(this.data);
		this.phrases = ['has earned', 'earned a total of ', 'racked up', 'collected', 'is rocking with', 'accumulated', 'gathered', 'scored again! New total of ' ];
		this.sadPhrases = ['has fallen to', 'fell back to', 'is only at', 'slides to', 'collected', 'is chilling with', 'lost ground to' ];
		this.pending = [`(⚪'ㄅ'⚪)`];
		this.emotes = [ '( o.o)', 'Lovely', 'Charming', 'Adorable', 'Sweet', 'Delicious', 'Cute', 'Delightful', 'uwu', 'Kawaii', '(✿◕‿◕)' ];
		this.angry  = [ '( ಠ_ಠ)', '( ͡ಠ ʖ̯ ͡ಠ )', '(╯°□°)╯︵ ┻━┻', '(ノಠ益ಠ)ノ彡┻━┻', '(┛✧Д✧))┛彡┻━┻' ];
	}

	pickFromList(list) {
		return list[Math.floor(Math.random() * list.length)];
	}

	increment(target) {
		if (!(target.tag in this.data)) {
			this.data[target.tag] = { 'score': 0 };
		}
		this.data[target.tag]['score']++;
		this.data[target.tag]['id'] = target.id.toString();
	}

	decrement(target) {
		if (!(target.tag in this.data)) {
			this.data[target.tag] = { 'score': 0 };
		}
		this.data[target.tag]['score']--;
		this.data[target.tag]['id'] = target.id.toString();
	}

	// reply with the plus-plusified score
	report(message, target, phrases) {
		// message.reply(`${this.pickFromList(this.emotes)}. ${target} ${this.pickFromList(phrases)} ${this.data[target.tag]['score']} points!`);
		message.channel.send(`${this.pickFromList(this.emotes)}. ${target} ${this.pickFromList(phrases)} ${this.data[target.tag]['score']} points!`);
	}

	// write out the updated plus-plus stats
	saveState() {
		fs.writeFile(
			this.fileName,
			JSON.stringify(this.data),
			function(err) { if (err) { logger.error(err) } },
		);
	}

	async parseMessage(message) {
		if (message.author.bot) { return; }
		const plusTargetRegex = /<@!?(\d+)>\s*\+\+/;

		if (message.partial) {
			try {
				await message.fetch();
			} catch (error) {
				logger.error('Something went wrong when fetching the message:', error);
				return;
			}
		}

		if (plusTargetRegex.test(message.content)) {
			// Get the plusplus target from the message
			const userId = message.content.match(plusTargetRegex)[1];
			message.client.users.fetch(userId).then((target) => {
				if (message.author === target) {
					message.reply(`${this.pickFromList(this.angry)} Cheater detected! Don't plus-plus yourself ${message.author}!`);
				} else {
					this.increment(target);
					this.report(message, target, this.phrases);
					this.saveState();
				}
			});
		}
	}
	parseAddEmoji(reaction, user) {
		if (user.bot) { return }
		const message = reaction.message;
		// Validate that reacting user isn't reacted user
		if (user.id !== message.author.id) {
			// Validate added emoji is one lag cares about
			if (reaction.emoji.name === '👍' || reaction.emoji.name === 'plus') {
				this.increment(message.author);
				this.report(message, message.author, this.phrases);
				this.saveState();
			} else if (reaction.emoji.name === '👎') {
				this.decrement(message.author);
				this.report(message, message.author, this.sadPhrases);
				this.saveState();
			}
		}
	}
	parseRemoveEmoji(reaction, user) {
		if (user.bot) { return }
		const message = reaction.message;
		// Validate that reacting user isn't reacted user
		if (user.id !== message.author.id) {
			// Validate removed emoji is one lag cares about
			if (reaction.emoji.name === '👍' || reaction.emoji.name === 'plus') {
				this.decrement(message.author);
				this.report(message, message.author, ['is back down to']);
				this.saveState();
			} else if (reaction.emoji.name === '👎') {
				this.increment(message.author);
				this.report(message, message.author, ['is back up to']);
				this.saveState();
			}
		}
	}
}

module.exports.PlusPlus = PlusPlus;
