import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
import { Travel } from '../../models/Travel';
import { getUserReminder, getReminderImages } from '../businessLogic/travels';

const logger = createLogger("getTravelImages");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    logger.info('getReminderImages Processing event: ', {event});

    const userId = getUserId(event);
    const reminderId = event.pathParameters.reminderId;
    const reminder: Travel = await getUserReminder(reminderId,userId);
    
    if(!reminder){
        
        logger.error("Reminder not found",{reminderId});
        
        return {
            statusCode: 404,
            headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
            },
            body: "Reminder not found with reminderId:" + reminderId
        };
    }
    
    const items = await getReminderImages(reminderId);
    
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          items
        })
      }
}