const jwt = require('jsonwebtoken');
const joi = require('joi');
const getPem = require('rsa-pem-from-mod-exp');

const internals = {};

internals.publicKeys = new Map();

internals.tokenSchema = joi.object({
  header: joi.object({
    jwtKid: joi.string().required(),
  }).required().unknown(),
}).unknown();

internals.retrievePublicKeys = async (jwkUri) => {
  const response = fetch(jwkUri);
  if (response.ok) {
    const body = await response.json();
    if (body.keys) {
      for (const key of body.keys) {
        this.publicKeys.set(key.kid, getPem(key.n, key.e));
      }

      return;
    }
  }

  throw new Error('Failed to retrieve keys from URI');
};

internals.verify = async (token, config) => {
  const { jwkUri, audience, issuer } = config;
  const decoded = jwt.decode(token, { complete: true });
  const { header: { jwtKid } } = await this.tokenSchema.validateAsync(decoded);

  if (!this.publicKeys.has(jwtKid)) {
    await this.retrievePublicKeys(jwkUri, jwtKid);

    if(!this.publicKeys.has(jwtKid)) {
      throw new Error('Failed to retrieve valid public key for jwt key identifier');
    }
  }

  const publicKey = this.publicKeys.get(jwtKid);
  return await new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, { algorithms: ['RS256'], audience, issuer }, (error, decoded) => {
      if (error !== null) {
        return reject(error);
      }

      resolve(decoded);
    })
  });
};

module.exports = internals;
