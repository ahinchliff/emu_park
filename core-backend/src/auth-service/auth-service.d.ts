declare namespace core.backend {
  interface IAuthService {
    decodeJWT(
      token: string,
      logger: core.backend.Logger
    ): Promise<
      | {
          userId: number;
        }
      | undefined
    >;
  }
}
