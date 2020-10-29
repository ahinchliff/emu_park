export const toApiAuthUser = (user: data.User): api.AuthUser => {
  return {
    id: user.userId.toString(),
    username: user.username,
  };
};
