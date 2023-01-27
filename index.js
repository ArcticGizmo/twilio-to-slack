const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const { createFlow } = require("./src/flow.js");
const createClient = require("twilio");
const TwilioClient = require("./src/client.js");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const webhook = process.env.TWILIO_SLACK_WEBHOOK;
const flowName = process.env.TWILIO_FLOW_NAME;

if (!accountSid) {
  throw "TWILIO_ACCOUNT_SID required";
}

if (!authToken) {
  throw "TWILIO_AUTH_TOKEN required";
}

if (!webhook) {
  throw "TWILIO_SLACK_WEBHOOK required";
}

if (!flowName) {
  throw "TWILIO_FLOW_NAME required";
}

// const client = createClient(accountSid, authToken);

// await createFlow(client, webhook, flowName);

async function run() {
  // const header = new Headers();
  // headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));
  // fetch('https://api.twilio.com/2010-04-01/Accounts', {
  //   method: ''
  // })

  TwilioClient.setCredentials(accountSid, authToken);
  const resp = await TwilioClient.createFlow();
  console.dir(resp);
}

run();
