var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const { response } = require('express');
const config = require('../../config.json');
const stripe = Stripe(config.STRIPE_KEY);
var mysql = require('mysql');



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

router.get('/', cors(corsOptions), async function(req, res, next) {
    const response = await awaitQuery(`SELECT * FROM Purchases LEFT JOIN (SELECT product_name, id product_id FROM Products) P on Purchases.product_id = P.product_id LEFT JOIN Users ON Purchases.user_id = Users.id ORDER BY Purchases.sold_at_time DESC`);
    res.send(response);
});

router.get('/:user_id', cors(corsOptions), async function(req, res, next) {
    const user_id = req.params.user_id;
    const response = await awaitQuery(`SELECT * FROM Purchases LEFT JOIN (SELECT product_name, id product_id FROM Products) P on Purchases.product_id = P.product_id WHERE user_id = ${mysql.escape(user_id)}`);
    res.send(response);
});

router.get('/subscription/:user_id', cors(corsOptions), async function(req, res, next) {
    const user_id = req.params.user_id;
    // Get the most recent, highest rank subscription purchase
    console.log(`Getting subscription data for ${user_id}`);
    const response = await awaitQuery(`SELECT * FROM Purchases LEFT JOIN (SELECT product_name, id product_id, type FROM Products) P on Purchases.product_id = P.product_id WHERE user_id = ${mysql.escape(user_id)} AND type = "SUBSCRIPTION" AND status = "SUCCESS" GROUP BY Purchases.product_id ORDER BY sold_at_time`);
    res.send(response);
});

router.post("/create-checkout-session", async (req, res, next) => {
    // TODO: Local/Dev
    const url = `https://gadwick.co.uk/dashboard/subscription`
    const { product_name, user_id } = req.body;
    const products = (await awaitQuery(`SELECT * FROM Products WHERE product_name = ${mysql.escape(product_name)} AND env = ${config.ENV}`));
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
      awaitQuery(`INSERT INTO Purchases (id, product_id, sold_at_price_pence, sold_at_time, user_id, intent_id, status) VALUES (${mysql.escape(entryID)}, ${mysql.escape(product.id)}, ${mysql.escape(product.price_in_pence)}, "${(new Date(Date.now())).toISOString()}, ${mysql.escape(user_id)}, ${mysql.escape(session.id)}, "PENDING")`);
  
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
  
router.put('/cancel-subscription/user/:user_id', cors(corsOptions), async function(req, res, next) {
  const user_id = req.params.user_id;
  const purchases = (await awaitQuery(`SELECT * FROM Purchases LEFT JOIN (SELECT product_name, id product_id, type FROM Products) P ON Purchases.product_id = P.product_id WHERE user_id = ${mysql.escape(user_id)} AND type = "SUBSCRIPTION" AND status = "SUCCESS"`));
  console.log(`Found ${purchases.length} active subscriptions`);
  if (purchases.length > 0)
  {
    for (const purchase of purchases)
    {
      if (purchase.stripe_subscription_id)
      {
        try
        {
          await stripe.subscriptions.del(purchase.stripe_subscription_id);
        }
        catch (error)
        {
          res.status(500).send(`Issue cancelling subscription via stripe API`);
          return;
        }
        await update({status: "CANCELLED"}, ["status"], "Purchases", purchase.id);
      }
    }
  }

  res.send(`Cancelled subscriptions: ${purchases.length > 0 ? purchases.map((p) => p.id) : ""}`);
});
  
module.exports = router;