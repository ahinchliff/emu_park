declare namespace core.backend {
  interface IAuthService {
    decodeJWT(
      token: string,
      logger: core.backend.Logger
    ): Promise<
      | { userId: number; authId: string; email: string; expiry: number }
      | undefined
    >;
    setUserIdOnAuthService(authId: string, userId: number): Promise<void>;
  }
}
