export const toApiAuthUser = (user: data.User): api.AuthUser => {
  return {
    id: user.userId.toString(),
    email: "anthony@siliconrhino.io",
    firstName: "todo",
    lastName: "todo",
  };
};
