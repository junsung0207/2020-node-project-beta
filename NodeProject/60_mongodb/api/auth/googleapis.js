const {
    google
} = require("googleapis");

// const oauth2 = google.oauth2('v2');

/*
 # https://github.com/googleapis/google-api-nodejs-client
 # GOOGLEAPI NODE JS SAMPLE IMPORTED
*/

// eslint-disable-next-line import/prefer-default-export
const oauth2Client = new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    "http://localhost:3000/api/auth/google/callback",
);

module.exports = {
    oauth2Client
};

// export const getUserProfile = (access)