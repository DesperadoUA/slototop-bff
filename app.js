'use strict'
const Cash = require('./models/Cash')
const DAL = require('./DAL')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express().use(bodyParser.json())
app.use(cors())
app.get('/', async (req, res) => {
    return res.end("Good day")
})
app.post('/', async (req, res) => {
	const type = req.body.type
    const url = req.body.url || type
    if(type === 'search') {
        const {search_word} = req.body
        const response = await DAL.get({type, search_word})
        res.json(response.data)
    } 
    else if (type === 'loading') {
        const {postType} = req.body
        const {card} = req.body
        const loadingUrl = card ? `${type}/${postType}/${card}/${url}` : `${type}/${postType}/${url}`
        const {data} = await Cash.get(loadingUrl)
        if(!data) {
            const response = await DAL.get({...req.body})
            const {data} = await Cash.get(loadingUrl)
            if(!data) {
              console.log(response.data)
                Cash.store(loadingUrl, JSON.stringify(response.data))
                res.json(response.data)
            }
        }
        res.json(JSON.parse(data))
    } 
    else {
        const {data} = await Cash.get(url)
        if(data) res.json(JSON.parse(data))
        else {
            const response = await DAL.get({type, url})
            const {data} = await Cash.get(url)
            if(!data) {
               if(type === 'loading') {
                const {postType} = req.body.postType
                const loadingUrl = `${type}/${postType}/${url}`
                Cash.store(loadingUrl, JSON.stringify(response.data))
               } 
               else {
                  Cash.store(url, JSON.stringify(response.data))
               }
            } 
            res.json(response.data)
        }
    }
})
app.listen(9000, () => console.log('bff is listening'))