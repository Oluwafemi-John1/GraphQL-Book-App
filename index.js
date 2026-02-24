const express = require('express')
const app = express()
const graphqlHTTP = require('express-graphql').graphqlHTTP
const schema = require('./schema/schema')
const mongoose = require('mongoose')
require('dotenv').config()
const authorModel = require('./models/authorModel')
const cors = require('cors')
app.use(cors())


const port = process.env.PORT || 5000
const mongodb_uri = process.env.URI
app.use(express.json())

mongoose.connect(mongodb_uri)
    .then(() => {
        console.log('A small step for graphql, a giant leap for programming');
    })
    .catch((err) => {
        console.log(err);
    })

// app.post('/savebook', async (req, res)=>{
//     try {
//         const {id, name, genre} = req.body
//         let book = await new bookModel({id, name, genre})
//         await book.save()
//         res.status(201).json({message: 'data saved successfully', book})
//     } catch (err) {
//         console.log("Failed to add books", err);
//         res.status(401).json(err)
//     }
// })


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.get('/allAuthors', async (req, res) => {
    try {
        let info = await authorModel.find()
        res.status(201).json({data: info})
    } catch (err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`server has started at ${port}`);
})