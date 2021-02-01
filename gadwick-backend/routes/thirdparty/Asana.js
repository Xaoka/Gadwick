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
        grant_type: refresh_token ? "refresh_token" : "authorization_code",
        code,
        refresh_token,
        redirect_uri,
        client_id: "1198750591472151",
        client_secret: "41da133f578f1fba1e2a754e774410f4"
    }
    try
    {
        const params = Object.entries(settings).map((value) => `${value[0]}=${value[1]}`).join("&");
        const response = await Axios.post(`https://app.asana.com/-/oauth_token?${params}`);
        res.send(response.data);
        return;
    }
    catch (err)
    {
        res.send(err.response.data);
        return;
    }
});

module.exports = router;