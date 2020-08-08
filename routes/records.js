var express = require('express');
var router = express.Router();
const recordModel = require('../models/records');

//fetch the document with the id
router.param('email', recordModel.paramsEmail);
//route to get list of all records
router.get('/', recordModel.getRecords)
// route to a add noew record
router.post('/', recordModel.createRecord)
//route to retrieve users entire records
router.get('/:email', recordModel.getUserRecords)
//route to retrieve users records by type
router.get('/:email/type/:recordType', recordModel.getUserRecordByType)
//route to retrieve users records by month
router.get('/:email/month/:month', recordModel.getUserRecordByMonth)

module.exports = router;