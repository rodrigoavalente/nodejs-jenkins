const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const JenkinsSchema = require('./jenkins.schema').schema;

const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    username: String,
    telegram_id: String,
    user_jenkins: [JenkinsSchema]
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    model: UserModel,
    schema: UserSchema
}