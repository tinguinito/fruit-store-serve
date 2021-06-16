const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const app = express()
const port = 3001



// get config vars
dotenv.config();

// access config and get secret key
const secrect_key = process.env.TOKEN_SECRET;


function generateAccessToken(username) {
    return jwt.sign(username, secrect_key, { expiresIn: '1800s' });
}




let products = [
    { sku: "prod-1", product: "Manzana verde", quantity: 50, price: 500, un: 'KG', isChecked: false },
    { sku: "prod-2", product: "Manzana Roja", quantity: 40, price: 600, un: 'KG', isChecked: false },
    { sku: "prod-3", product: "Uva Moscatel", quantity: 20, price: 1500, un: 'KG', isChecked: false },
    { sku: "prod-4", product: "Zapallo", quantity: 10, price: 2000, un: 'UN', isChecked: false },
]

let users = [
    { 'username': 'caom', 'password': 'qwerty' },
    { 'username': 'ipchile', 'password': 'ipchile' },
    { 'username': 'desarrolloweb', 'password': 'winners' },
]


app.use(cors())


// info => https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c
//espress.json() for get body from request in json format
app.use(express.json());


app.post('/api/authenticate', (req, res) => {
    console.log('req.body', req.body)

    if (req.body !== undefined && req.body.username !== undefined && req.body.password !== undefined) {
        const username = req.body.username
        const pwd = req.body.password
        console.log('body:', username, pwd)

        const userFiltered = users.filter((user) => user.username === username && user.password === pwd)
        console.log('userFiltered', userFiltered)
        if (userFiltered.length > 0 && userFiltered !== undefined) {

            const token = generateAccessToken({ username: userFiltered.username });
            console.log('token', token)
            return res.status(200).json(token);

        }
    }
    else {
        return res.sendStatus(403)
    }
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, secrect_key, (err, user) => {
        console.error("Error:", err)

        if (err) { return res.sendStatus(403) }

        req.user = user

        next()
    })
}

app.get('/', (req, res) => {
    res.send('Hello to Api Fruit Store!')
})

//get List
app.get('/api/products', authenticateToken, (req, res) => {
    // setTimeout(() => {
    //     console.log(`Esperando 3 segundos`)
    //     return res.send(products)
    // }, 3000);
    console.log(`GET /api/products`)
    return res.status(200).send(products)
})

//Edit Product
app.put('/api/products', authenticateToken, (req, res) => {
    console.log(req.body);
    const product = req.body;

    if (product) {
        console.log(`PUT /api/products ${JSON.stringify(product)}`)

        const index = products.map((elem) => elem.sku).indexOf(product.sku)
        if (index > -1) {
            products.splice(index, 1, product)
        }

        console.log(products)
        return res.status(200).send(product)
    } else {
        return res.status(400).send({})
    }
})

//Add product
app.post('/api/products', authenticateToken, (req, res) => {
    console.log(req.body);
    const product = req.body;

    if (product) {
        console.log(`POST /api/products ${JSON.stringify(product)}`)

        products.push(product);

        console.log(products)
        return res.status(200).send(product)
    } else {
        return res.status(400).send({})
    }
})

//delete product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
    console.log(req.params.id);
    const sku = req.params.id;

    if (sku) {
        const index = products.map((elem) => elem.sku).indexOf(sku)
        if (index > -1) {
            products.splice(index, 1)
        }

        console.log(products)
        return res.status(200).send({ response: 'ok' })
    } else {
        return res.status(400).send({})
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})