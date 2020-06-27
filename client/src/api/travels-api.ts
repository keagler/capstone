import { apiEndpoint } from '../config'
import { Travel } from '../types/Travel';
import Axios from 'axios';
import { TravelImage } from '../types/TravelImage';

export async function getReminders(idToken: string): Promise<Travel[]> {
    console.log('Fetching reminders')
  
    const response = await Axios.get(`${apiEndpoint}/reminders`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    });
    console.log('Reminders:', response.data);
    return response.data.items;
}

export async function getTravelImages(idToken: string,reminderId: string): Promise<TravelImage []> {
  console.log('Fetching reminders images')

  const response = await Axios.get(`${apiEndpoint}/images/${reminderId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  });
  console.log('Reminder Images:', response.data);
  return response.data.items;
}

export async function deleteReminder(idToken: string, reminderId: string): Promise<void> {
  
  console.log("Deleting reminder. reminderId : " + reminderId);

  const response = await Axios.delete(`${apiEndpoint}/reminders/${reminderId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });

  console.log("deleteReminder response : " + JSON.stringify(response.data));
}

export async function updateReminder(idToken: string, reminder: Travel): Promise<void>{
  console.log("UpdateReminder invoked. Reminder : " + JSON.stringify(reminder));

  const updateReminder = {
    plannedDate: reminder.plannedDate,
    location: reminder.location,
    description: reminder.description,
    duration: reminder.duration,
    isCompleted: reminder.isCompleted
  };

  await Axios.patch(`${apiEndpoint}/reminders/${reminder.id}`, JSON.stringify(updateReminder), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
}

export async function createReminder(idToken: string, reminder: Travel): Promise<void>{
  console.log("createReminder invoked. Reminder: " + JSON.stringify(reminder));
  
  const newReminder = {
    plannedDate: reminder.plannedDate,
    location: reminder.location,
    description: reminder.description,
    duration: reminder.duration
  }

  await Axios.post(`${apiEndpoint}/reminders`,  JSON.stringify(newReminder), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
}

export async function getUploadUrl(idToken: string,  reminderId: string): Promise<string> {
  
  console.log('getUploadUrl called with reminderId:'+reminderId)

  const response = await Axios.post(`${apiEndpoint}/reminders/${reminderId}/image`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  return response.data.uploadUrl;
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
