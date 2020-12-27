var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');

router.post('/', cors(corsOptions), async function(req, res, next) {
    req.body.sold_at_time = (new Date(Date.now())).toISOString();
    const productID = req.body.product_id;
    const products = (await awaitQuery(`SELECT price_in_pence FROM Products WHERE id = "${productID}"`));
    if (products.length === 0)
    {
        console.warn(`User tried to get product id "${productID}" but it does not exist.`)
        next(`Product not found`);
        return;
    }
    req.body.sold_at_price_pence = products[0].price_in_pence;
    insertInto(["user_id", "sold_at_price_pence", "sold_at_time", "product_id"], [], "Purchases", req, res, next);
});

router.get('/:user_id', cors(corsOptions), async function(req, res, next) {
    const user_id = req.params.user_id;
    const response = await awaitQuery(`SELECT * FROM Purchases LEFT JOIN (SELECT product_name, id product_id FROM Products) P on Purchases.product_id = P.product_id WHERE user_id = "${user_id}"`);
    res.send(response);
});

module.exports = router;