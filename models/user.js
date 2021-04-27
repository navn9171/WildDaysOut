const mongoose = require('mongoose');
const PassportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username : String,
    password : String
});

UserSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);