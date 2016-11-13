export const pub = {
	title: 'Environmental Analysis and Ecological Retraction',
	slug: 'myslug',
	id: 1,
	type: 'document',
	contributors: [
		{
			displayAsAuthor: true,
			displayAsContributor: true,
			roles: ['Fisher', 'Writer'],
			permission: 'edit',
			id: 1,
			username: 'travis',
			name: 'Travis Rich',
		},
		{
			displayAsAuthor: true,
			displayAsContributor: true,
			roles: ['Doctor', 'Analysis'],
			permission: 'edit',
			id: 2,
			username: 'mary',
			name: 'Mary Hodgins',
		},
		{
			displayAsAuthor: true,
			displayAsContributor: true,
			roles: ['Fisher', 'Writer'],
			permission: 'edit',
			id: 3,
			username: 'steve',
			name: 'Steve Dartrue',
		},
		{
			displayAsAuthor: false,
			displayAsContributor: true,
			roles: ['Fisher', 'Writer'],
			permission: 'read',
			id: 4,
			username: 'lucy',
			name: 'Lucy Dartrue',
		}
	],
	journals: [],
	versions: [
		{
			id: 12,
			versionMessage: 'First version',
			parentPub: 1,
			public: true,
			files: [
				{
					id: 1,
					type: 'image',
					name: 'myimage.jpg',
					url: 'https://jake.pubpub.org/unsafe/fit-in/650x0/http://res.cloudinary.com/pubpub/image/upload/v1452571000/mdp2nt6ke9ljfq7sqgly.png',
					value: null,
				},
				{
					id: 2,
					type: 'text',
					name: 'main.md',
					url: null,
					value: '# Here is my title \n This is an introductory paragraph \n ![myimage.jpg](myimage.jpg)',
				}
			]
		},
		{
			id: 13,
			versionMessage: 'Hey there',
			parentPub: 1,
			public: false,
			files: [
				{
					id: 1,
					type: 'image',
					name: 'myimage.jpg',
					url: 'https://jake.pubpub.org/unsafe/fit-in/650x0/http://res.cloudinary.com/pubpub/image/upload/v1452571000/mdp2nt6ke9ljfq7sqgly.png',
					value: null,
				},
				{
					id: 2,
					type: 'text',
					name: 'main.md',
					url: null,
					value: '# Here is my second title \n This is an introductory paragraph \n ![myimage.jpg](myimage.jpg)',
				}
			]
		},
		{
			id: 14,
			versionMessage: 'Hey there v2',
			parentPub: 1,
			public: false,
			files: [
				{
					id: 1,
					type: 'image',
					name: 'myimage.jpg',
					url: 'https://jake.pubpub.org/unsafe/fit-in/650x0/http://res.cloudinary.com/pubpub/image/upload/v1452571000/mdp2nt6ke9ljfq7sqgly.png',
					value: null,
				},
				{
					id: 3,
					type: 'image',
					name: 'anotherNewImage.jpg',
					url: 'https://jake.pubpub.org/unsafe/fit-in/650x0/http://res.cloudinary.com/pubpub/image/upload/v1452571000/mdp2nt6ke9ljfq7sqgly.png',
					value: null,
				},
				{
					id: 2,
					type: 'text',
					name: 'main.md',
					url: null,
					value: '# Here is my third title \n This is a brand new introductory paragraph \n ![myimage.jpg](myimage.jpg)',
				}
			]
		},
		{
			id: 29,
			versionMessage: 'an updated version about stuff',
			parentPub: 1,
			public: true,
			files: [
				{
					id: 1,
					type: 'image',
					name: 'myimage.jpg',
					url: 'http://www.livescience.com/images/i/000/036/988/original/elephants.jpg',
					value: null,
				},
				{
					id: 2,
					type: 'text',
					name: 'main.md',
					url: null,
					value: '# Here is my fourth title \n This is an even more updated introductory paragraph \n ![myimage.jpg](myimage.jpg)',
				}
			]
		}
	],
	discussions: [
		{
			id: 1,
			title: 'Creating New Discussions',
			author: 'Travis Rich',
			content: 'Hey, I just wanted to test out this feature',
			parent: null,
		},
		{
			id: 2,
			title: null,
			author: 'Frank Stacey',
			content: 'Neato, I just wanted to reply and say hi',
			parent: 1,
		},
		{
			id: 3,
			title: null,
			author: 'Stacey Frank',
			content: 'Me too! This is rad!',
			parent: 1,
		},
		{
			id: 4,
			title: 'Do your methods actually function?',
			author: 'Meg Keebler',
			content: 'Well well well. I friggin see no methods section',
			parent: null,
		},
		{
			id: 5,
			title: null,
			author: 'Frank Stacey',
			content: 'Neato, I just wanted to reply and say hi',
			parent: 4,
		},
		{
			id: 6,
			title: null,
			author: 'Stacey Frank',
			content: 'Me too! This is rad!',
			parent: 4,
		},
		{
			id: 7,
			title: 'Review from JoDS',
			author: 'Joi Ito',
			content: 'Here is my review: good job.',
			parent: null,
		},
		{
			id: 8,
			title: null,
			author: 'Darren McLoper',
			content: 'Thanks',
			parent: 7,
		},
		{
			id: 9,
			title: 'Funny looking graph',
			author: 'Ashley Murphy',
			content: 'Thanks for putting in that graph. It is funny.',
			parent: null,
		},
	]
};
