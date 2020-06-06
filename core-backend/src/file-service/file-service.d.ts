declare namespace core.backend {
  type PreSignedUrlData = {
    url: string;
    fields: {
      Key: string;
      bucket: string;
      "X-Amz-Algorithm": string;
      "X-Amz-Credential": string;
      "X-Amz-Date": string;
      "X-Amz-Security-Token": string;
      "X-Amz-Signature": string;
    };
  };

  interface IFileService {
    getProfilePictureUploadUrl(filePath: string): PreSignedUrlData;
  }
}
