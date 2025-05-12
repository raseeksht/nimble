
import cron from 'node-cron';
import { SubmitAttendance } from './a.js';

console.log("cron job scheduled");

cron.schedule('0 23 * * *', async () => {
    SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,'Out')
    
    console.log('Out Attendance Submitted..');
});

cron.schedule('0 14 * * *', async () => {
    SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,'In')
    
    console.log('In Attendance Submitted..');
});


  
