# azure-jwt-verify

Verify JWT Token issued by Azure Active Directory B2C and automatically use the rotated public key from Azure Public Keys URL.

## Installation

* when using npm:
  ```sh 
  $ npm install --save @timondev/azure-jwt-verify
  ```

* when using yarn:
  ```sh
  $ yarn add @timondevazure-jwt-verify
  ```

## Configuration

* jwkUri and the issuer can be obtained from the metadata endpoint of the policies created in the B2C tenant.
* AUD(Audience) is the Client ID of the application accessing the tenant.

```javascript
const config = {
    jwkUri: "",
    issuer: "",
    audience: ""
};
```

## Usage

```javascript
const decoded = await azureJWT.verify(token, config);
```
