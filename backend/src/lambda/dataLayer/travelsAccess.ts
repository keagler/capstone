import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../../utils/logger';
import { Travel } from '../../models/Travel';
import { UpdateTravelRequest } from '../../requests/UpdateTravelRequest';

const logger =  createLogger("travelsAccess");

const XAWS = AWSXRay.captureAWS(AWS);
//const reminderIdIndexName = process.env.REMINDER_ID_INDEX;
const userIdIndexName = process.env.USER_ID_INDEX;

export class TravelsAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly reminderTable = process.env.REMINDER_TABLE) {

        }

    async createReminder(reminder: Travel): Promise<Travel> {
        logger.info("createReminder function is called.",{
            reminder,
            tableName:this.reminderTable
        });
        
        await this.docClient.put({
            TableName: this.reminderTable,
            Item: reminder
        }).promise();

        return reminder;
    }

    async updateReminder(updateReminderRequest: UpdateTravelRequest,reminderId: string,userId: string) :Promise<void>{
        logger.info("updateReminder is called.",{updateReminderRequest,reminderId,userId});
        
        const result = await this.docClient.update({
        TableName:this.reminderTable,
        Key:{
            "id": reminderId,
            "userId": userId
        },
        UpdateExpression: "set #plannedDate = :plannedDate, #location = :location, #description = :description,#duration = :duration,#isCompleted= :isCompleted",
        ExpressionAttributeNames: {
            '#plannedDate': 'plannedDate',
            '#location': 'location',
            '#description': 'description',
            '#duration':'duration',
            '#isCompleted':'isCompleted'
        },
        ExpressionAttributeValues: {
            ":plannedDate": updateReminderRequest.plannedDate,
            ":location": updateReminderRequest.location,
            ":description": updateReminderRequest.description,
            ":duration": updateReminderRequest.duration,
            ":isCompleted": updateReminderRequest.isCompleted
        },
        }).promise();

        logger.info("updateReminder is completed.",{result});
    }

    async getUserReminder(reminderId: string,userId: string):Promise<Travel>{
        
        logger.info("getUserReminder function is called.",{reminderId,userId});

        const result = await this.docClient.query({
            TableName: this.reminderTable,
            KeyConditionExpression: 'id = :travelId and userId = :userId',
            ExpressionAttributeValues: {
              ':travelId': reminderId,
              ':userId'  : userId
            },
            ScanIndexForward: false
        }).promise();

        if(result.Items && result.Items.length > 0){
          return Promise.resolve(result.Items[0] as Travel);
        }
        else{
          return Promise.resolve(undefined);
        }
    }

    async deleteReminder(reminderId: string, userId: string): Promise<void> {
      logger.info("deleteReminder is called.", {reminderId,userId});
      await this.docClient.delete({
        TableName: this.reminderTable,
        Key: {
          "id": reminderId,
          "userId": userId
        }
      }).promise();
    }

    /*
    async getTravel(reminderId: string):Promise<Travel>{
            
      logger.info("getReminder function is called.",{reminderId});
      
      
      const result = await this.docClient.query({
        TableName: this.reminderTable,
        IndexName: reminderIdIndexName,
        KeyConditionExpression: 'id = :travelId',
        ExpressionAttributeValues: {
            ':id': reminderId
        }
      }).promise();
      if(result.Items && result.Items.length > 0){
        return Promise.resolve(result.Items[0] as Travel);
      }
      else{
        return Promise.resolve(undefined);
      }
    }
    */

    async getUserReminders(userId: string):Promise<Travel[]>{
      
      logger.info("getReminderUser is called............",{userId});

      logger.info(userIdIndexName);

      logger.info("end");
      
      const result = await this.docClient.query({
        TableName: this.reminderTable,
        IndexName: userIdIndexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
      }).promise();

      const items = result.Items;
      return items as Travel[];
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