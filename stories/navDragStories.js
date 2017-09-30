import React from 'react';
import { storiesOf } from '@storybook/react';
import NavDrag from 'components/NavDrag/NavDrag';
import { generateHash } from 'utilities';
const onChange = (newArray) => {
	console.log(newArray);
};

// const initialList = [1, 2, 3, { title: 'cat', children: [4, 5]}, 6, { title: 'dog', children: [7, 8]},];

const collections = [
	{
		id: 'a7438356-5ea6-42a9-b9c4-dfa7cd0b5a6e',
		title: 'Framework',
		description: 'Quaerat ab aut qui dolores ipsam velit. Provident voluptas sint ipsam voluptates nulla tempore ut corporis impedit. Vel eaque cupiditate sequi temporibus optio quia est iusto culpa. Cumque dolor quia qui ut. Consequatur at eum ut debitis incidunt possimus pariatur.',
		slug: 'framework6651',
		isPage: true,
		isPublic: true,
	},
	{
		id: '8d9c4f4d-3a2c-4959-85e8-2406296b93cc',
		title: 'Moderator',
		description: 'Sequi dolores et fuga qui. Sunt illum earum eius sequi et deserunt. Est in dolorem et cum eos sit non. Porro molestiae voluptas. Rerum rem dolores minima omnis.',
		slug: 'moderator8690',
		isPage: true,
		isPublic: true,
	},
	{
		id: '2503f946-a599-48dc-8ca1-0aec9594fc42',
		title: 'Core',
		description: 'Iusto rerum numquam quidem omnis omnis eum. Provident aut recusandae consectetur tempore eaque corporis. Laudantium omnis adipisci laborum enim itaque est quod. Est fuga veniam aliquid. Nostrum cum repudiandae tenetur unde in. Sit quae corporis atque quis aut sed.',
		slug: 'core2509',
		isPage: true,
		isPublic: false,
	},
	{
		id: 'b15ae124-5cde-4009-9a0e-393735f3ac5b',
		title: 'Migration',
		description: 'Necessitatibus maiores ipsam qui aperiam eveniet. Ut molestiae eveniet. Cumque quia voluptatum neque ut consequatur.',
		slug: 'migration3555',
		isPage: true,
		isPublic: true,
	},
	{
		id: 'c22fdfa5-7afb-4ec9-b31d-2f828319dc80',
		title: 'Home',
		description: 'nnNon sit id ut eum modi aut voluptatem. Quia ut sed aut quae aut enim sunt. Quae facilis repudiandae quia. Veritatis doloremque hic sapiensate.',
		slug: '',
		isPage: false,
		isPublic: true,
	},
	{
		id: 'a4bd81ab-3a23-479a-8680-4c1d1f587d08',
		title: 'Database!',
		description: 'ccusamus et ducimus quibusdam. Doloribus qui sint nam ab ut quia aperiam ipsa in. Veritatis ad rerum ipsam. Vero et vel non consectetur porro praesentium.',
		slug: 'database',
		isPage: false,
		isPublic: true,
	},
	{
		id: '2a75aeff-9de5-430c-8f5f-d12a8082f67d',
		title: 'Algorithmm',
		description: 'Nobis inventore non. Iste placeat dolorem quibusdam repellat fugiat et et. Voluptatem sed in ipsa sed tempore explicabo labore praesentium molestiae. Voluptas libero eius. Exercitationem nulla facere placeat culpa distinctio laboriosam molestiae ut non. Architecto quos iure et cumque non porro ad.',
		slug: 'algorithm97059',
		isPage: false,
		isPublic: false,
	},
	{
		id: 'a3741ece-a6d1-4989-825e-7556e485ac74',
		title: 'Internet solution!',
		description: 'QRqui officiis enim repudiandae. Sit ducimus quo ratione reprehenderit. Sint repellat eveniet ad et dolore sunt omnis et dignissimos. Sunt eveniet sequi molestias id ducimus. Ut consequatur laboriosam laboriosam non.',
		slug: 'internet-solution93',
		isPage: false,
		isPublic: true,
	},
	{
		id: 'b9d1fd05-205e-4bc6-b253-082948aca46d',
		title: 'Empty Collection',
		description: 'This is a description',
		slug: 'empty',
		isPage: false,
		isPublic: false,
	},
	{
		id: '4d207916-4ab0-40c4-b884-9fe07aec13d3',
		title: 'Redirect Collection',
		description: '',
		slug: 'redirect-col',
		isPage: false,
		isPublic: false,
	}
];
const initialNav = [
	{
		id: 'c22fdfa5-7afb-4ec9-b31d-2f828319dc80',
		title: 'Home',
		description: 'nnNon sit id ut eum modi aut voluptatem. Quia ut sed aut quae aut enim sunt. Quae facilis repudiandae quia. Veritatis doloremque hic sapiensate.',
		slug: '',
		isPage: false,
		isPublic: true,
		isOpenSubmissions: true,
		communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
		createdAt: '2017-09-26T16:26:00.457Z',
		updatedAt: '2017-09-27T23:36:29.034Z'
	},
	{
		title: 'success',
		id: generateHash(8),
		children: [
			{
				id: '2a75aeff-9de5-430c-8f5f-d12a8082f67d',
				title: 'Algorithmm',
				description: 'Nobis inventore non. Iste placeat dolorem quibusdam repellat fugiat et et. Voluptatem sed in ipsa sed tempore explicabo labore praesentium molestiae. Voluptas libero eius. Exercitationem nulla facere placeat culpa distinctio laboriosam molestiae ut non. Architecto quos iure et cumque non porro ad.',
				slug: 'algorithm97059',
				isPage: false,
				isPublic: false,
				isOpenSubmissions: true,
				communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
				createdAt: '2017-09-26T16:26:00.457Z',
				updatedAt: '2017-09-27T23:43:44.221Z'
			},
			{
				id: 'b9d1fd05-205e-4bc6-b253-082948aca46d',
				title: 'Empty Collection',
				description: 'This is a description',
				slug: 'empty',
				isPage: false,
				isPublic: false,
			},
			{
				id: '4d207916-4ab0-40c4-b884-9fe07aec13d3',
				title: 'Redirect Collection',
				description: '',
				slug: 'redirect-col',
				isPage: false,
				isPublic: false,
			}
		]
	},
	{
		title: 'knowledge base',
		id: generateHash(8),
		children: [
			{
				id: 'a7438356-5ea6-42a9-b9c4-dfa7cd0b5a6e',
				title: 'Framework',
				description: 'Quaerat ab aut qui dolores ipsam velit. Provident voluptas sint ipsam voluptates nulla tempore ut corporis impedit. Vel eaque cupiditate sequi temporibus optio quia est iusto culpa. Cumque dolor quia qui ut. Consequatur at eum ut debitis incidunt possimus pariatur.',
				slug: 'framework6651',
				isPage: true,
				isPublic: true,
				isOpenSubmissions: false,
				communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
				createdAt: '2017-09-26T16:26:00.457Z',
				updatedAt: '2017-09-26T16:26:00.457Z'
			}
		]
	},
	{
		id: '8d9c4f4d-3a2c-4959-85e8-2406296b93cc',
		title: 'Moderator',
		description: 'Sequi dolores et fuga qui. Sunt illum earum eius sequi et deserunt. Est in dolorem et cum eos sit non. Porro molestiae voluptas. Rerum rem dolores minima omnis.',
		slug: 'moderator8690',
		isPage: true,
		isPublic: true,
		isOpenSubmissions: true,
		communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
		createdAt: '2017-09-26T16:26:00.457Z',
		updatedAt: '2017-09-26T16:26:00.457Z'
	},
	{
		title: 'architecture',
		id: generateHash(8),
		children: [
			{
				id: 'a3741ece-a6d1-4989-825e-7556e485ac74',
				title: 'Internet solution!',
				description: 'QRqui officiis enim repudiandae. Sit ducimus quo ratione reprehenderit. Sint repellat eveniet ad et dolore sunt omnis et dignissimos. Sunt eveniet sequi molestias id ducimus. Ut consequatur laboriosam laboriosam non.',
				slug: 'internet-solution93',
				isPage: false,
				isPublic: true,
				isOpenSubmissions: true,
				communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
				createdAt: '2017-09-26T16:26:00.457Z',
				updatedAt: '2017-09-27T23:34:59.631Z'
			}
		]
	},
	{
		id: 'a4bd81ab-3a23-479a-8680-4c1d1f587d08',
		title: 'Database!',
		description: 'ccusamus et ducimus quibusdam. Doloribus qui sint nam ab ut quia aperiam ipsa in. Veritatis ad rerum ipsam. Vero et vel non consectetur porro praesentium.',
		slug: 'database',
		isPage: false,
		isPublic: true,
		isOpenSubmissions: false,
		communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
		createdAt: '2017-09-26T16:26:00.457Z',
		updatedAt: '2017-09-27T23:47:40.431Z'
	},
	{
		id: '2503f946-a599-48dc-8ca1-0aec9594fc42',
		title: 'Core',
		description: 'Iusto rerum numquam quidem omnis omnis eum. Provident aut recusandae consectetur tempore eaque corporis. Laudantium omnis adipisci laborum enim itaque est quod. Est fuga veniam aliquid. Nostrum cum repudiandae tenetur unde in. Sit quae corporis atque quis aut sed.',
		slug: 'core2509',
		isPage: true,
		isPublic: false,
		isOpenSubmissions: true,
		communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
		createdAt: '2017-09-26T16:26:00.457Z',
		updatedAt: '2017-09-26T16:26:00.457Z'
	},
	{
		id: 'b15ae124-5cde-4009-9a0e-393735f3ac5b',
		title: 'Migration',
		description: 'Necessitatibus maiores ipsam qui aperiam eveniet. Ut molestiae eveniet. Cumque quia voluptatum neque ut consequatur.',
		slug: 'migration3555',
		isPage: true,
		isPublic: true,
		isOpenSubmissions: true,
		communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
		createdAt: '2017-09-26T16:26:00.457Z',
		updatedAt: '2017-09-26T16:26:00.457Z'
	},
	{
		id: 'b9d1fd05-205e-4bc6-b253-082948aca46d',
		title: 'Empty Collection',
		description: 'This is a description',
		slug: 'empty',
		isPage: false,
		isPublic: false,
		isOpenSubmissions: false,
		communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
		createdAt: '2017-09-28T00:43:42.195Z',
		updatedAt: '2017-09-28T00:43:54.100Z'
	},
	{
		id: '4d207916-4ab0-40c4-b884-9fe07aec13d3',
		title: 'Redirect Collection',
		description: '',
		slug: 'redirect-col',
		isPage: false,
		isPublic: false,
		isOpenSubmissions: false,
		communityId: 'e4db66ce-d995-4fce-a943-86b7c229ca39',
		createdAt: '2017-09-28T00:48:01.659Z',
		updatedAt: '2017-09-28T00:48:01.659Z'
	}
];

storiesOf('NavDrag', module)
.add('Default', () => (
	<div>
		<NavDrag
			initialNav={initialNav}
			collections={collections}
			onChange={onChange}
		/>
	</div>
));
