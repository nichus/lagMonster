const logger = require('../logger.js');

class Rollies {

	constructor() {
		this.current = 0;
		this.regex = new RegExp(/((?<label>\w+):\s+)?(?<count>\d+)?d(?<sides>\d+)(?<mod>[-+]\d+)?(?<drop>-[LH])?/,"g");
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
		const matches = content.matchAll(this.regex);
		let loop = 0;
		const rolls = new Array();
		for (const match of matches) {
			loop++;
			const count = parseInt(match.groups.count,10) || 1;
			const sides = parseInt(match.groups.sides,10);
			const mod   = parseInt(match.groups.mod,10) || 0;
			let label = match.groups.label || `roll(${match[0]})`;
			const drop  = match.groups.drop || '';
			let   crit  = '';

			const rawRolls = new Array(count).fill(0).map( e => Math.floor(Math.random()*sides)+1);
			rawRolls.sort((a,b) => b-a)

			if (drop.indexOf('H') > 0) {
				rawRolls.shift();
			} else if (drop.indexOf('L') > 0) {
				rawRolls.pop();
			}

			if (sides===20 && rawRolls.length==1) {
				if(rawRolls[0] == 1) {
					crit = '(FAIL)';
				} else if (rawRolls[0] == sides) {
					crit = '(SUCCESS)';
				}
			}

			const total = rawRolls.reduce( (t,r) => t+r, mod)
			const string = `${label}: [${total}](${message.url} "[${rawRolls.join(',')}]${mod>-1?'+':''}${mod}")${crit.length>0?crit:''}`;

			rolls.push(string);
		}
		//return rolls.join(', ')
		message.reply(rolls.join(', '))
	}
}

module.exports.Rollies = Rollies;
