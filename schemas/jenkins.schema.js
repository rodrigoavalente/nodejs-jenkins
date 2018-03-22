const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JenkinsSchema = new Schema({
    url: String,
    name: String,
    username: String,
    password: String,
    jobs: [String]
});

const JenkinsModel = mongoose.model('Jenkins', JenkinsSchema);

module.exports = {
    model: JenkinsModel,
    schema: JenkinsSchema    
}