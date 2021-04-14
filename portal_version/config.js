//---------------------------------------------Databases---------------------------------
const env = 1;

const NSM_DB_HOST = env ?   "localhost": process.env.npm_config_docDB || "172.18.0.2" 
const NSM_DB_PASS = ""
const NSM_DB_PORT = 3306
const NSM_DB_USER = "root"
const NSM_DB_NAME = "nsm"
console.log("NSM DB "+ NSM_DB_HOST)

const DOCTOR_DB_HOST = env ?   "localhost": process.env.npm_config_docDB || "172.18.0.2" 
const DOCTOR_DB_PASS = ""
const DOCTOR_DB_PORT = 3306
const DOCTOR_DB_USER = "root"
const DOCTOR_DB_NAME = "ic2_doctor"

const AUTH_DB_HOST =  env ?   "localhost": process.env.npm_config_authDB || "172.18.0.2" 
const AUTH_DB_PASS = ""
const AUTH_DB_PORT = 3306
const AUTH_DB_USER = "root"
const AUTH_DB_NAME = "ic2"

const SERVICE_DB_HOST =  env ?   "localhost": process.env.npm_config_serviceDB || "172.18.0.2" 
const SERVICE_DB_PASS = ""
const SERVICE_DB_PORT = 3306
const SERVICE_DB_USER = "root"
const SERVICE_DB_NAME = "db1"

//---------------------------------------------API Servers---------------------------------
const DOCTOR_PORT = process.env.PORT || 3004
const DOCTOR_IP = env ?  "localhost": process.env.npm_config_docIP || "172.18.0.4"
const DOCTOR_NAME = "DOCTOR"

const AUTH_PORT = process.env.PORT || 3005
const AUTH_IP = env ?  "localhost": process.env.npm_config_authIP || "172.18.0.5"
const AUTH_NAME = "AUTH"

//---------------------------------------------Client Servers---------------------------------
const C2_PORT = process.env.PORT || 3006;
const C2_IP = env ?  "localhost": process.env.npm_config_authIP || "172.26.3.171"
const C2_NAME = "c2"

//---------------------------------------------User Servers---------------------------------
const W1_PORT = process.env.PORT || 3000;
const W1_IP = env ?  "localhost": process.env.npm_config_authIP || "172.18.0.6"
const W1_NAME = "w1"

//---------------------------------------------Internal Servers---------------------------------
const S1_PORT = 3001;
const S1_IP =  env ?  "localhost": process.env.npm_config_S1IP || "172.18.0.7" 
const S1_NAME = "s1"

const S2_PORT = 3002;
const S2_IP =  env ?  "localhost": process.env.npm_config_S2IP ||"172.26.3.171"
const S2_NAME = "s2"

const S3_PORT = 3003;
const S3_IP =  env ?  "localhost": process.env.npm_config_S3IP ||"172.18.0.9"
const S3_NAME = "s3"

console.info("INFO : Server Configuration successfull")

module.exports={
    NSM_DB_HOST,
    NSM_DB_PASS,
    NSM_DB_PORT,
    NSM_DB_USER,
    NSM_DB_NAME,
    
    DOCTOR_DB_HOST,
    DOCTOR_DB_PASS,
    DOCTOR_DB_PORT,
    DOCTOR_DB_USER,
    DOCTOR_DB_NAME,

    AUTH_DB_HOST,
    AUTH_DB_PASS,
    AUTH_DB_PORT,
    AUTH_DB_USER,
    AUTH_DB_NAME,

    SERVICE_DB_HOST,
    SERVICE_DB_PASS,
    SERVICE_DB_PORT,
    SERVICE_DB_USER,
    SERVICE_DB_NAME,
    
    DOCTOR_PORT,
    DOCTOR_IP,
    DOCTOR_NAME,

    AUTH_PORT,
    AUTH_IP,
    AUTH_NAME,
    
    C2_PORT,
    C2_IP,
    C2_NAME,

    W1_PORT,
    W1_IP,
    W1_NAME,

    S1_PORT,
    S1_IP,
    S1_NAME,

    S2_PORT,
    S2_IP,
    S2_NAME,

    S3_PORT,
    S3_IP,
    S3_NAME
}