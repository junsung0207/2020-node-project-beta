// //const express = require("express");
// //const router = express.Router();
// const { Router } = require("express"); // express.Router()
// const router = Router();

// router.use("/music", require("./music"));
// router.use("/movie", require("./movie"));

// module.exports = router;


// //비확실 코드


const express = require("express");
const router = express.Router();
const ctrl = require("./auth.ctrl");

//router.get("/logout", ctrl.logout);

// google sign up
router.get("/google/signin", ctrl.auth)
router.get("/google/callback", ctrl.redirect)
router.get("/logout", ctrl.logout);

// router.post("/signup", ctrl.signup);
// router.post("/login", ctrl.login); //로그인

module.exports = router;