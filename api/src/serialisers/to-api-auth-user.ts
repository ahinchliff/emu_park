export const toApiAuthUser = (user: data.User): api.AuthUser => {
  return {
    id: user.userId,
    username: user.username,
  };
};
