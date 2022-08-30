const fs = require('node:fs');
const logger = require('../logger.js');

class PlusPlus {

	constructor(dataFile) {
		this.fileName = dataFile;
		this.data = require(this.fileName);
		// logger.debug(this.data);
		this.phrases = ['has earned', 'earned a total of ', 'racked up', 'collected', 'is rocking with', 'gathered', 'scored again to have' ];
		this.emotes = [ '( o.o)', 'Lovely', 'Charming', 'Adorable', 'Sweet', 'Delicious', 'Cute', 'Delightful', 'uwu', 'Kawaii', '(✿◕‿◕)' ];
		this.angry  = [ '( ಠ_ಠ)', '( ͡ಠ ʖ̯ ͡ಠ )', '(╯°□°)╯︵ ┻━┻', '(ノಠ益ಠ)ノ彡┻━┻', '(┛✧Д✧))┛彡┻━┻' ];
	}

	pickFromList(list) {
		return list[Math.floor(Math.random() * list.length)];
	}

	increment(target) {
		if (!(target in this.data)) {
			this.data[target] = { 'score': 0 };
		}
		this.data[target]['score']++;
	}

	// reply with the plus-plusified score
	report(message, target) {
		message.reply(`${this.pickFromList(this.emotes)}. <@${target}> ${this.pickFromList(this.phrases)} ${this.data[target]['score']} points!`);
	}

	// write out the updated plus-plus stats
	saveState() {
		fs.writeFile(
			this.fileName,
			JSON.stringify(this.data),
			function(err) { if (err) { logger.error(err) } },
		);
	}

	parseMessage(message) {
		const plusTargetRegex = /<@!?(\d+)>\s*\+\+/;

		if (plusTargetRegex.test(message.content)) {

			// Get the plusplus target from the message
			const plusTarget = message.content.match(plusTargetRegex)[1];

			if (message.author.id == plusTarget) {
				// Someone's being cheaty!
				message.reply(`${this.pickFromList(this.angry)} Cheater detected! Don't plus-plus yourself ${message.author}!`);
			} else {
				this.increment(plusTarget);
				this.report(message, plusTarget);
				this.saveState();
			}
		}
	}
}

module.exports.PlusPlus = PlusPlus;
