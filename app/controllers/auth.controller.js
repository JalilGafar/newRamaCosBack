const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
var con = require('../../rama-db');
var SQL = require('sql-template-strings');

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
  var client = req.body
  var crypt = bcrypt.hashSync(client.password, 8)
  try {
    const user = await User.create({
      username: client.username,
      password: bcrypt.hashSync(client.password, 8),
      localisation: client.localisation,
      tel1: client.tel1,
      tel2: client.tel2,
    });

    // con.query(
    //   SQL
    //   `INSERT INTO users (username, password, localisation, tel1, tel2) 
    //     VALUES (${client.username}, ${crypt}, ${client.localisation}, ${client.tel1}, ${client.tel2});
    //   ` 
    // )

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) res.send({ message: "User registered successfully!" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result) res.send({ message: "User registered successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "La combinaison Utilisateur et Mot de Passe n'est pas valide" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "La combinaison Utilisateur et Mot de Passe n'est pas valide",
      });
    }

    const token = jwt.sign({ id: user.id },
                           config.secret,
                           {
                            algorithm: 'HS256',
                            allowInsecureKeySizes: true,
                            expiresIn: 86400, // 24 hours
                           });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    res.clearCookie('bezkoder-session', {
        path: '/',
        httOnly: true,
        sameSite: 'none',
        secure: true
    });
    return res.status(200).send({
      message: "Vous avez été déconnecté !"
    });
  } catch (err) {
    this.next(err);
  }
};
