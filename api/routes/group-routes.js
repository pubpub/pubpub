const app = require('../api');
const _ = require('underscore');
// const Pub  = require('../models').Pub;
const User = require('../models').User;
const Group = require('../models').Group;

export function groupCreate(req, res) {
	Group.isUnique(req.body.subdomain, (err, result)=>{
		if (!result) { return res.status(500).json('URL is not Unique!'); }

		const stockBackgrounds = ['linear-gradient(to left, #9D50BB , #6E48AA)', 'linear-gradient(to left, #00d2ff , #3a7bd5)', 'linear-gradient(to left, #C04848 , #480048)', 'linear-gradient(to left, #02AAB0 , #00CDAC)', 'linear-gradient(to left, #fd746c , #ff9068)', 'linear-gradient(to left, #517fa4 , #243949)', 'linear-gradient(to left, #00bf8f , #001510)', 'linear-gradient(to left, #43cea2 , #185a9d)'];
		const group = new Group({
			groupName: req.body.groupName,
			groupSlug: req.body.groupSlug,
			description: '',
			createDate: new Date().getTime(),
			admins: [req.user._id],
			members: [req.user._id],
			pubs: [],
			background: stockBackgrounds[Math.floor(Math.random() * stockBackgrounds.length)],
		});

		group.save(function(errSave, savedGroup) {
			if (errSave) { return res.status(500).json(errSave); }
			User.update({ _id: req.user._id }, { $addToSet: { groups: savedGroup._id} }, function(errUpdate, resultUpdate) {if (errUpdate) return console.log(errUpdate);});

			return res.status(201).json(savedGroup.groupSlug);

		});
	});
}
app.post('/groupCreate', groupCreate);

export function getGroup(req, res) {
	const userID = req.user ? req.user._id : undefined;

	Group.getGroup(req.query.groupSlug, userID, (err, groupData)=>{
		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		return res.status(201).json(groupData);

	});

}
app.get('/getGroup', getGroup);

export function groupSave(req, res) {
	Group.findOne({_id: req.body.groupID}).exec(function(err, group) {

		if (err) { return res.status(500).json(err); }

		if (!req.user || String(group.admins).indexOf(req.user._id) === -1) {
			return res.status(403).json('Not authorized to administrate this Journal.');
		}

		if ('admins' in req.body.newObject) {
			// If there are new admins, we need to handle that user's profile data.
			// So first - first who is new or removed
			const newAdmins = req.body.newObject.admins;
			const oldAdmins = group.admins.map((admin)=>{return String(admin);});

			if (newAdmins.length > oldAdmins.length) {
				// this means we added a new admin - add their membership to their profile
				const newAdmin = _.difference(newAdmins, oldAdmins);
				User.update({ _id: newAdmin[0] }, { $addToSet: { groups: group._id} }, function(errUpdate, result) {if (errUpdate) return console.log(errUpdate);});
				if (String(group.members).indexOf(newAdmin[0]) === -1) {
					group.members.push(newAdmin[0]);
				}

			} else {
				// this means we removed an admin. We don't alter their membership, just remove them from admin list
			}
		}

		if ('members' in req.body.newObject) {
			// If there are new admins, we need to handle that user's profile data.
			// So first - first who is new or removed
			const newMembers = req.body.newObject.members;
			const oldMembers = group.members.map((member)=>{return String(member);});

			if (newMembers.length > oldMembers.length) { // this means we added a new member - add their membership to their profile
				const newMember = _.difference(newMembers, oldMembers);
				User.update({ _id: newMember[0] }, { $addToSet: { groups: group._id} }, function(errUpdate, result) {if (errUpdate) return console.log(errUpdate);});
			} else { // this means we removed an member - remove their membership to their profile and remove them from admin
				const removedMember = _.difference(oldMembers, newMembers);
				User.update({ _id: removedMember[0] }, { $pull: { groups: group._id} }, function(errUpdate, result) {if (errUpdate) return console.log(errUpdate);});
				group.admins = group.admins.filter((user)=>{
					return String(user) !== removedMember[0];
				});
			}
		}

		for (const key in req.body.newObject) {
			if (req.body.newObject.hasOwnProperty(key)) {
				group[key] = req.body.newObject[key];
			}
		}

		group.save(function(errSave, result) {
			if (errSave) { return res.status(500).json(errSave); }

			const options = [
				{path: 'members', select: 'name firstName lastName username thumbnail'},
				{path: 'admins', select: 'name firstName lastName username thumbnail'},
				{
					path: 'pubs',
					select: 'title abstract slug collaborators settings discussions editorComments lastUpdated',
					populate: [
						{
							path: 'authors',
							model: 'User',
							select: 'name firstName lastName username thumbnail',
						},
						{
							path: 'collaborators.canEdit',
							model: 'User',
							select: 'name firstName lastName username thumbnail',
						},
						{
							path: 'discussions',
							model: 'Discussion',
							select: 'markdown author postDate',
							populate: {
								path: 'author',
								model: 'User',
								select: 'name firstName lastName username thumbnail',
							},
						},
						{
							path: 'editorComments',
							model: 'Discussion',
							select: 'markdown author postDate',
							populate: {
								path: 'author',
								model: 'User',
								select: 'name firstName lastName username thumbnail',
							},
						}
					],
				},
			];


			Group.populate(result, options, (errPopulate, populatedGroup)=> {
				return res.status(201).json({
					...populatedGroup.toObject(),
					isAdmin: true,
				});
			});


		});
	});
}
app.post('/groupSave', groupSave);
