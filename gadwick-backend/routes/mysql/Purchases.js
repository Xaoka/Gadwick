var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51I1uUQBdEJQZjJeTymX8EeTNLmQdiUjoptah48acJKY5h1iJZ9itkIInsrSjgVH7GHbgRxrIvS9FRhOHWGsG1HLb00pFp5brz3');


router.post('/', cors(corsOptions), async function(req, res, next) {
    const { product_name } = req.body;

    // const products = await awaitQuery(`SELECT * FROM Products WHERE product_name = "${product_name}"`);
    // if (products.length === 0)
    // {
    //   next(`No Product found`);
    //   return;
    // }
    // req.body.sold_at_time = (new Date(Date.now())).toISOString();
    // req.body.product_id = products[0].id;
    // req.body.sold_at_price = products[0].price_in_pence;
    // insertInto(["user_id", "sold_at_price_pence", "sold_at_time", "product_id", "intent_id"], [], "Purchases", req, res, next);
    res.sendStatus(200);

    // awaitQuery(`INSERT INTO Purchases (id, product_id, sold_at_price_pence, sold_at_time, user_id, intent_id, status) VALUES ("${entryID}", "${product.id}", ${product.price_in_pence}, "${}", "${user_id}", "${session.id}", "PENDING")`);
    // req.body.sold_at_time = (new Date(Date.now())).toISOString();
    // const productName = req.body.product_name;
    // const products = (await awaitQuery(`SELECT price_in_pence, id FROM Products WHERE product_name = "${productName}"`));
    // if (products.length === 0)
    // {
    //     console.warn(`User tried to get product name "${productName}" but it does not exist.`)
    //     next(`Product not found`);
    //     return;
    // }
    // req.body.sold_at_price_pence = products[0].price_in_pence;
    // req.body.product_id = products[0].id;
    // insertInto(["user_id", "sold_at_price_pence", "sold_at_time", "product_id"], [], "Purchases", req, res, next);
});

router.get('/:user_id', cors(corsOptions), async function(req, res, next) {
    const user_id = req.params.user_id;
    const response = await awaitQuery(`SELECT * FROM Purchases LEFT JOIN (SELECT product_name, id product_id FROM Products) P on Purchases.product_id = P.product_id WHERE user_id = "${user_id}"`);
    res.send(response);
});

router.get('/subscription/:user_id', cors(corsOptions), async function(req, res, next) {
    const user_id = req.params.user_id;
    // Get the most recent, highest rank subscription purchase
    console.log(`Getting subscription data for ${user_id}`);
    const response = await awaitQuery(`SELECT * FROM Purchases LEFT JOIN (SELECT product_name, id product_id, type FROM Products) P on Purchases.product_id = P.product_id WHERE user_id = "${user_id}" AND type = "SUBSCRIPTION" GROUP BY Purchases.product_id ORDER BY sold_at_time`);
    res.send(response);
});

router.post("/create-checkout-session", async (req, res, next) => {
    // TODO: Local/Dev
    const url = `http://localhost:3006/dashboard/subscription`
    const { product_name, user_id } = req.body;
    const products = (await awaitQuery(`SELECT * FROM Products WHERE product_name = "${product_name}"`));
    if (products.length === 0)
    {
      next(`Product "${product_name}" not found.`);
      return;
    }
    const product = products[0];
    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            // price: product.stripe_price_id,
            quantity: 1,
            // name: "Gadwick Subscription",
            // description: "Gadwick Subscription",
            // amount: 1,
            // currency: "GBP",
            price_data:
            {
                unit_amount: product.price_in_pence,
                currency: "GBP",
                product: product.stripe_product_id,
                recurring:
                {
                    interval: "month",
                    interval_count: 1
                }
            }
          },
        ],
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}`,
      });
      const entryID = uuidv4();
      awaitQuery(`INSERT INTO Purchases (id, product_id, sold_at_price_pence, sold_at_time, user_id, intent_id, status) VALUES ("${entryID}", "${product.id}", ${product.price_in_pence}, "${(new Date(Date.now())).toISOString()}", "${user_id}", "${session.id}", "PENDING")`);
  
      res.send({
        sessionId: session.id,
      });
    } catch (e) {
      res.status(400);
      return res.send({
        error: {
          message: e.message,
        }
      });
    }
  });
  
module.exports = router;