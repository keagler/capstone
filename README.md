# Serverless Sample Reminder App
Simply plan and store informations about your daily reminders.

# Features

- Add/Update Reminder
- Delete Reminder
- Add Image To a Reminder
- Show Reminder Images

# How to run the application

## Backend

To deploy application run the following commands:

```
cd backend
npm install
sls deploy -v
```


## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

# Screenshots

### Index Before Login

![Alt text](images/application/1-WelcomePageBeforeLogin.png?raw=true "Before Login")

### Index After Login

![Alt text](images/application/2-AfterLoginShowReminders.png?raw=true "After Login")

### Create Travel

![Alt text](images/application/3-CreateAReminder.png?raw=true "Create Reminder")

### Update Travel

![Alt text](images/application/4-UpdatePageOfAReminder.png?raw=true "Update Reminder")

### Show Travel Images

![Alt text](images/application/5-UploadingImageOfAReminder.png?raw=true "Upload Reminder Images")

### Upload Travel Image

![Alt text](images/application/6-ShowImagesOfAReminder.png?raw=true "Show Reminder Image")
