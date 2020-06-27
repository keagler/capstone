import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { SNSHandler, SNSEvent } from 'aws-lambda';
import { TravelImage } from '../../models/TravelImage';
import { createTravelImage } from '../businessLogic/travels';


const logger = createLogger('imageTopicProcessor');
//const bucketName = process.env.TRAVEL_IMAGES_S3_BUCKET;

export const handler: SNSHandler = async(event: SNSEvent) => {
    logger.info('Processing SNS event',{
        event
    });
    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message;
        logger.info('Processing S3 event', {s3EventStr});
        const s3Event = JSON.parse(s3EventStr);
        for (const record of s3Event.Records) {
          const imageBucketId: string = record.s3.object.key;
          const tokens = imageBucketId.split("%");
          const travelId = tokens[0];
          const imageId = tokens[1];
          const travelImageRecord : TravelImage = {travelId,imageId};
          const travelImage = await createTravelImage(travelImageRecord);
          logger.info("travelImage record created. ", {travelImage});
        }
    }
}