var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51I1uUQBdEJQZjJeTymX8EeTNLmQdiUjoptah48acJKY5h1iJZ9itkIInsrSjgVH7GHbgRxrIvS9FRhOHWGsG1HLb00pFp5brz3');


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

router.get('/subscription/:user_id', cors(corsOptions), async function(req, res, next) {
    const user_id = req.params.user_id;
    // Get the most recent, highest rank subscription purchase

    const response = await awaitQuery(`SELECT * FROM Purchases LEFT JOIN (SELECT product_name, id product_id FROM Products) P on Purchases.product_id = P.product_id WHERE user_id = "${user_id}"`);
    res.send(response);
});

router.post("/create-checkout-session", async (req, res) => {
    // TODO: Local/Dev
    const url = `http://localhost:3006/dashboard/subscription`
    const { stripe_id } = req.body;
    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: stripe_id,
            quantity: 1,
            // name: "Gadwick Subscription",
            // description: "Gadwick Subscription",
            // amount: 1,
            // currency: "GBP",
            price_data:
            {
                unit_amount: 1,
                currency: "GBP",
                product: "prod_IdF3Fw2PGcZBQy",// TODO: Dynamic
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
        cancel_url: `${url}/canceled`,
      });
  
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