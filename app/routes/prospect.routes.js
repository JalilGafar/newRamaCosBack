const express = require('express');
var SQL = require('sql-template-strings');

const router = express.Router();
var con = require('../../rama-db');

router.post("/", (req, res, next) => {
    var prospect = req.body
    con.query(SQL `
        INSERT INTO prospect 
        (name, localisation, tel1, tel2) 
        VALUES (${prospect.username}, ${prospect.localisation}, ${prospect.tel1}, ${prospect.tel2});
        `,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200).json(result);
            console.log('Prospect Enregistré !')
            return;
        }
    )
} )

module.exports = router;