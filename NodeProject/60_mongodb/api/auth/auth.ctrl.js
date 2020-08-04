const jwt = require("jsonwebtoken");

const {
  googleapis,
  google
} = require("googleapis")
const {
  oauth2Client
} = require("./googleapis");

const oauth2 = google.oauth2('v2');

// generate a url that asks permissions
const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,
});

const auth = (req, res) => {
  console.log('auth');
  // send client to google auth page
  res.redirect(url);
};

const redirect = async (req, res) => {
  // let refreshToken;
  const {
    code
  } = req.query;


  // oauth2Client.on('tokens', (newTokens) => {
  //   if (newTokens.refresh_token) {
  //     // store the refresh_token in my database!
  //     console.log('store the refresh_token in my database');
  //     console.log(`refresh_token : ${newTokens.refresh_token}`);
  //     refreshToken = newTokens.refresh_token;
  //   }
  //   console.log(`access_token : ${newTokens.access_token}`);
  // });

  // This will provide an object with the access_token and refresh_token.
  // Save these somewhere safe so they can be used at a later time.
  oauth2Client.getToken(code).then(({
    tokens
  }) => {
    oauth2Client.setCredentials(tokens);
    const token = tokens.access_token;

    // save google access_token

    console.log("token saving.....")
    res.cookie("googleToken", token, {
      httpOnly: true
    });

    console.log("ctrl의 token : " + token);
    res.redirect("/api/index");
    res.redirect("/api/play/test");
    res.redirect("/api/play");


  });
};


// var redis = require('redis');
// var JWTR = require('jwt-redis').default;
// var redisClient = redis.createClient();
// var jwtr = new JWTR(redisClient);

const logout = (req, res) => {
  const token = req.cookies.googleToken;
  // jwtr.destroy(token);
  console.log("토큰 삭제!");
  res.redirect("/");
  // req.cookies.googleToken = "";
  // res.clearCookie("token");
  // console.log(req.cookies.googleToken);
  // console.log((req.cookies.googleToken).typeOf);


  // jwt.verify(token, "secretToken", (err, _id) => {
  //   if (err) return res.status(500).send("로그아웃 시 오류가 발생했습니다.");
  //   res.clearCookie("token");
  //   res.redirect("/");
  // });
}

module.exports = {
  auth,
  redirect,
  logout
}