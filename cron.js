
import cron from 'node-cron';
import { SubmitAttendance } from './a.js';
import axios from 'axios';
import cronstrue from 'cronstrue';

const inCron = '0 14 * * 1,2';
const outCron = '4 23 * * 1,2';

console.log("cron job scheduled");
console.log(cronstrue.toString(inCron),'In time')
console.log(cronstrue.toString(outCron),"Out Time")

cron.schedule(outCron, async () => {
    const resp = await SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,'Out')
    discord(resp)
    console.log('Out Attendance Submitted..');
});

cron.schedule(inCron, async () => {
    const resp = await SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,'In')
    discord(resp)
    console.log('In Attendance Submitted..');
});


const discord = async (msg) => {
    const res = await axios.post(process.env.WEBHOOK,{content:JSON.stringify(msg)});
    console.log(res.data)
}

const main = async () => {
    // discord(await SubmitAttendance('a','b','c'));
    // const resp = await SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,'In')


}