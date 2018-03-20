function RequestExceptions(err) {
    if (!err) {
        throw('[ERROR] The info of the error must be defined.');
    }

    const verboseMessages = {
        400: 'There was something wrong with your data. Please check it and try again soon.',
        401: 'Invalid credentials to access the requested URI.',
        403: 'Sorry but the informaded credentials don\'t have access to the requested URI.',
        404: 'There is nothing here.',
        405: 'I can\'t do it here.',
        408: 'I bored... I don\'t want wait anymore.',
        500: 'The server broke :(',
        501: 'They\'re not ready yet.',
        502: 'The doorman is minissing.',
        503: 'The server can\'t respond right now.',
        504: 'The doorman has gone to lunch, he\'s not coming anytime soon.'
    };

    const statusMessages = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method not Allowed',
        408: 'Request Timeout',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavaible',
        504: 'Gateway Timeout'
    };

    this.name = err.status
    this.status = err.statusCode;
    this.statusMessage = statusMessages[this.status] || 'This is an error that I\'m not programmed to understand.';
    this.verboseMessage = verboseMessages[this.status] || 'The server said something that I don\'t understand... I\'m ofended :\'(';    

    this.to_string = () => {
        return `${this.status} - ${this.statusMessage}. ${this.verboseMessage}`;
    }
}

module.exports = RequestExceptions;