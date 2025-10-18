import axios from 'axios';
import { generatePayload ,extractTokensAndCsrf} from './utils.js';

const axiosInstance = axios.create({
  baseURL: "https://cloudtechservice.nimbleerp.com",
  withCredentials: true,
});

const login = async (username,password,session,config={}) => {
    const url = "/Security/Account/Login";
    const payload = generatePayload(session.csrfAndSeed,username,password,'In','test');
    config.headers['cookie'] = `${session.cookies.sessionid} __RequestVerificationToken=${session.cookies.__RequestVerificationToken}`;
    payload['ReturnUrl'] = "/common/selfservice/dashboard?ckedmenuid=menu.selfservice.dashboard";

    const resp = await axiosInstance.post(url,payload,config);
    // const resp = await axios.post(url,payload,config);
    return resp
}

const getreq = async (url,config) => {

    const res = await axios.get(url,config)
    return res;
}


export {login,getreq,axiosInstance};