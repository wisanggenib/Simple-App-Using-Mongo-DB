const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
app.set('view engine', 'ejs')

app.listen(3000, function () {
    console.log('listening on 3000')
})

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static('public'))
app.use(bodyParser.json())



const connectionString = 'mongodb+srv://root:passwordhere@cluster0.5zx6q.mongodb.net/test?retryWrites=true&w=majority'
MongoClient.connect(connectionString, {
        useUnifiedTopology: true
    })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('test')
        const quotesCollection = db.collection('quotes')

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', {
                        quotes: results
                    })
                })
                .catch( /* ... */ )
        })
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate({
                    name: 'Yoda'
                }, {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                }, {
                    //if true = insert new value
                    //if false = Not inserting new value 
                    upsert: false
                })
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne({
                    name: req.body.name
                })
                .then(result => {
                    if (result.deletedCount === 0) {
                      return res.json('No quote to delete')
                    }
                    res.json(`Deleted Darth Vadar's quote`)
                  })
                  .catch(error => console.error(error))
        })

    })
    .catch(error => console.error(error))