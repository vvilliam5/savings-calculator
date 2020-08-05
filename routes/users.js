var express = require('express');
var router = express.Router();
const userModel = require('../models/users');

//fetch the document with the id
router.param('id', userModel.paramsID);
//route to get list of all users
router.get('/', userModel.getUsers)
//route to get list of all internal users
router.get('/int', userModel.getInternalUsers)
//route to get list of all external users
router.get('/ext', userModel.getExternalUsers)
// route to a add noew user
router.post('/', userModel.createUser)
//route to sign up
// router.post('/signup', userModel.signUp)
//route to log in
router.post('/login', userModel.logIn);
//route to view user by id
router.get('/:id', userModel.getUserById)
// //route to delete user
router.delete('/:id', userModel.deleteUser)
//route to update a user
router.put('/:id', userModel.updateUser)

module.exports = router;