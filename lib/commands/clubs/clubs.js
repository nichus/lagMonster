const logger = require('../../logger.js');

class Clubs {
	constructor() {
		this.data = require('../../../data/clubs.json');
		/* {
		 *   'clubTypes': [ 'type1', 'type2' ],
		 *   'clubs': [
		 *		{	'clubName': 'club',
		 *			'clubType': 'type1',
		 *			'clubDescription': 'desc1',
		 *			'channelIds': [ ]
		 *		}
		 *	  ]
		 *	}
		 */
	}

	has(clubName) {
		return this.data.clubs.some(club => { club.clubName == clubName });
	}

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

	toString() {
		if (this.data.clubs.length > 0) {
			return this.data.clubs.map(club => {
				return ` -  ${club.clubName}`;
			}).join('\n');
		} else {
			return ' - none yet';
		}
	}
}

module.exports = Clubs;
