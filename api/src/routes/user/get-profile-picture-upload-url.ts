import { AuthRequestHandler } from "../handlerBuilders";

const getProfilePictureUploadUrl: AuthRequestHandler<
  {},
  {},
  {},
  core.PreSignedUrlData
> = async ({ user, services }) => {
  return services.file.getProfilePictureUploadUrl(user.userId.toString());
};

export default getProfilePictureUploadUrl;
