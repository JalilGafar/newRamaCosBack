var mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "NjNgNdFoNjMaNj7",
    database: 'ramadb',
    multipleStatements: true
});
  
  
con.connect(function(err) {
	if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    }
    console.log('Ramacos Database is connected successfully !');
});

module.exports = con;