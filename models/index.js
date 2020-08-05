const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//connect to mongodb
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//get reference to db connection
let db = mongoose.connection;
db.on('error', (err) => {
    console.log('Connection Error: ', err);
})
db.once('open', () => {
    console.log('DB connected successfully');
})
let UsersSchema = new Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    createdAt: Date
});
let RecordsSchema = new Schema({
    userEmail: String,
    month: String,
    year: Number,
    type: String,
    amount: Number,
    createdAt: Date
})
let User = mongoose.model('User', UsersSchema);
let Record = mongoose.model('Tender', RecordsSchema);

module.exports = {
    db,
    User,
    Record
};
