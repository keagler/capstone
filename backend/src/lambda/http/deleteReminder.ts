import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
import { getUserReminder, deleteReminder } from '../businessLogic/travels';

const logger = createLogger("deleteTravel");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    logger.info("delete event processing started.",{event});

    try
    {

        const reminderId = event.pathParameters.reminderId;
        const userId = getUserId(event);
        const reminder = await getUserReminder(reminderId,userId);

        if(!reminder){
          logger.error("Given reminder not found",{reminderId,userId});
            return {
              statusCode: 404,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
              body: "Given reminder not found reminderId:"+reminderId
            };
        }

        await deleteReminder(userId,reminderId);
        
        //await deleteTravelImages(travelId);
      }catch(e){
        logger.error("An error occured while deleting a reminder.", {e})
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: "An error occured please try again later."
        };
      }
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: ""
      };
}