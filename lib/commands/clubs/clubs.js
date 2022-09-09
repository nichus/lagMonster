const fs = require('node:fs');
const { channelMention } = require('discord.js');
const logger = require('../../logger.js');

class Clubs {
	constructor() {
		this.fileName = './data/clubs.json';
		this.data = JSON.parse(fs.readFileSync(this.fileName, 'utf8'));
		/* {
		 *   'clubTypes': [ 'type1', 'type2' ],
		 *   'clubs': [
		 *		{	'clubName': 'club',
		 *			'clubType': 'type1',
		 *			'clubDescription': 'desc1',
		 *			'channels': [
		 *				{
		 *					id: <Snowflake for channel>,
		 *					name: channel.toString
		 *				},
		 *			]
		 *		}
		 *	  ]
		 *	}
		 */
		if (!(this.data.clubTypes && this.data.clubs)) {
			logger.info('no data in datafile, initializing to empty');
			this.data = { 'clubTypes': [], 'clubs': [] };
		}
	}

	// clubToString(club) : Helper : Stringify a club/channels for display {{{
	clubToString(club) {
		let string = `Club \`${club.clubName}\`: ${club.description}\n`;
		const channels = club.channels.map(channel => channelMention(channel.id)).join(', ');
		string += `> channels: ${channels}\n`;
		return string;
	}
	// }}}
	// has(clubName) : Helper : Does this club exist? {{{
	has(clubName) {
		return this.data.clubs.some(club => { logger.info(`comparing ${club.clubName} to ${clubName}`); return club.clubName === clubName });
	}
	// }}}
	// sort() : Helper : Sort the clubs {{{
	sort() {
		this.data.clubs.sort((a, b) => { a.clubName < b.clubName ? -1 : a.clubName > b.clubName ? 1 : 0 });
	}
	// }}}
	// toString() : Helper : Convert the full list of clubs to a string {{{
	toString() {
		if (this.data.clubs.length > 0) {
			return this.data.clubs.map(club => {
				return ` -  ${club.clubName}`;
			}).join('\n');
		} else {
			return ' - none yet';
		}
	}
	// }}}
	// write() : Helper : Write club data out to the data file {{{
	write() {
		console.log(process.cwd());
		fs.writeFile(
			this.fileName,
			JSON.stringify(this.data),
			function(err) { if (err) { logger.error(err) } },
		);
	}
	// }}}

	// addUser(clubName, user) : User : Handle user request to join a club {{{
	addUser(clubName, user) {
		const club = this.data.clubs.find(c => { c.clubName === clubName });
		const role = user.guild.roles.cache.find(r => { r.name === clubName });

		if (!club) {
			logger.info(`${clubName} doesn't exist`);
			return false;
		}

		if (user.roles.cache.has(role.id)) {
			// User is already a member of this role
			logger.info(`user '${user}' is already a member of club '${clubName}'`);
			console.log('\n');
			console.log(user.roles.cache);
			return true;
		}

		user.roles.add(role).catch(logger.error);
		return true;
	}
	// }}}
	// removeUser(clubName, user) : User : Handle user request to leave a club {{{
	removeUser(clubName, user) {
		const club = this.data.clubs.find(c => { c.clubName === clubName });
		const role = user.guild.roles.cache.find(r => { r.name === clubName });

		if (!club) {
			logger.info(`${clubName} doesn't exist`);
			return false;
		}

		if (!user.roles.cache.has(role.id)) {
			// User is not already a member of this role
			logger.info(`user '${user}' is not already a member of club '${clubName}'`);
			console.log('\n');
			console.log(user.roles.cache);
			return true;
		}

		user.roles.remove(role).catch(logger.error);
		return true;
	}
	// }}}

	// list(interation) : Admin : List all the clubs, and the channels provided {{{
	list(interaction) {
		// const gChannels = interaction.guild.channels;
		let reply = '';
		if (this.data.clubs.length > 0) {
			reply = '**List of Clubs**\n\n' + this.data.clubs.map(this.clubToString).join('\n');
		} else {
			reply = ':cry: There are no clubs defined...';
		}
		interaction.reply({ 'content': reply, 'ephemeral': true });
	}
	// }}}
	// addClub(interaction, clubName, clubDescription, clubChannel) : Admin : Create a new club definition {{{
	addClub(interaction, clubName, clubDescription, clubChannel) {
		const reply = { 'ephemeral': true };
		/*
		console.log('\n');
		console.log(clubName);
		console.log(clubDescription);
		console.log('---');
		console.log(clubChannel);
		console.log('---');
		*/
		if (!this.has(clubName)) {
			const newClub = { 'clubName': clubName, 'clubType': null, 'description': clubDescription, 'channels': [] };
			if (clubChannel) {
				newClub.channels.push({ 'id': clubChannel.id, 'name': clubChannel.toString() });
			}
			this.data.clubs.push(newClub);
			this.sort();
			this.write();
			reply.content = `Club ${clubName} added internally, discord settings unchanged.`;
		} else {
			reply.content = `Club ${clubName} already exists`;
		}
		interaction.reply(reply);
	}
	// }}}
	// removeClub(interaction, clubName) : Admin : Remove a club definition {{{
	removeClub(interaction, clubName) {
		const reply = { 'ephemeral': true };
		if (this.has(clubName)) {
			this.data.clubs = this.data.clubs.filter(club => { club.clubName !== clubName });
			this.write();
			reply.content = `Club ${clubName} removed internally, discord settings unchanged.`;
		} else {
			reply.content = `Club ${clubName} doesn't exist`;
		}
		interaction.reply(reply);
	}
	// }}}

	addChannel(interaction, clubName, clubChannel) {
		interaction.reply('Add channel requested, not implemented');
		// reply.content = `Channel ${clubChannel} wasn't assigned to club '${clubName}'`;
	}

	removeChannel(interaction, clubName, clubChannel) {
		interaction.reply('Remove channel requested, not implemented');
	}

}

module.exports = Clubs;
