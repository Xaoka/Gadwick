var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { update } = require('./commands/update');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const keys = require('../../keys.json');
const stripe = Stripe(keys.stripe_liveKey);
var mysql = require('mysql');

router.post("/", bodyParser.raw({type: 'application/json'}), async (req, res, next) => {
    const endpointSecret = "whsec_xXPiVsqVTLRnVhoKQaZlBymEBvtA7AJN"// TODO: hide
    const sig = req.headers['stripe-signature'];
    const body = req.rawBody;
  
    let event = null;
  
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      // invalid signature
      res.status(400).send(body);
      return;
    }
    // TODO: We should flag it up if we get a completed, with no pending in the DB
    try
    {
      switch (event['type']) {
          // CORRECT??
          case 'checkout.session.completed':
              const session = event.data.object;
              // Get the most recent purchase entry for this intent
              const purchases = (await awaitQuery(`SELECT * FROM Purchases WHERE intent_id = "${mysql.escape(session.id)}" ORDER BY sold_at_time DESC LIMIT 1`));
              if (purchases.length > 0)
              {
                update({status: "SUCCESS", stripe_subscription_id: purchases[0].subscription}, ["status", "stripe_subscription_id"], "Purchases", purchases[0].id);
                res.status(200).send(purchases[0].id);
              }
              else
              {
                res.status(500).send(JSON.stringify(purchases));
                return;
              }
              break;
          // TODO: Do we need to catch something here when the month rolls around?
          // case 'payment_intent.succeeded':
          //     intent = event.data.object;
          //     console.log("Succeeded:", intent.id);
          //     update({status: "SUCCESS"}, ["status"], "Purchases", intent.id, "intent_id");
          //     res.status(200).send(intent.id);
          //     break;
          // case 'payment_intent.payment_failed':
          //     intent = event.data.object;
          //     // const message = intent.last_payment_error && intent.last_payment_error.message;
          //     update({status: "FAILED"}, ["status"], "Purchases", intent.id, "intent_id");
          //     res.status(200).send(`Failed`);
          //     break;
      }
    }
    catch (err)
    {
      res.status(500).send(`Error processing webhook: ${err}`)
    }
    res.status(200).end();
  })
  
module.exports = router;