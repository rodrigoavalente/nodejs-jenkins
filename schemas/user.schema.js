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

UserSchema.methods.list_server_names = function() {    
    return this.user_jenkins.map(jenkins => { return jenkins.name });
}

UserSchema.methods.get_server_by_name = function (servername) {
    return this.user_jenkins.filter(jenkins => { return jenkins.name === servername })[0];
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    model: UserModel,
    schema: UserSchema
}