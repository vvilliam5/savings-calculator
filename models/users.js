var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('.').User;

const paramsID = (req, res, next, id) => {
    Users.findById(id, (err, doc) => {
        if (err) return next(err);
        if (!doc) {
            err = new Error('Not found');
            err.status = 404;
            return next(err)
        }
        req.user = doc;
        return next();
    });
}

const getUsers = (req, res, next) => {
    Users.find({}, null, (err, users) => {
        if (err) return next(err)
        res.status(200).json({ 'status': 'success', 'data': users });
    })
}

const getUserById = ({ user }, res) => {
    let _id = user._id
    let fullName = user.fullName
    let email = user.email
    let createdAt = user.createdAt
    let userData = { _id, fullName, email, createdAt }
    res.status(200).json({ 'status': 'success', 'data': userData });
}

const createUser = async (req, res, next) => {
    let user = new Users(req.body);
    Users.findOne({ email: user.email.toLowerCase() }, async (err, userExist) => {
        if (userExist) {
            return res.status(500).json({ 'status': 'error', 'message': 'Email already in user, try another' })
        } else {
            await bcrypt.hash(user.password, 10, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash
                user.email = user.email.toLowerCase()
                user.save((err, user) => {
                    if (err) return next(err)
                    res.status(201).json({ 'status': 'success', 'data': user });
                })
            });
        }
    })
    // user.fullName = user.fullName.toLowerCase();

}

const signUp = (req, res, next) => {
    let user = new Users(req.body);
    user.save((err, user) => {
        if (err) return next(err)
        res.status(201).json({ 'status': 'success', 'data': user });
    })
}

const logIn = (req, res, next) => {
    let email = req.body.email.toLowerCase();
    let password = req.body.password;
    Users.find({ email }, null, (err, user) => {
        if (err) return next(err)
        if (user[0]) {
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (err) {
                    return res.status(401).json({ 'status': 'error', 'message': 'Email / Password is incorrect' });
                }
                if (result) {
                    // if (user[0].role === 'admin') {
                    const token = jwt.sign({
                        id: user[0]._id,
                        fullName: user[0].fullName,
                        email: user[0].email
                    }, process.env.JWT_KEY);
                    return res.status(200).json({ 'status': 'success', 'data': token });
                    // }
                } else {
                    return res.status(401).json({ 'status': 'error', 'message': 'Email / Password is incorrect' });
                }
            });
        } else {
            return res.status(401).json({ 'status': 'error', 'message': 'Email / Password is incorrect' });
        }
    })
}

module.exports = {
    paramsID,
    getUsers,
    getUserById,
    createUser,
    signUp,
    logIn
}