//REGISTRATION CONTROLLER

//DEPENDENCIES
const express         = require('express');
const bcrypt          = require('bcrypt');
const router          = express.Router();

//MODELS
const Users             = require('../models/users.js');

//GET ROUTE
router.get('/', (req, res) => {
  res.render('../views/users/reg.ejs');
});

//POST ROUTE ENCRYPTION
router.post('/', async (req, res) => {
  const emailAddress = req.body.emailAddress;
  const emailAddressHash = bcrypt.hashSync(emailAddress, bcrypt.genSaltSync(10));
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  console.log("Email address Salt: ", emailAddressHash);
  console.log("Password Salt: ", passwordHash);

  //CREATE MONGO DB OBJECT
  const userDbEntry = {};
  userDbEntry.emailAddress = emailAddressHash;
  userDbEntry.password = passwordHash;

  //UPLOAD MONGO DB OBJECT
  try {
    const upload = await Users.create(userDbEntry);
    req.session.emailAddress = upload.emailAddress;
    req.session.logged = true;
    res.redirect("/");
  } catch (err) {
    res.send(err.message);
  }
});

//EXPORT----------------------------------------------
module.exports = router;
