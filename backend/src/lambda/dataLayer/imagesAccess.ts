import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../../utils/logger';
import { TravelImage } from '../../models/TravelImage';

const logger =  createLogger("imagesAccess");

const XAWS = AWSXRay.captureAWS(AWS);

export class ImagesAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly travelImagesTable = process.env.REMINDER_IMAGES_TABLE) {
   }
    
    async createTravelImage(travelImageRecord: TravelImage): Promise<TravelImage> {
        logger.info("createReminderImage calling............tableName:",{
            travelImageRecord,
            tableName:this.travelImagesTable
        });

        await this.docClient.put({
            TableName: this.travelImagesTable,
            Item: travelImageRecord
        }).promise();

        logger.info("createReminderImage called............tableName:",{
          travelImageRecord,
          tableName:this.travelImagesTable
        });

        return travelImageRecord;
    }

    async getReminderImages(travelId: string): Promise<TravelImage[]> {

        logger.info("getReminderImages is calling...........reminderId:", {travelId});

        const result = await this.docClient.query({
            TableName: this.travelImagesTable,
            KeyConditionExpression: 'travelId = :travelId',
            ExpressionAttributeValues: {
              ':travelId': travelId
            },
            ScanIndexForward: false
          }).promise();

          logger.info("getReminderImages is called...........reminderId:", {travelId});

          
        const items = result.Items;
        
        return items as TravelImage[];
    }

    async deleteTravelImages(travelId: string): Promise<void>{
      
      logger.info("deleteReminderImaeges is calling.............reminderId:",{travelId});

      await this.docClient.delete({
        TableName: this.travelImagesTable,
        Key: {
          "travelId": travelId
        }
      }).promise();

      logger.info("deleteReminderImaeges is called.............reminderId:",{travelId});

    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance');
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      });
    }
  
    return new XAWS.DynamoDB.DocumentClient();
  }