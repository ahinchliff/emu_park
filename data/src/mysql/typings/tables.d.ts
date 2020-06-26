declare namespace data {
  type UserColumns = "userId" | "authId" | "email" | "createdAt" | "updatedAt";

  interface ITables {
    user: { [key in UserColumns]: unknown };
  }
}
