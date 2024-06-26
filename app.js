'use strict'
const config = require('./config.js')
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
        const response = await DAL.get(req.body)
        res.json(response.data)
    }
    else if (type === 'loading') {
        const {postType, card} = req.body
        const loadingUrl = card ? `${type}/${postType}/${card}/${url}` : `${type}/${postType}/${url}`
        const {data} = await Cash.get(loadingUrl)
        if(!data) {
            const response = await DAL.get(req.body)
            const {data} = await Cash.get(loadingUrl)
            if(!data) {
              await Cash.store(loadingUrl, JSON.stringify(response.data))
              res.json(response.data)
            }
        }
        res.json(JSON.parse(data))
    } 
    else {
        const fullUrl = `/${type}/${url}`
        const {data} = await Cash.get(fullUrl)
        if(data) res.json(JSON.parse(data))
        else {
            const response = await DAL.get(req.body)
            const {data} = await Cash.get(fullUrl)
            if(!data) {
               if(type === 'loading') {
                const {postType} = req.body
                const loadingUrl = `${type}/${postType}/${url}`
                await Cash.store(loadingUrl, JSON.stringify(response.data))
               } 
               else {
                  await Cash.store(fullUrl, JSON.stringify(response.data))
               }
            } 
            res.json(response.data)
        }
    }
})
app.listen(config.PORT, () => console.log('bff is listening'))