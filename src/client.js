const fetch = require("node-fetch");

const BASE = "https://studio.twilio.com/v2";

const flowName = "a";
const webhook = process.env["TWILIO_SLACK_WEBHOOK"];

const a = {
  commitMessage: "Create",
  friendlyName: flowName,
  status: "published",
  definition: {
    description: "Send SMS directly to slack",
    states: [
      {
        name: "Trigger",
        type: "trigger",
        transitions: [
          {
            next: "post_to_slack",
            event: "incomingMessage",
          },
        ],
        properties: {
          offset: {
            x: 0,
            y: 0,
          },
        },
      },
      {
        name: "post_to_slack",
        type: "make-http-request",
        transitions: [],
        properties: {
          offset: {
            x: -185,
            y: 255,
          },
          method: "POST",
          content_type: "application/json;charset=utf-8",
          body: '{"text":  "{{trigger.message.From}} | {{trigger.message.Body}}"}',
          url: webhook,
        },
      },
    ],
    initial_state: "Trigger",
    flags: {
      allow_concurrent_calls: true,
    },
  },
};

class TwilioClient {
  setCredentials(sid, token) {
    this.sid = sid;
    this.token = token;
  }

  toUrl(endpoint) {
    return `${BASE}/${endpoint}`;
  }

  async post(endpoint, body) {
    const url = this.toUrl(endpoint);
    const headers = {};
    headers["Authorization"] =
      "Basic " + Buffer.from(this.sid + ":" + this.token).toString("base64");
    return fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  }

  async createFlow() {
    return this.post("Flows");
  }
}

module.exports = new TwilioClient();
