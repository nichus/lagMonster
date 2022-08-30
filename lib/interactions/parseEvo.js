const { EmbedBuilder } = require('discord.js');

function parseEvo(message) {
	let image = null;
	if (message.content.match(/evo/i)) {
		if (message.content.match(/evo view/i)) {
			image = 'https://lh3.googleusercontent.com/pw/AL9nZEU2BXPgJpv-0asK4pefcYtp8iBRpYCMwxiqPRSg5KGDB3YojqUwnb72zskhf5iDsftVFOd6lISuEwFRENphJ0Ik2H17G6QvzYzl1BFtOsXZ03W__hmlGgY30CieGyG983r1ZOKn2_mqb0ohbrzskF0D=w1296-h468-no?evo-view.jpg';
		} else if (message.content.match(/evo treyla/i)) {
			image = 'http://voltar.org/evo/evo_treyla.jpg';
		} else if (message.content.match(/evo shandor|EVOshandor/i)) {
			image = 'http://voltar.org/evo/evo_shandor.jpg';
		} else if (message.content.match(/evo ripper/i)) {
			image = 'http://voltar.org/evo/evo_ripper.jpg';
		} else if (message.content.match(/evo pfunk/i)) {
			image = 'http://voltar.org/evo/evo_pfunk.jpg';
		} else if (message.content.match(/evo nichus|evo orien/i)) {
			image = 'http://voltar.org/evo/evo_nichus.jpg';
		} else if (message.content.match(/evo nadya|evo fred/i)) {
			image = 'http://voltar.org/evo/evo_nadya.jpg';
		} else if (message.content.match(/evo mirmillo/i)) {
			image = 'http://voltar.org/evo/evo_mirmillo.jpg';
		} else if (message.content.match(/evo mae/i)) {
			image = 'http://voltar.org/evo/evo_mae.jpg';
		} else if (message.content.match(/evo dorn|evo jettero/i)) {
			image = 'http://voltar.org/evo/evo_dorn.jpg';
		} else if (message.content.match(/evo bojo/i)) {
			image = 'http://voltar.org/evo/evo_bojo.jpg';
		} else {
			const options = [
				'http://voltar.org/evo/evo_bojo.jpg',
				'http://voltar.org/evo/evo_dorn.jpg',
				'http://voltar.org/evo/evo_mae.jpg',
				'http://voltar.org/evo/evo_mirmillo.jpg',
				'http://voltar.org/evo/evo_nadya.jpg',
				'http://voltar.org/evo/evo_nichus.jpg',
				'http://voltar.org/evo/evo_pfunk.jpg',
				'http://voltar.org/evo/evo_ripper.jpg',
				'http://voltar.org/evo/evo_shandor.jpg',
				'http://voltar.org/evo/evo_shandor_irl.jpg',
				'http://voltar.org/evo/evo_treyla.jpg',
				'http://voltar.org/evo/hug-saulted-with-evo-shandor-on-a-trampoline.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEU2BXPgJpv-0asK4pefcYtp8iBRpYCMwxiqPRSg5KGDB3YojqUwnb72zskhf5iDsftVFOd6lISuEwFRENphJ0Ik2H17G6QvzYzl1BFtOsXZ03W__hmlGgY30CieGyG983r1ZOKn2_mqb0ohbrzskF0D=w1296-h468-no?evo-view.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEV4txULfG-c6vjw0Md903fivHwV1nO7a62d2ZdOO9kYPnWTZEvqyJ-1G6gZshht8D1hwU9jYB01dyNRA78EafBTBZ4s2RiIfS7T3bFg5ZUtnME1vBjcsUg3SLxja8Aud7K5FSaJMqF4rKo7FZChch1u=w800-h1200-no?evo-shandor-wrong.jpg',
			];
			image = options[Math.floor(Math.random() * options.length)];
		}
	}
	if (image) {
		const embed = new EmbedBuilder()
			.setTitle('EVO')
			.setColor(0x6667ab)
			.setImage(image);
		message.reply({ 'embeds': [embed] });
	}
}

exports.parseEvo = parseEvo;

