


const extractTokensAndCsrf = (req) => {
    const cookies = extractToken(req.headers);
    const csrfAndSeed = extractCSRFAndSeed(req.data)
    return {cookies,csrfAndSeed};
}

const extractToken = (headers) => {
    const tokens = {}
    const cookies =  headers['set-cookie'];
    console.log(cookies);
    for (const cookie of cookies) {
        if (cookie.startsWith('__RequestVerificationToken')) {
            const token = cookie.split(';')[0].split('=')[1];
            tokens['__RequestVerificationToken'] = token;
        }else if (cookie.startsWith('Nimble.App.SessionId')) {
            const sessionId = cookie.split(' ')[0];
            tokens['sessionid'] = sessionId;
        }
    }
    return tokens;
}

const extractCSRFAndSeed = (data) => {
    const result = {};
    const lines = data.split('\n');
    const targetLine = lines.find(line => line.includes('<input name="__RequestVerificationToken" type="hidden" value="'));
    const randomSeedLine  = lines.find(line => line.includes('<input id="RandomSeed" name="RandomSeed" type="hidden" value="'));
    if (targetLine) {
        result["csrf"] = targetLine.replace(/.*<input name="__RequestVerificationToken" type="hidden" value="([^"]+)".*/, '$1').replace("\r","");
    }else{
        console.log("CSRF token not found in the response data.");
        process.exit(1);
    }
    if (randomSeedLine) {
        result["RandomSeed"] = randomSeedLine.replace(/.*<input id="RandomSeed" name="RandomSeed" type="hidden" value="([^"]+)".*/, '$1').replace("\r","");
    }else {
        console.log("RandomSeed token not found in the response data.");
        process.exit(1);
    }
    return result;
}

const generatePayload = (csrfs,username,password,direction,remark) => {
    const pwd = (btoa("B" + csrfs.RandomSeed + "B") + btoa(password)).replace(/=/g, "XCBX");

    const payload = {
        __RequestVerificationToken: csrfs.csrf,
        LoginID: username,
        LoginPassword: pwd,
        Direction: direction,
        Remark: remark,
        RandomSeed: csrfs.RandomSeed,
        IsWorkFromHome: "True",
    }
    return payload;
}

export {extractTokensAndCsrf, generatePayload}