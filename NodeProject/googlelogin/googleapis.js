import {
  google
} from 'googleapis';

// const oauth2 = google.oauth2('v2');

/*
 # https://github.com/googleapis/google-api-nodejs-client
 # GOOGLEAPI NODE JS SAMPLE IMPORTED
*/

// eslint-disable-next-line import/prefer-default-export
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL,
);

module.exports = {
  oauth2Client
};

// export const getUserProfile = (access)