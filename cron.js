
import { SubmitAttendance } from './a.js';
import axios from 'axios';

const allowedWeekdays = [1, 2, 3, 4, 5]; // Monday, Tuesday, Wednesday, Thursday, Friday (0 = Sunday)

const timeWindows = {
    In: { startHour: 13, startMinute: 55, endHour: 14, endMinute: 0 }, // 1:55 PM - 2:00 PM
    Out: { startHour: 23, startMinute: 0, endHour: 23, endMinute: 5 }, // 11:00 PM - 11:05 PM
};

const lastScheduledSlot = {
    In: null,
    Out: null,
};

const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1000; // UTC+5:45

const toNepalTime = (date) => {
    return date.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
};


const discord = async (msg,direction) => {
    await axios.post(process.env.WEBHOOK, {
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
                value: toNepalTime(new Date()),
                inline: true
                },
            ],
            // footer: {
            //     text: "Testing"
            // }
        }]
    });
}

const getRandomTimeSlot = (direction) => {
    const window = timeWindows[direction];
    const startTotal = (window.startHour * 60) + window.startMinute;
    const endTotal = (window.endHour * 60) + window.endMinute;
    const totalChoices = (endTotal - startTotal) + 1;

    let pickedTotal = startTotal + Math.floor(Math.random() * totalChoices);
    const previousTotal = lastScheduledSlot[direction];

    // Avoid picking the same time twice in a row when there are alternatives.
    if (totalChoices > 1 && previousTotal !== null && pickedTotal === previousTotal) {
        pickedTotal = startTotal + ((pickedTotal - startTotal + 1) % totalChoices);
    }

    lastScheduledSlot[direction] = pickedTotal;
    return {
        hour: Math.floor(pickedTotal / 60),
        minute: pickedTotal % 60,
    };
}

const getNextRunDate = (direction, fromDate = new Date()) => {
    // Shift so UTC fields represent Nepal time
    const fromNepal = new Date(fromDate.getTime() + NEPAL_OFFSET_MS);

    for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
        const candidate = new Date(fromNepal);
        candidate.setUTCDate(fromNepal.getUTCDate() + dayOffset);

        if (!allowedWeekdays.includes(candidate.getUTCDay())) {
            continue;
        }

        const { hour, minute } = getRandomTimeSlot(direction);
        candidate.setUTCHours(hour + 2, minute, 0, 0); // offset by 2 hours for 4pm - 1am

        if (candidate > fromNepal) {
            // Convert back to real time
            return new Date(candidate.getTime() - NEPAL_OFFSET_MS);
        }
    }

    throw new Error(`Could not find next run date for ${direction}`);
}

const scheduleNextAttendance = (direction, fromDate) => {
    const nextRun = getNextRunDate(direction, fromDate);
    const delay = nextRun.getTime() - Date.now();

    const totalMin = Math.round(delay / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    console.log(`${direction} scheduled for ${toNepalTime(nextRun)} (in ${h}h ${m}m)`);

    setTimeout(async () => {
        try {
            const resp = await SubmitAttendance(process.env.CLOUDUSERNAME, process.env.PASSWORD, direction);
            await discord(resp, direction);
            console.log(`${direction} Attendance Submitted..`);
        } catch (error) {
            console.error(`${direction} Attendance failed:`, error?.message || error);
        } finally {
            // Always schedule the next random run after this one finishes.
            // Compute tomorrow midnight in Nepal time, then convert to real time
            const nowNepal = new Date(Date.now() + NEPAL_OFFSET_MS);
            nowNepal.setUTCDate(nowNepal.getUTCDate() + 1);
            nowNepal.setUTCHours(0, 0, 0, 0);
            const tomorrow = new Date(nowNepal.getTime() - NEPAL_OFFSET_MS);
            scheduleNextAttendance(direction, tomorrow);
        }
    }, delay);
}

const main = async () => {
    scheduleNextAttendance('In');
    scheduleNextAttendance('Out');

}

main()

