import * as AWS from "aws-sdk";

export default class FileService implements core.backend.IFileService {
  private s3: AWS.S3;
  constructor(
    // core.backend.config.Config["bucketNames"],
    private config: any,
    defaultRegion?: "ap-southeast-2"
  ) {
    if (defaultRegion) {
      AWS.config.update({ region: "ap-southeast-2" });
    }
    this.s3 = new AWS.S3();
  }

  private generateGetPreSignedUploadUrl = (bucketName: string) => (
    filePath: string
  ): core.backend.PreSignedUrlData => {
    const data = this.s3.createPresignedPost({
      Bucket: bucketName,
      Fields: {
        Key: filePath,
      },
    });
    return (data as unknown) as core.backend.PreSignedUrlData;
  };

  public getProfilePictureUploadUrl = this.generateGetPreSignedUploadUrl(
    this.config.profilePictures
  );
}
