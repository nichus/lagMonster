const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('plusplus')
		.setDescription('Report the current plus-plus stats'),
	async execute(interaction) {
		const plusPlusReport = new EmbedBuilder()
			.setColor('#ffd046')
			.setTitle('plus-plus Leaderboard')
			.setDescription('The top twelve users on the plus-plus leaderboard are:');

		const plusplus = require('../../data/plusPlus.json');
		// console.log(plusplus);
		const users = Object.keys(plusplus).map(user => { return [ plusplus[user]['id'], plusplus[user]['score'] ] });
		users.sort((a, b) => { return b[1] - a[1] });
		users.filter(u => u[1] > 0).slice(0, 12).map(user => {
			plusPlusReport.addFields({ name: user[1].toString(), value: `<@${user[0]}>`, inline: true });
		});
		plusPlusReport.setTimestamp()
			.setFooter({ text: 'I\'m always watching' });

		interaction.channel.send({ embeds: [plusPlusReport] });
		interaction.deferReply();
		interaction.deleteReply();
	},
};

