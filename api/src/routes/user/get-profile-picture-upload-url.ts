import { AuthRequestHandler } from "../handlerBuilders";

const getProfilePictureUploadUrl: AuthRequestHandler<
  {},
  {},
  {},
  core.backend.PreSignedUrlData
> = async () => {
  // return services.file.getProfilePictureUploadUrl(user.userId.toString());
  return '' as any;
};

export default getProfilePictureUploadUrl;
