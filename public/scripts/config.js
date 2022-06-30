const PORT = 8080;
const ENVIROMENT = "LOCAL";
//const ENVIROMENT = "HEROKU";


let BASEURL = '';

if (ENVIROMENT == "LOCAL")
    BASEURL = `http://localhost:${PORT}/api`;
else
    BASEURL = `something`;
