var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../models').User;

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
    let product = user.product
    let fullName = user.fullName
    let phoneNumber = user.phoneNumber
    let role = user.role
    let supplier = user.supplier
    let location = user.location
    let rating = user.rating
    let createdAt = user.createdAt
    let userData = { _id, product, fullName, phoneNumber, role, supplier, location, rating, createdAt }
    res.status(201).json({ 'status': 'success', 'data': userData });
}

const createUser = async (req, res, next) => {
    let user = new Users(req.body);
    // user.fullName = user.fullName.toLowerCase();
    await bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err)
        }
        user.password = hash
        user.save((err, user) => {
            if (err) return next(err)
            res.status(201).json({ 'status': 'success', 'data': user });
        })
    });
}

const signUp = (req, res, next) => {
    let user = new Users(req.body);
    user.save((err, user) => {
        if (err) return next(err)
        res.status(201).json({ 'status': 'success', 'data': user });
    })
}

const logIn = (req, res, next) => {
    let phoneNumber = req.body.phoneNumber;
    let password = req.body.password;
    Users.find({ phoneNumber }, null, (err, user) => {
        if (err) return next(err)
        if (user[0]) {
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (err) {
                    return res.status(401).json({ 'status': 'error', 'message': 'Phone Number / Password is incorrect' });
                }
                if (result) {
                    // if (user[0].role === 'admin') {
                    const token = jwt.sign({
                        id: user[0]._id,
                        fullName: user[0].fullName,
                        phoneNumber: user[0].phoneNumber,
                        role: user[0].role
                    }, process.env.JWT_ADMIN_KEY);
                    return res.status(201).json({ 'status': 'success', 'data': token });
                    // }
                } else {
                    return res.status(401).json({ 'status': 'error', 'message': 'Phone Number / Password is incorrect' });
                }
            });
        } else {
            return res.status(401).json({ 'status': 'error', 'message': 'Phone Number / Password is incorrect' });
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