const axios = require('axios')
const config = require('../config.js')
class DAL {
    static async get(options) {
        return await axios.post( config.API_URL, options)
    }
}
module.exports = DAL