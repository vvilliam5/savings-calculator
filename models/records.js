var express = require('express');
var router = express.Router();
const Records = require('../models').Record;

const paramsEmail = (req, res, next, email) => {
    Records.find({ userEmail: email }, (err, doc) => {
        if (err) return next(err);
        if (!doc) {
            err = new Error('Not found');
            err.status = 404;
            return next(err)
        }
        req.userRecords = doc;
        return next();
    });
}

const getUserRecords = (req, res) => {
    res.status(200).json({ 'status': 'success', 'data': req.userRecords });
}

const getUserRecordByType = (req, res) => {
    let userRecords = req.userRecords;
    let filteredRecords = userRecords.filter((record) => record.type == req.params.recordType);
    //check if record is returned, if not return 204 no content
    if (filteredRecords) {
        res.status(200).json({ 'status': 'success', 'data': filteredRecords })
    }
    else {
        res.status(204).json({ 'status': 'success', 'data': filteredRecords })
    }
}

const getUserRecordByMonth = (req, res) => {
    let userRecords = req.userRecords;
    let filteredRecords = userRecords.filter((record) => record.month == req.params.month);
    //check if record is returned, if not return 204 no content
    if (filteredRecords) {
        res.status(200).json({ 'status': 'success', 'data': filteredRecords })
    }
    else {
        res.status(204).json({ 'status': 'success', 'data': filteredRecords })
    }
}

const getRecords = (req, res, next) => {
    Records.find({}, null, (err, records) => {
        if (err) return next(err)
        res.status(200).json({ 'status': 'success', 'data': records });
    })
}

// const getRecordById = (req, res) => {
//     res.status(201).json({ 'status': 'success', 'data': req.record });
// }

const createRecord = (req, res, next) => {
    let record = new Records(req.body);
    record.save((err, user) => {
        if (err) return next(err)
        res.status(201).json({ 'status': 'success', 'data': record });
    })
}

const deleteRecord = (req, res, next) => {
    req.record.remove((err) => {
        if (err) return next(err);
        return res.status(201).json({ 'status': 'success', 'data': req.record });
    })
}

const updateRecord = (req, res) => {
    Records.findByIdAndUpdate(req.record.id, req.body, { useFindAndModify: false }, (err) => {
        if (err) return next(err);
        return res.status(201).json({ 'status': 'success', 'data': req.record });
    })
}

module.exports = {
    paramsEmail,
    getRecords,
    getUserRecords,
    getUserRecordByType,
    getUserRecordByMonth,
    createRecord,
    deleteRecord,
    updateRecord
}