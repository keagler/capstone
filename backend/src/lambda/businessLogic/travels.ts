import * as uuid from 'uuid';

import { createLogger } from '../../utils/logger';
import { Travel } from '../../models/Travel';
import { CreateTravelRequest } from '../../requests/CreateTravelRequest';
import { TravelsAccess } from '../dataLayer/travelsAccess';
import { UpdateTravelRequest } from '../../requests/UpdateTravelRequest';
import { ImagesAccess } from '../dataLayer/imagesAccess';
import { TravelImage } from '../../models/TravelImage';
import { S3Acceess } from '../resourceLayer/s3Access';

const logger = createLogger('travels');
const travelsAccess = new TravelsAccess(); 
const imagesAccess = new ImagesAccess();
const s3Access = new S3Acceess();

export async function createReminder(newReminderRequest: CreateTravelRequest,userId: string): Promise<Travel> {
    
    logger.info("createReminder begininig.", {newReminderRequest});
    
    const reminderId = uuid.v4();

    return await travelsAccess.createReminder({
        id: reminderId,
        userId: userId,
        plannedDate: newReminderRequest.plannedDate,
        location: newReminderRequest.location,
        description: newReminderRequest.description,
        duration: newReminderRequest.duration,
        createdDate: new Date().toISOString(),
        isCompleted: false
      });
}

export async function updateReminder(updateReminderRequest: UpdateTravelRequest,reminderId: string, userId: string): Promise<void>{
    
    logger.info('updateReminder begining.........',{
        updateReminderRequest,
        reminderId,
        userId
      });

    return await travelsAccess.updateReminder(updateReminderRequest,reminderId,userId);
}

export async function getUserReminder(reminderId:string,userId:string): Promise<Travel>{
    
    logger.info("getUserReminder begining.....",{reminderId,userId});

    return await travelsAccess.getUserReminder(reminderId,userId);
}

export async function deleteReminder(userId: string, reminderId: string): Promise<void>{
    
    logger.info("deleteReminder beginging.....",{reminderId,userId});

    return await travelsAccess.deleteReminder(reminderId,userId);
}

/*
export async function getTravel(reminderId: string): Promise<Travel>{
    
    logger.info("getReminder begining.....reminderId:",{reminderId});

    return await travelsAccess.getTravel(reminderId);
}
*/

export async function getUploadImageUrl(reminderId:string): Promise<string>{
    logger.info("getUploadImageUrl is begining.....reminderId:", {reminderId});
    return await s3Access.getUploadImageUrl(reminderId);
}

export async function createTravelImage(travelImageRecord: TravelImage): Promise<TravelImage>{
    logger.info("createReminderImage is beginging....reminderImageRecord:",{travelImageRecord});
    return await imagesAccess.createTravelImage(travelImageRecord);
}

export async function getUserReminders(userId: string): Promise<Travel[]> {
    logger.info("getUserReminders beginging........... userId:",{userId});
    return await travelsAccess.getUserReminders(userId);
}

export async function getReminderImages(reminderId: string): Promise<TravelImage[]> {
    logger.info("getReminderImages is begin reminderId:", {reminderId});
    return await imagesAccess.getReminderImages(reminderId);
}

export async function deleteTravelImages(reminderId: string): Promise<void>{
    
    logger.info("deleteReminderImages is begining.............reminderId:",{reminderId});

    const images: TravelImage[] = await getReminderImages(reminderId);

    for (let index = 0; index < images.length; index++) {
        const travelImage: TravelImage = images[index];
        const imageId = travelImage.travelId+ "%"+travelImage.imageId;
        await s3Access.deleteImage(imageId);
    }
    return await imagesAccess.deleteTravelImages(reminderId);
    
}