import { AuthRequestHandler } from "../handlerBuilders";

const getProfilePictureUploadUrl: AuthRequestHandler<
  {},
  {},
  {},
  core.backend.PreSignedUrlData
> = async ({ user, services }) => {
  return services.file.getProfilePictureUploadUrl(user.userId.toString());
};

export default getProfilePictureUploadUrl;
