const express = require('express');
var SQL = require('sql-template-strings');

const router = express.Router();
var con = require('../../rama-db');

router.get("/", (req, res, next) => {
    con.query("SELECT * FROM produits;",
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200).json(result);
            return;
        }
    )
} )

router.get("/order", (req, res, next) => {
    con.query("SELECT * FROM commandes;",
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200).json(result);
            return;
        }
    )
} )

router.get("/types", (req, res, next) => {
    con.query("SELECT type FROM produits group by (type);",
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200).json(result);
            return;
        }
    )
} )

// Récupérer une commande et les info de son client
router.get("/orderItem", (req, res, next) => {
    var idCmd = req.query.idCmd;
    con.query(SQL 
        `select id_cmd, contenu, montant, date, client, localisation, tel1, tel2 
            from 
                commandes
                join 
                    users
                    on (commandes.client = users.username)
                    where (commandes.id_cmd = ${idCmd} )`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200).json(result);
            // console.log(JSON.stringify(res))
            return;
        }
    )
} )



router.post('/commande', (req, res, next) => {
    var finalCommand = req.body
    con.query(SQL
                `INSERT INTO commandes
                (contenu, montant, client) 
                VALUES (${finalCommand.commande}, ${finalCommand.total}, ${finalCommand.client});`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    res.sendStatus(200);
                    console.log('Commande enregistrée !');
                }
            );
});




module.exports = router;