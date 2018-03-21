const UserModel = require('../schemas').model;

function UserService() {
    this.add_user = async (userdata) => {
        try {
            const user = new UserModel(userdata);
            const new_user = user.save();

            return new_user;
        } catch (e) {
            console.error(`[ERROR] ${e.message}`)
        }
    };

    this.get_user_jenkins_servers = async (telegram_id) => {
        try {
            const user = await UserModel.findOne({ telegram_id: telegram_id });
            return user.user_jenkins.map(jenkins => { return jenkins.name });
        } catch (e) {
            console.error(`[ERROR] ${e.message}`)
        }
    }
}