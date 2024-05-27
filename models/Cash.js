const knex = require('../db')
class Cash {
    static async get(url) {
		const data = await knex('cash')
			.select()
			.where({
				[`cash${'.url'}`]: url
			})
			.first()
        return data || {}
	}
    static async store(url, data) {
       await knex('cash').insert({ url, data });
    }
}
module.exports = Cash