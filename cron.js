
import cron from 'node-cron';
import { SubmitAttendance } from './a.js';
import axios from 'axios';
import cronstrue from 'cronstrue';

const inCron = '0 14 * * 1,2';
const outCron = '5 23 * * 1,2';


const discord = async (msg,direction) => {
    const res = await axios.post(process.env.WEBHOOK, {
        embeds: [{
            title: 'Attendance Status',
            description: `Response : ${msg?.Message || JSON.stringify(msg)}`,
            color: msg?.IsSuccess ? 0x00ff00 : 0xff0000, 
            fields: [
                {
                    name:'Direction',
                    value: direction,
                    inline:false
                },
                {
                name: "Time",
                value: new Date().toLocaleString(),
                inline: true
                },
            ],
            // footer: {
            //     text: "Testing"
            // }
        }]
    });
}

const initCronJob = async(expression,direction) => {
    const allowedDirections = ['In','Out'];
    if (!allowedDirections.includes(direction)){
        throw new Error(`Invalid Direction ${direction}`)
    }
    cron.schedule(expression, async () => {
        const resp = await SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,direction)
        discord(resp,direction)
        console.log(`${direction} Attendance Submitted..`);
    });
    console.log(cronstrue.toString(expression),`${direction} Time`)
}

const main = async () => {
    // discord(await SubmitAttendance('a','b','c'));
    // const resp = await SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,'In')
    initCronJob(inCron,'In');
    initCronJob(outCron,'Out');

}

main()

