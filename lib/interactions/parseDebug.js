const logger = require('../logger.js');
exports.parseDebug = parseDebug;

function parseDebug(message) {
	if (message.content.match(/^debug this:/) && message.channel.id == '1011802433825022103') {
		message.reply(`<@${message.author.tag}>`);
		logger.debug(message);
		message.guild.members.fetch().then((members) => {
			members.each((gm) => {
				console.log(gm.user.tag, gm.id);
			});
		});
	}
}
