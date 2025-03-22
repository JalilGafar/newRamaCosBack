const express = require ('express');

var cors = require('cors');
const cookieSession = require("cookie-session");
var con = require('./app/config/db.config')
// var SQL = require('sql-template-strings')
var app = express();

//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use(cors());
/* for Angular Client (withCredentials) */
app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:4200"],
    })
);

app.use(
    cookieSession({
      name: "bezkoder-session",
      keys: ["COOKIE_SECRET"], // should use as secret environment variable
      httpOnly: true,
      sameSite: 'strict'
    })
);

//Customer Route
const CustomerRoute = require('./app/routes/customer.routes')

//Prospect Route
const ProspectRoute = require('./app/routes/prospect.routes')


// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// function initial() {
//     Role.create({
//       id: 1,
//       name: "user",
//     });
  
//     Role.create({
//       id: 2,
//       name: "moderator",
//     });
  
//     Role.create({
//       id: 3,
//       name: "admin",
//     });
// }

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});


app.use('/api/products', CustomerRoute);

app.use('/api/prospect', ProspectRoute);

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

module.exports = app;