import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { getUserReminder, getUploadImageUrl } from '../businessLogic/travels';
import { getUserId } from '../utils';

const logger = createLogger("generateUploadImageUrl");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    logger.info("generateUploadImageUrl event started.",{event});

    const userId = getUserId(event);
    const reminderId = event.pathParameters.reminderId;
    const reminder = await getUserReminder(reminderId, userId);
    
    if(!reminder){
        return {
            statusCode: 404,
            body: JSON.stringify({
              error: 'Reminder does not exist with reminderId:'+reminderId
            })
          };
    }else{
        const uploadUrl =  await getUploadImageUrl(reminderId);
        return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            uploadUrl
        })
        };
    }
}
