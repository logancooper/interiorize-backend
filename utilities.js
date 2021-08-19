require('dotenv').config();

const jwksUri = process.env.JWKSURI;
const issuer = process.env.ISSUER;

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri
    }),
  // Validate the audience and the issuer.
  audience: 'https://api.interiorize.design',
  issuer,
  algorithms: ['RS256']
});

module.exports = checkJwt;