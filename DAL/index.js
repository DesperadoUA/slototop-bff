const axios = require('axios')
class DAL {
    static async get(options) {
        return await axios.post('https://slototop-api.lenddev.com.ua/wp-content/themes/api/app/', options)
    }
}
module.exports = DAL