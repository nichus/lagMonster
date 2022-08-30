const { EmbedBuilder } = require('discord.js');

let interaction_iterations = 0;
const interactions = [
	[
		new RegExp(/(ask jake|ask ripper|Baby Yoda|eat shit|I have spoken|I just buy what he says|I just buy what jake says|I just buy what ripper says|jake knows|jake probably knows|jake would know|like jake said|like ripper said|Mando|Nick Nolte|ripper knows|ripper probably knows|ripper would know|what jake said|what jake says|what ripper said|what ripper says)/i),
		{ 'image': 'https://photos.app.goo.gl/SbVV9Mex7bKxFJ8U6' },
	],
	[
		new RegExp(/(bad shandor|shandork|shandor is wrong|shandor you are wrong|you are wrong shandor|#neverforget|12\/13|shandor is a troll|9-11|9\/11|nine eleven|never forget|12-13|12\/13\/2019|9 11|dum dum|learn the rules|totally forgot|always forget)/i),
		{ 'title': 'NEVER FORGET', 'image': 'https://lh3.googleusercontent.com/pw/AL9nZEV4txULfG-c6vjw0Md903fivHwV1nO7a62d2ZdOO9kYPnWTZEvqyJ-1G6gZshht8D1hwU9jYB01dyNRA78EafBTBZ4s2RiIfS7T3bFg5ZUtnME1vBjcsUg3SLxja8Aud7K5FSaJMqF4rKo7FZChch1u=w800-h1200-no?.jpg' },
	],
	[
		new RegExp(/\bfool\b/i),
		{ 'title': 'You Fool!', 'description': 'you fool. you absolute buffoon. you think you can challenge me in my own realm? you think you can rebel against my authority? you dare come into my house and upturn my dining chairs and spill coffee grounds in my Keurig? you thought you were safe in your chain mail armor behind that screen of yours. I will take these laminate wood floor boards and destroy you. I didn’t want war. but i didn’t start it.' },
	],
	[
		new RegExp(/almost died/i),
		{ 'title': 'I almost died!', 'image': 'https://memegenerator.net/img/instances/500x/43239386/i-almost-died.jpg' },
	],
	[
		new RegExp(/bsod|blue screen of death|blue screen|bsod'd|epic fail/i),
		{ 'title': 'Epic Fail', 'image': 'https://lh3.googleusercontent.com/pw/AL9nZEVGqke0Qu68CxmyHP_MKlmWR9GlHGnmjOf2_19p91SVyDcKn0YFDLcO93pyVH53OuRf0MnQgGVayYrqLSlvQRtkphoy8eWywzn96UOYmbms49XoK-v_epyvbQbg1nsEc5gWAWJGRyENQexEtVACFFA=w674-h447-no?.jpg' },
	],
	[
		new RegExp(/\b(?:EA|Electronic Arts|Origin|E\.A\.)\b/i),
		{
			'title': [ 'Fuck EA!', 'EA Sucks!', 'EA can eat a dick :eggplant:' ],
			'image': [
				'https://lh3.googleusercontent.com/pw/AL9nZEUHWr9KGN9PSguu5btcIlgoduTLhet7lY4ZzUo-z0fQy2N-Asc63u4fJv41vHidbHhMynP83BZn2L_sSVYJtz37-oMgTbflo_mRl4QnqtBTU5JTxGO1D4tR1vr7akR-_-pCbLjPKNfvBBOY8pZFvgI=w224-h225-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEUZHtc7FScTsQ7g-YoPLdvlN3W9su8LJA2DHEYpYLYOZsvSp7oxsUvWBfNPDq3ugsupclhaGM7jBhsk8KcPPziJSx_4mj_Xo-bY7PzNX7VLjGK-ZhYzCjYY1fFDUT-N5CUQpCdvx2-VYtixEhbJCMY=w256-h197-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEUIsyb9GJPBAgfN-F8Q_Oqu3oijkfQ2T_Bs-LC9i7CQ3s0EcmjTrPwT_scsRBDpR4e1KZ-UFDvciTBBTzcYQSyfxTO_CvzMR_FulQwKdLlQFVP1vigQ91FoLGZUYePvSfdCr-FPIk30a7mZaORXxag=w299-h168-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEVHcNfxTJa_j-iDN7B38cwX0ELazNUg3FhVMOlP8AnZpEQx6gady7-XVareUSdN8NLvk8V--Az7YrSCA5t5RUCvMbyzUAAyH3r7I0ydI9m0bxokDsn5uEnOfygVRUzmYDGYvOp15tu4NQC356zUR6w=w780-h175-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEVIQwrz3b-aK817FE7VPUmFq-vE1DiJw7MbTiaA7lQqlQdVj6mpP3BrDx8ifT8aX03GJl1iNkTYgnCkGqkZCpjHkxfd3CgCD-yO5_p4RwPM7MHCAlFJWc_4t9AAOlY2hPiCXmI4Kx6Wb9zxmlEwA08=w256-h197-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEVxZZ3oyta5widTKtdrIczGAHaoV5JfDC0R_ga4fGFD7Og9hHfHF8Vn8OwiKkV_tl2QKh-vD1Hqv346vxSRyf5AIsFWaO_sXg9TY-voR_cGNpFSONNbPyn3JdRq9E0MvWBt9r-J_PwGDzOZGVoIiO0=w500-h327-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEX-MeygoICrSe3R_zi8_niUUUoauzfmAcOqVKhx-8P14x-D5yDKpd8v7ZkvvyHYPZT2luvs_an200ysIiY7BZ4mj-nOyCw9Ay8If2gzwcH_XbNGgbaaJR0opyJCbLHflCKqFYH_x12QZQUVtZuZ-MU=w805-h410-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEV5kF-fhG9oEYbOtef-LFJBiDmNwhZpjmQN-tQ9XbpDDzJjrg4hqQXwa2jHTnuWRxnxXl5Vu4ueA-LWQfAOeyzAzlB6Z1J3s_nP_44y1fBEgpJQHG1xDOLAMVIBHdVwRmVmkCXnQhJQz3oq47F_t3A=w625-h635-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEWzf2rV07mhTbCAprqSqUL8d-NKu5Io3EyPytVBOxsP74-RX_P0eupRGeH52qO4qAyUvuSWhe9cKB6h6mDLD0rYgxtbbfWhYCQHExxZ_1dXwQs27mDBLgBbcINf7aBdV1W4sTAH8YxPnvgb1mt6uJVC=w324-h156-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEU21HcO7MYKWwyTbvSYyjQQFLdhGCKsNFw73zKINFhXB0H_RNkPmAq1uchlnzgKoCDVd8t2ZoXqqKxd27YOVAsQilMqtBC6RZBwV1uZdUyRKYMWsjuBX1_IJI5CYd1yIiE2YHLayBja5o31WiiC1JaO=w300-h168-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEXZ3YMpwQh3sZfBP_tM0IEEeYyvggr3RMHBI3-duGCQsIwlwX1CbJdaVPxsrgbdH1xWoINez8PqPiyM9E1TTYiRQoz17qTqxj1LT1btiLWjmDTofstRzS2tvw73UNkQssBKr_WvXbhz0ObK_7uaNHR0=s680-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEXJCxwahyBEjp-fOzrlIVyuGtFqoAMOvyXNN7GR-NHSWOc0bdHF5YGyiqgpyRUctGoRA1kWNOzxIBzoyOqHQah9E3CRn_X4QB2ImTeo8YzAEBhJrgFCUgG0ID2cyMSYa3nMYHRi7HX7AMPvIqMVU-JZ=w480-h360-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEXv3Qt7xTx_qMeXIzDwaqFpn7HPh2viRm7DhkQsmbw30BVS_SKd7AB3g_TWOKKP0ZzLqOSIT1CLDnYzVziatAAADUlbdFBgsCBPGGPnOPMpYUWRJml9fUfhmChQFwqgbSEskPKk2WnZgA7xTvnHnyyO=w650-h364-no?.jpg',
				'https://lh3.googleusercontent.com/pw/AL9nZEUcQ65-fQm8g5b7npvEGrBGNnwA-F_z_jjqg2VgLmahka3lPmtbtGSoVFAu8sAnGV79weHlEtpSB2QSomcapmrdB-MwTpjn8jJQI5f42GKGRa3QFXYnufsyY4j8c6lfrP6mNkiYKuz67k0KvLGbzkSi=w720-h628-no?.jpg',
			],
		},
	],
	[
		new RegExp(/bakhara nda/i),
		{ 'title': 'Bakharian NDA', 'url': 'https://bakhara.org/nda', 'description': 'To participate in this room, you **MUST READ AND AGREE** to the above NDA.' },
	],
	[
		new RegExp(/dave point security/i),
		{ 'title': 'I have that mug', 'description': '-- <@84756276248051712>', 'image': 'https://lh3.googleusercontent.com/pw/AL9nZEU2YZ8JxC8qdsfqRL0-Is4iRmQn6UeMD8UxdPzXlTB0hjhkK_GrHoIuh5ZCYIgVYSUTm7CEI_0kwJirueJ2OxbOi_8fvFUedNTdodi-v5_3Z6VQxZlk1Zk21VbE0fjFf9Am3EqO11EC9SQTmfDimxW1=s500-no?.jpg' },
	],
];

function pickOne(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function pickField(field, value) {
	if (value in field) {
		if (Array.isArray(field[value])) {
			return pickOne(field[value]);
		} else if (typeof field[value] === 'string') {
			return field[value];
		} else {
			// console.log(`Can't interact with a ${typeof fieldValue} type element.`);
			// console.log(found);
		}
	}
	return false;
}

function interact(message) {
	interaction_iterations = interaction_iterations++ % 389;
	if (interaction_iterations == 0) {
		interactions.sort(() => { Math.floor(Math.random() * 3) - 1 });
	}

	const found = interactions.find(e => { return message.content.match(e[0]) });
	if (!found) {
		return;
	}

	const response = new EmbedBuilder()
		.setColor(0x93e9be);

	const title = pickField(found[1], 'title');
	if (title) {
		response.setTitle(title);
	}

	const image = pickField(found[1], 'image');
	if (image) {
		response.setImage(image);
	}

	const url = pickField(found[1], 'url');
	if (url) {
		response.setURL(url);
	}

	if ('description' in found[1]) {
		response.setDescription(found[1]['description']);
	}

	/*
  console.log(title);
  console.log(image);

  console.log(response);
  */

	message.reply({ embeds: [response] });
}

exports.interact = interact;
