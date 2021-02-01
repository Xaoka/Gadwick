var express = require('express');
var cors = require('cors')
var corsOptions = require('../cors')
var router = express.Router();
const { awaitQuery } = require('./commands/mysql');
const { insertInto } = require('./commands/insert');
const { deleteEntry } = require('./commands/delete');
const { update } = require('./commands/update');
var mysql = require('mysql');

router.get('/:id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.id;
    const tags = (await awaitQuery(`SELECT * FROM Tags WHERE id = ${mysql.escape(id)}`));
    if (tags.length > 0)
    {
        res.send(tags[0]) 
    }
    else
    {
        res.sendStatus(404);
    }
});
router.get('/app/:id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.id;
    const tags = (await awaitQuery(`SELECT * FROM Tags WHERE app_id = ${mysql.escape(id)}`));
    res.send(tags);
});
router.post('/', cors(corsOptions), async function(req, res, next) {
    insertInto(["name", "app_id"], [], "Tags", req, res, next);
})
router.put('/:id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.id;
    await update(req.body, ["name"], "Tags", id);
    res.sendStatus(200);
})
router.delete('/:id', cors(corsOptions), async function(req, res, next) {
    const id = req.params.id;
    deleteEntry("Tags", id, req, res, next);
})

module.exports = router;