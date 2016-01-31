var app = require('../api');

var Pub  = require('../models').Pub;
var User = require('../models').User;
var Group = require('../models').Group;

app.post('/groupCreate', function(req,res){
	Group.isUnique(req.body.subdomain, (err, result)=>{
		if(!result){ return res.status(500).json('URL is not Unique!'); }
		
		const group = new Group({
			groupName: req.body.groupName,
			groupSlug: req.body.groupSlug,
			description: '',
			createDate: new Date().getTime(),
			admins: [req.user._id],
			members: [req.user._id],
			pubs: [],
		});

		group.save(function (err, savedGroup) {
			if (err) { return res.status(500).json(err);  }
			User.update({ _id: req.user._id }, { $addToSet: { groups: savedGroup._id} }, function(err, result){if(err) return handleError(err)});

			return res.status(201).json(savedGroup.groupSlug);	

		});
	});

	
});

app.get('/getGroup', function(req, res) {
	const userID = req.user ? req.user._id : undefined;

	Group.getGroup(req.query.groupSlug, userID, (err, groupData)=>{
		if (err) {
			console.log(err);
			return res.status(500).json(err);
		}

		return res.status(201).json(groupData);

	});

});
