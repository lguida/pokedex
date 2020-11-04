require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const POKEDEX = require('./pokedex.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'
app.use(morgan(morganSetting))

app.use(helmet())
app.use(cors())


const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]



function handleGetTypes(req, res) {
    res.json(validTypes)
}

function handleGetPokemon(req, res){
    const { name, type } = req.query

    let result = POKEDEX.pokemon

    if (name){
        result = result.filter(pokemon =>
            pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
        )
    }

    if (type){
        result = result.filter(pokemon=>
            pokemon.type.includes(req.query.type)
        )
    }
    
    res.json(result)
}

app.use(function validateBearerToken(req, res, next){
    const bearerToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if (bearerToken !== apiToken){
        return res.status(401).json({ error: 'Unauthorized request'})
    }
    
    next()
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
})

app.get('/types', handleGetTypes)
app.get('/pokemon', handleGetPokemon)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {})