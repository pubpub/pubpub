import { User, Integration } from 'server/models';

export default async (userId) => {
	const user = await User.findOne({
		where: { id: userId },
		include: { model: Integration, required: false },
	});
	return user.toJSON().integrations;
};
