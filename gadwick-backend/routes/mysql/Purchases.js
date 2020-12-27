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

// router.post("/create-checkout-session", async (req, res) => {
//     const { priceId } = req.body;
  
//     // See https://stripe.com/docs/api/checkout/sessions/create
//     // for additional parameters to pass.
//     try {
//       const session = await stripe.checkout.sessions.create({
//         mode: "subscription",
//         payment_method_types: ["card"],
//         line_items: [
//           {
//             price: priceId,
//             // For metered billing, do not pass quantity
//             quantity: 1,
//           },
//         ],
//         // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
//         // the actual Session ID is returned in the query parameter when your customer
//         // is redirected to the success page.
//         success_url: 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}',
//         cancel_url: 'https://example.com/canceled.html',
//       });
  
//       res.send({
//         sessionId: session.id,
//       });
//     } catch (e) {
//       res.status(400);
//       return res.send({
//         error: {
//           message: e.message,
//         }
//       });
//     }
//   });
  
module.exports = router;