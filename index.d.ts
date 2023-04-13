declare module '@timondev/azure-jwt-verify' {
  export default {
    verify: (token: string, config: {
      jwkUri: string,
      audience: string,
      issuer: string,
    }) => Promise<any>,
  }
}