const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

let products = [
    { sku: "prod-1", product: "Manzana verde", quantity: 50, price: 500, un: 'KG', isChecked: false },
    { sku: "prod-2", product: "Manzana Roja", quantity: 40, price: 600, un: 'KG', isChecked: false },
    { sku: "prod-3", product: "Uva Moscatel", quantity: 20, price: 1500, un: 'KG', isChecked: false },
    { sku: "prod-4", product: "Zapallo", quantity: 10, price: 2000, un: 'UN', isChecked: false },
]


app.use(cors())


// info => https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c
app.use(express.json());
app.use(express.urlencoded())

app.get('/', (req, res) => {
    res.send('Hello to Api Fruit Store!')
})

//get List
app.get('/api/products', (req, res) => {
    // setTimeout(() => {
    //     console.log(`Esperando 3 segundos`)
    //     return res.send(products)
    // }, 3000);
    console.log(`/api/products`)
    return res.status(200).send(products)
})

//Edit Product
app.put('/api/products', (req, res) => {
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
app.post('/api/products', (req, res) => {
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
app.delete('/api/products/:id', (req, res) => {
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