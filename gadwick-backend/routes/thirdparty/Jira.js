var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
var Axios = require('axios');

router.post('/', cors(corsOptions), async function(req, res, next) {
    const code = req.body.code;
    const refresh_token = req.body.refresh_token;
    const redirect_uri = req.body.redirect_uri;
    if (code === undefined && refresh_token === undefined)
    {
        res.status(400).send("Error: 'code' or 'refresh_token' field missing from body.");
        return;
    }
    if (redirect_uri === undefined)
    {
        res.status(400).send("Error: 'redirect_uri' field missing from body.");
        return;
    }
    const settings =
    {
        grant_type: "authorization_code",
        client_id: "zv8XHpxAiXyTAGB46ebm5XhzV9EC6Ksa",
        client_secret: "zw0LkemNJA_vBByVMqj2fVAcabqXQYYYKg0VeEyONx5R9GKxx8ZUXQQcakY0Q7Lp",
        code,
        redirect_uri
    }
    // console.dir(settings);
    try
    {
        const params = Object.entries(settings).map((value) => `${value[0]}=${value[1]}`).join("&");
        const response = await Axios.post(`https://auth.atlassian.com/oauth/token`, { body: settings, headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Atlassian-Token': 'nocheck' }});
        // console.dir(response.data);
        res.status(response.status).send(response.data);
        return;
    }
    catch (err)
    {
        // console.dir(err.response);
        res.send(err.response.data);
        return;
    }
});

module.exports = router;