const {
  btoa,
  nextPRCaptain,
  pairUpBuddies,
  loadState,
  saveState,
} = require("./utils");

const { WebClient } = require("@slack/web-api");
var axios = require("axios");

const { log } = console;

// Jira
const SPRINT_BOARD_ID = "12345";
const jiraBasicAuthToken =
  `${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}` ||
  "jira_credentials_not_provided";

// Slack
const token = process.env.SLACK_TOKEN || "slack_token_not_provided";
const web = new WebClient(token);
const channelId =
  process.env.SLACK_CHANNEL_ID || "slack_channel_id_not_provided";

// Slack modules
const formatSlackMessage = (captain, buddies, teamMembersIDs) => {
  let msg = `Happy Monday Team,\nPR Reviews Captain for this sprint: <@${teamMembersIDs[captain]}>`;
  msg += "\nAnd your Review Buddies for this sprint:";

  const buddiesString = buddies
    .map((pair) => {
      return `<@${teamMembersIDs[pair[0]]}> and <@${teamMembersIDs[pair[1]]}>`;
    })
    .join("\n");

  return `${msg}\n${buddiesString}`;
};

// JIRA modules
const sprintCheck = async (lastExecutedAt) => {
  var config = {
    method: "get",
    url: `https://yourDomain.atlassian.net/rest/agile/1.0/board/${SPRINT_BOARD_ID}/sprint?state=active`,
    headers: {
      Authorization: `Basic ${btoa(jiraBasicAuthToken)}`,
    },
  };

  try {
    const response = await axios(config);
    log(JSON.stringify(response.data));

    let startDate = new Date(response.data.values[0].startDate);
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date(response.data.values[0].endDate);
    endDate.setHours(0, 0, 0, 0);

    let lastExecutedAtDate = new Date(lastExecutedAt);
    lastExecutedAtDate.setHours(0, 0, 0, 0);

    return (startDate <= lastExecutedAtDate) && (lastExecutedAtDate <= endDate);

  } catch (err) {
    log(err);
    return true;
  }
};

// Driver function
const getBuddies = async () => {
  const previousState = loadState();

  const { teamMembersIDs, previousCaptain, previousBuddies, lastExecutedAt } = previousState;
  log("\nLast Sprint Schedule:");
  log(previousState);

  const doNotExecute = await sprintCheck(lastExecutedAt);
  if ((lastExecutedAt != "") && doNotExecute) {
    log("\nNo need to reschedule yet, will check again tomorrow!\n");
    return;
  }

  log("\nNew Review Buddies!!!\n");

  const teamMembers = Object.keys(teamMembersIDs);
  const nextCaptain = nextPRCaptain(previousCaptain, teamMembers);
  const nextBuddies = pairUpBuddies(nextCaptain, teamMembers, previousBuddies);

  const currentSchedule = {
    teamMembersIDs,
    previousCaptain: nextCaptain,
    previousBuddies: nextBuddies,
    lastExecutedAt: new Date().toISOString()
  };
  log("\nThis week:");
  log(currentSchedule);
  saveState(currentSchedule);
  log("State saved");

  const msg = formatSlackMessage(nextCaptain, nextBuddies, teamMembersIDs);
  log(msg);

  // See: https://api.slack.com/methods/chat.postMessage
  const res = await web.chat.postMessage({
    channel: channelId,
    text: msg,
    as_user: true,
  });
  // `res` contains information about the posted message
  log("Schedule message sent to slack: ", res.ts);
};

getBuddies();
