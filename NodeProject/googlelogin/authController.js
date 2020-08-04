import { google } from 'googleapis';
import { oauth2Client } from './googleapis';
import UserDAL from '../user/userDAL';
import UserError from '../user/userErrors';
import { updateRefreshToken } from './authDAL';
import isEmpty from '../../config/Utils';

const oauth2 = google.oauth2('v2');

// generate a url that asks permissions
const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,
});

export const auth = (req, res) => {
  console.log('auth');
  // send client to google auth page
  res.redirect(url);
};

export const redirect = async (req, res) => {
  let refreshToken;
  const { code } = req.query;

  oauth2Client.on('tokens', (newTokens) => {
    if (newTokens.refresh_token) {
      // store the refresh_token in my database!
      console.log('store the refresh_token in my database');
      console.log(`refresh_token : ${newTokens.refresh_token}`);
      refreshToken = newTokens.refresh_token;
    }
    console.log(`access_token : ${newTokens.access_token}`);
  });

  // This will provide an object with the access_token and refresh_token.
  // Save these somewhere safe so they can be used at a later time.
  oauth2Client.getToken(code).then(({ tokens }) => {
    oauth2Client.setCredentials(tokens);

    oauth2.userinfo.get({ auth: oauth2Client }).then(({ data }) => {
      console.log(data);
      UserDAL.findByEmail(data.email).then((result) => {
        const userId = result[0].user_id;
        if (!isEmpty(refreshToken)) {
          updateRefreshToken(userId, refreshToken).catch((error) => {
            console.log(error);
          });
        }
        res.send({
          access_token: tokens.access_token,
          user_id: userId,
        });
      }).catch((error) => {
        if (error.description === UserError.NOT_AVAILABLE_USER) {
          res.send({
            access_token: tokens.access_token,
            error: UserError.NOT_AVAILABLE_USER,
          });
        } else {
          res.status(500).send({
            access_token: tokens.access_token,
            error: error.description,
          });
        }
      });
    });
  });
};
