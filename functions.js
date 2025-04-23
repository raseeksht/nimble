import axios from 'axios';
import { generatePayload ,extractTokensAndCsrf} from './utils.js';

const login = async (username,password,session,config={}) => {
    const url = "https://cloudtechservice.nimbleerp.com/Security/Account/Login";
    const payload = generatePayload(session.csrfAndSeed,username,password,'In','test');
    config.headers['cookie'] = `${session.cookies.sessionid} __RequestVerificationToken=${session.cookies.__RequestVerificationToken}`;
    payload['ReturnUrl'] = "/common/selfservice/dashboard?ckedmenuid=menu.selfservice.dashboard";

    
    const resp = await axios.post(url,payload,config);
    // console.log(resp.data);
    return resp
}

const getreq = async (url,config) => {

    const res = await axios.get(url,config)
    return res;
}


export {login,getreq};