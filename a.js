import axios from 'axios';
import fs from 'fs';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { extractTokensAndCsrf,generatePayload } from './utils.js';
import { getreq, login } from './functions.js';

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome',
    }
}



const SubmitAttendance = async (username,password,direction) => {
    // const username = '31';
    // const password = 'S21@';
    // const direction = 'Out';
    try{
        const remark = 'attendance';
        const res  = await axios.get('https://cloudtechservice.nimbleerp.com/');
        const session = extractTokensAndCsrf(res);
        const payload = generatePayload(session.csrfAndSeed, username, password, direction, remark);
        config.headers['cookie'] = `${session.cookies.sessionid} __RequestVerificationToken=${session.cookies.__RequestVerificationToken}`;
        
        const url = "https://cloudtechservice.nimbleerp.com/Attendance/QuickAttendanceRequest/QuickAttendance";
        
        
        
        const resp = await axios.post(url,payload,config);
        console.log(resp.data);
        fs.writeFileSync("a.txt",JSON.stringify(resp.data))
        return resp.data
    }
    catch(e){
        // return {}
        console.log(e)
    }

}


const doLogin = async () => {
    const result  = await axios.get('https://cloudtechservice.nimbleerp.com/');
    const session = extractTokensAndCsrf(result);
    const res = await login('122',"ssss21",session,config);
    console.log(res.data)

    // const attendanceUrl = "https://cloudtechservice.nimbleerp.com/Attendance/Reports/GetDailyReport?DateFrom=2082%2F01%2F01&DateTo=2082%2F01%2F31&AttendanceStatus=-1&LogEntries=In&TimeFrom=&TimeTo=&ischeckResigned=false&EmpCode=E00031&WorkingStatusID=1&WorkingStatusID=4&WorkingStatusID=8"
    // const r = await getreq(attendanceUrl,config);
    // console.log(r.data.Object)

}

function capitalize(string) {
    if (!string) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const direction = capitalize(process.argv[2])

if (process.argv[1] === __filename) {
    SubmitAttendance(process.env.CLOUDUSERNAME, process.env.PASSWORD, direction);
}
// SubmitAttendance(process.env.CLOUDUSERNAME,process.env.PASSWORD,direction)

// doLogin();


export {SubmitAttendance}