export const navItems = [
	{
		slug: '/',
		title: 'Home',
		id: 1,
	},
	{
		slug: '/sensors',
		title: 'Sensors',
		id: 2,
	},
	{
		id: 3.5,
		title: 'Issues',
		children: [
			{
				slug: '/2017',
				title: '2017',
				id: 21,
			},
			{
				slug: '/2016',
				title: '2016',
				id: 22,
			},
			{
				slug: '/2018',
				title: 'Super Long 2018 Edition Extravaganza',
				id: 23,
			},
		]
	},
	{
		slug: '/meeting-notes',
		title: 'Meeting-Notes',
		id: 3,
	},
	{
		slug: '/blockchain',
		title: 'Blockchain',
		id: 4,
	},
	{
		slug: '/new-ideas',
		title: 'New Ideas',
		id: 5,
	},
	{
		slug: '/bad-ideas',
		title: 'Bad-Ideas',
		id: 6,
	},
	{
		slug: '/submissions',
		title: 'Submissions',
		id: 7,
	},
	{
		slug: '/about',
		title: 'About',
		id: 8,
	},
];

export const accentDataDark = {
	accentColor: '#D13232',
	accentTextColor: '#FFF',
	accentActionColor: '#A72828',
	accentHoverColor: '#BC2D2D',
	accentMinimalColor: 'rgba(209, 50, 50, 0.15)',
};

export const accentDataLight = {
	accentColor: '#26E0D0',
	accentTextColor: '#000',
	accentActionColor: '#51E6D9',
	accentHoverColor: '#3BE3D4',
	accentMinimalColor: 'rgba(38, 224, 208, 0.15)',
};
