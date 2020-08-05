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
    phoneNumber: { type: String, unique: true },
    password: String,
    role: String,
    supplier: Boolean,
    product: Array,
    location: String,
    rating: Number,
    createdAt: Date
});
let TenderSchema = new Schema({
    description: String,
    product: String,
    quantity: Number,
    altQuantity: String,
    price: Number,
    createdAt: Date,
    expiresAt: Date,
    userID: String
})
let BidsSchema = new Schema({
    price: Number,
    quantity: Number,
    tenderID: String,
    userID: String,
    createdAt: Date
})
let User = mongoose.model('User', UsersSchema);
let Tender = mongoose.model('Tender', TenderSchema);
let Bid = mongoose.model('Bids', BidsSchema);

module.exports = {
    db,
    User,
    Tender,
    Bid
};
