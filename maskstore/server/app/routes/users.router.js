'use strict';

var express = require('express');
var router = express.Router();
var Users = require('../../db/models/user')

// get all users
router.get('/', function(req, res) {
	Users.find({})
		.then(function(users){
		res.status('200').json(users);
	})
	.catch(function(err){
		console.log("Error getting users: "+err);
	})	
});

// get a user by ID
router.get('/:userId', function(req, res){
	Users.findOne({_id: req.params.userId}).then(function(user){
		res.status('200').json(user);
	})
	.catch(function(err){
		console.log('Error getting user: '+err);
	});
});

// create a new user
router.post('/', function(req, res) {
	new Users(req.body).save(function(err, newUser){
		if (err) return res.status('500').send('Error creating user: '+err);
		res.status('200').json(newUser);
	});
});

// update a user by userId
router.put('/:userId', function(req, res) {
	Users.findOneAndUpdate({_id: req.params.userId}, 
		{$set: req.body},
		{new: true})
	.then(function(updatedUser){
		res.status('200').json(updatedUser);
	})
	.catch(function(err){
		console.log("Error updating user: "+err);
	})
});

// delete a user by userId. THIS ROUTE SHOULD ONLY BE ACCESSIBLE FOR THE USER THEMSELVES -- THEY SHOULD NOT BE ABLE TO DELETE OTHER ACCOUNTS.
router.delete('/:userId', function(req, res) {
	Users.findOne({_id: req.params.userId}).then(function(user){
		console.log('Deleting user: '+user);
		user.remove();
		res.status('200').send('Successfully deleted user');
	})
	.catch(function(err){
		console.log("Error removing user: "+err);
	});
});

//get a cart by userId. If no cart exists, create one!
router.get('/:userId/cart', function(req, res){
	Users.findOne({_id: req.params.userId}).then(function(user){
		console.log(user);
		if (!user.cart){
			user.cart = {
                    masks: [],
                    userid: req.params.userId,
                    subtotal: 0,
                    quantity: 0
                }
		}
		res.json(user.cart);
	})
})

//update a cart by userId
router.put('/:userId/cart', function(req, res){
	Users.findOneAndUpdate({_id: req.params.userId},
		{$set: {cart: req.body}},
		{new: true})
		.then(function(user){
			res.json(user.cart);
		});
});


//ADMIN ROUTES -- PUT INTO A SEPARATE ROUTER AND SECURE
router.put('/passwordReset/:userId', function(req, res){
	Users.findOne({_id: req.params.userId}).then(function(user){
		user.togglePasswordReset();
		user.save();
		res.json(user);
	});
});

router.put('/setNewPassword/:userId', function(req, res){
	var newPassword = req.params.newPassword;
	Users.findOne({_id: req.params.userId}).then(function(user){
		user.updatePassword(newPassword);
		user.togglePasswordReset();
		user.save();
		res.json(user);
	})
})

router.put('/:userId/admin', function(req, res){
	Users.findOne({_id: req.params.userId}).then(function(user){
		user.toggleAdmin();
		user.save();
		res.json(user);
	});
});

module.exports = router;