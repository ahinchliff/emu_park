import * as AWS from "aws-sdk";

export default class FileService implements core.IFileService {
  private s3: AWS.S3;
  constructor(
    private config: core.config.Config["bucketNames"],
    defaultRegion?: "eu-west-1"
  ) {
    if (defaultRegion) {
      AWS.config.update({ region: "eu-west-1" });
    }
    this.s3 = new AWS.S3();
  }

  private generateGetPreSignedUploadUrl = (bucketName: string) => (
    filePath: string
  ): core.PreSignedUrlData => {
    const data = this.s3.createPresignedPost({
      Bucket: bucketName,
      Fields: {
        Key: filePath,
      },
    });
    return (data as unknown) as core.PreSignedUrlData;
  };

  public getProfilePictureUploadUrl = this.generateGetPreSignedUploadUrl(
    this.config.profilePictures
  );
}
