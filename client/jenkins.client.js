const request = require('request-promise-native');
const RequestExceptions = require('../exceptions/requests.exception');

function JenkinsClient(username, password, jenkins_url) {
    this.username = null;
    this.password = null;
    this.jenkins_url = null;

    if (!username) {
        throw ('[ERROR] Username must be defined.');
    } else {
        this.username = username
    }

    if (!password) {
        throw ('[ERROR] Password must be defined.');
    } else {
        this.password = password;
    }

    if (!jenkins_url) {
        throw ('[ERROR] Jenkins URL must be defined.');
    } else {
        const regex = /(http:\/\/|https:\/\/)(www)?/g;
        if (jenkins_url.match(regex)) {
            this.jenkins_url = jenkins_url.replace(regex, `$1${this.username}:${this.password}@`)
        } else {
            this.jenkins_url = `http://${this.username}:${this.password}@${jenkins_url}`;
        }
    }

    this.list_jobs = (params) => {
        params = params || ['name', 'color', 'url', 'weather'];
        return request({ method: 'get', uri: `${this.jenkins_url}/api/json?tree=jobs[${params.join(',')}]`, json: true })
            .then(data => { return [data]; })
            .catch(err => [null, new RequestExceptions(err)]);
    }

    this.builds = (job_name, params) => {
        if (!job_name) {
            throw ('[ERROR] The name of the job must be specified.');
        }
        params = params || ['number', 'status', 'timestamp', 'id', 'result'];
        return request({ method: 'get', uri: `${this.jenkins_url}/job/${job_name}/api/json?tree=builds[${params.join(',')}]`, json: true })
            .then(data => { return [data]; })
            .catch(err => [null, new RequestExceptions(err)]);
    }

    this.last_build = (job_name, params) => {
        params = params || ['timestamp', 'estimatedDuration', 'result'];
        return request({ method: 'get', uri: `${this.jenkins_url}/job/${job_name}/lastBuild/api/json?tree=${params.join(',')}`, json: true })
            .then(data => { return [data]; })
            .catch(err => [null, new RequestExceptions(err)]);
    }

    this.progress = (job_name) => {
        const params = ['result', 'timestamp', 'estimatedDuration'];
        return request({ method: 'get', uri: `${this.jenkins_url}/job/${job_name}/lastBuild/api/json?tree=${params.join(',')}`, json: true })
            .then(data => { return [data]; })
            .catch(err => [null, new RequestExceptions(err)]);
    }
}

module.exports = JenkinsClient;