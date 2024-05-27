'use strict'
const Cash = require('./models/Cash')
const DAL = require('./DAL')
const express = require('express')
const bodyParser = require('body-parser')
const app = express().use(bodyParser.json())
app.get('/', async (req, res) => {
    return res.end("Good day")
})
app.post('/', async (req, res) => {
	const {type, url} = req.body
	const {data} = await Cash.get(url)
    if(data) res.json(JSON.parse(data))
    else {
        const response = await DAL.get({type, url})
        Cash.store('main', JSON.stringify(response.data))
        res.json(response.data)
    }
})
app.listen(9000, () => console.log('bff is listening'))