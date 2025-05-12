
import cron from 'node-cron';
import { SubmitAttendance } from './a.js';
import axios from 'axios';

console.log("cron job scheduled");

cron.schedule('0 23 * * *', async () => {
    const resp = await SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,'Out')
    discord(resp)
    console.log('Out Attendance Submitted..');
});

cron.schedule('0 14 * * *', async () => {
    const resp = await SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,'In')
    discord(resp)
    console.log('In Attendance Submitted..');
});


const discord = async (msg) => {
    const res = await axios.post(process.env.WEBHOOK,{content:JSON.stringify(msg)});
    console.log(res.data)
}

// const main = async () => {
//     discord(await SubmitAttendance('a','b','c'));

// }
// main();