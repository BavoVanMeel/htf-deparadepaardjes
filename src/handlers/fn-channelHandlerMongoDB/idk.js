const axios = require('axios');

exports.lambdaHandler = async ( event ) => {
    try {

        // Log incoming event and environment variables
        console.log(event)

        // send to MongoDB

        return "succesfully finished"
    } catch (err) {
        console.log(err);
        throw err
    }
}