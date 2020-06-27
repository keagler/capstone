import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { Travel } from '../../models/Travel';
import { UpdateTravelRequest } from '../../requests/UpdateTravelRequest';
import { updateReminder, getUserReminder } from '../businessLogic/travels';
import { getUserId } from '../utils';
//import { getUserId } from '../utils';

const logger = createLogger('updateTravel');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
        
        logger.info("update event processing started.",{event});

        const reminderId = event.pathParameters.reminderId;
        const updateReminderRequest: UpdateTravelRequest = JSON.parse(event.body);
        const userId = getUserId(event);
        const reminder: Travel = await getUserReminder(reminderId,userId);

        if(!reminder)
        {
            
            logger.error("reminderId not found",{reminderId});

            return {
                statusCode: 404,
                headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
                },
                body: "Reminder Item not found"
            };
        }

        await updateReminder(updateReminderRequest,reminderId,userId);

        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: "update finished successfully"
        };
    }catch(e){
        logger.error("An error occured. ",{
            e
        });
        return {
        statusCode: 500,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: "An error occured please try again later."
        };
    }
  }