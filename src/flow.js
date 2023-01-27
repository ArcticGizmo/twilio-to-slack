async function createFlow(client, webhook, flowName) {
  console.log(`Creating flow - '${flowName}'`);
  await client.studio.v2.flows.create({
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
  });
  console.log("... complete");
}

async function updateFlow(client, webhook, flowName, sid) {
  console.dir(client.studio.v1.flows);
}

async function findSid(client, flowName) {
  const flows = await client.studio.v2.flows.list();
  for (const f of flows) {
    if (f.friendlyName === flowName) {
      return f.sid;
    }
  }
}

async function generate(client, webhook, flowName) {
  const sid = await findSid(client, flowName);

  // determine if it should create or replace instance
  return sid
    ? updateFlow(client, webhook, flowName, sid)
    : createFlow(client, webhook, flowName);
}

exports.createFlow = generate;
