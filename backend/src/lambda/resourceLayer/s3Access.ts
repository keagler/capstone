import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import * as uuid from 'uuid';
import { createLogger } from '../../utils/logger';


const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  });

const logger = createLogger("s3Access");

const imagesBucketName = process.env.REMINDER_IMAGES_S3_BUCKET;
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRTION);

export class S3Acceess 
{
 
 async getUploadImageUrl(reminderId:string): Promise<string> {
  
  logger.info("getUploadImageUrl is caled. reminderId:",{reminderId});

  const imageId =  uuid.v4();
  const imageS3Key = reminderId + "%" + imageId;

  const uploadUrl =  s3.getSignedUrl('putObject',{
       Bucket: imagesBucketName,
       Key: imageS3Key,
       Expires: urlExpiration
     });
   return uploadUrl;
 }

 async deleteImage(imageId: string): Promise<void> {
   logger.info("deleteImage is called.",{imageId});
    await s3.deleteObject({
      Bucket: imagesBucketName,
      Key: imageId
    }).promise();
 }
 
}