# PR-Review-Buddy

## Desc

Pull Requests - Review Buddy

Pairs up teammates for PR reviews every sprint

Basic API calls to JIRA and Slack

## How to run the project

- run `npm install` to install modules

- export env variables from terminal, for jira and slack API calls

```
export SLACK_TOKEN=xxx
export SLACK_CHANNEL_ID=yyy
export JIRA_TOKEN=xxx
export JIRA_EMAIL=abc@yourdomain.com
```

- run `npm run start`

```
➜  PRBuddy git:(master) npm run start

> prbuddy@1.0.0 start /Users/larumugam/Desktop/repos/PRBuddy
> node index.js


Last week:
{
  teamMembersIDs: {
    Aang: 'SlackID',
    Toph: 'SlackID',
    Sokka: 'SlackID',
    Kataara: 'SlackID',
    Zuko: 'SlackID'
  },
  previousCaptain: '',
  previousBuddies: []
}

This week:
{
  teamMembersIDs: {
    Aang: 'SlackID',
    Toph: 'SlackID',
    Sokka: 'SlackID',
    Kataara: 'SlackID',
    Zuko: 'SlackID'
  },
  previousCaptain: 'Toph',
  previousBuddies: [ [ 'Kataara', 'Aang' ], [ 'Zuko', 'Sokka' ] ]
}
State Saved to  state.json
Happy Monday Team,
PR Reviews Captain for this sprint: <@SlackID>
And Your Review Buddies for this sprint:
<@SlackID> and <@SlackID>
<@SlackID> and <@SlackID>
Schedule message sent to slack:  1604428906.004400
➜  PRBuddy git:(master) ✗
```

## Future work

- Get team member IDs from Github Teams <-> Slack
