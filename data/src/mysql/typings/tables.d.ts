declare namespace data {
  type UserColumns = "userId" | "authId" | "createdAt" | "updatedAt";

  interface ITables {
    user: { [key in UserColumns]: unknown };
  }
}
