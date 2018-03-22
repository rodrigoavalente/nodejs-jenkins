const User = require('../schemas/user.schema').model;
const Jenkins = require('../schemas/jenkins.schema').model;

function UserService() {

    this.add_user = (userdata) => {
        const user = new User(userdata);
        return user.save()
            .then(data => { return [data]; })
            .catch(err => [null, err]);
    };

    this.get_user_by_username = (username) => {
        return User.findOne({ 'username': username })
            .then(data => { return [data]; })
            .catch(err => [null, err]);
    }

    this.get_user_jenkins_servers = async (telegram_id) => {
        try {
            const user = await UserModel.findOne({ telegram_id: telegram_id });
            return user.user_jenkins.map(jenkins => { return jenkins.name });
        } catch (e) {
            console.error(`[ERROR] ${e.message}`)
        }
    }

    this.add_jenkins_server = async (jenkins_data, username) => {
        const jenkins = new Jenkins(jenkins_data);
        const [user, err] = await this.get_user_by_username(username);
        
        user.user_jenkins.push(jenkins);
        return user.save()
            .then(data => { return [data] })
            .catch(err => [null, err]);
    }
}

module.exports = UserService;