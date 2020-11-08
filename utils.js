const fs = require("fs");

// Constants and ENV Vars
const FILENAME = "state.json";
const FILLER_MEMBER = "XXXX";

// Common modules
const btoa = function (str) {
  return Buffer.from(str).toString("base64");
};

const loadState = () => {
  const rawdata = fs.readFileSync(FILENAME);
  return JSON.parse(rawdata);
};

const saveState = (stateJSON) => {
  const stateJSONString = JSON.stringify(stateJSON, null, 2);
  fs.writeFileSync(FILENAME, stateJSONString);
};

const nextPRCaptain = (prevCaptain, teamMembers) => {
  const nextUp = teamMembers.filter((member) => member != prevCaptain);
  return nextUp[Math.floor(Math.random() * (nextUp.length - 0))];
};

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getPairs(buddies, previousBuddies) {
  let pairs = previousBuddies;

  // make sure this week buddy pairs are different from previous week's
  // while (pairs == previousBuddies) {
  // pairs = "";

  buddies = shuffle(buddies);
  buddies = buddies.reduce((result, _value, index, array) => {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);

  // }
  return buddies;
}

const pairUpBuddies = (nextCaptain, teamMembers, previousBuddies) => {
  let buddies = teamMembers.filter((member) => member != nextCaptain);
  let pairs;

  if (buddies.length % 2 == 0) {
    pairs = getPairs(shuffle(buddies), previousBuddies);
  } else {
    // filler to make array size even to generate pairs
    buddies.push(FILLER_MEMBER);
    pairs = getPairs(shuffle(buddies), previousBuddies);

    // array of pairs(array)
    pairs = pairs.forEach((pair) => {
      pair = pair.map(function (x) {
        return x.replace(FILLER_MEMBER, nextCaptain);
      });
    });
  }

  return pairs;
};

module.exports = {
  btoa,
  nextPRCaptain,
  pairUpBuddies,
  loadState,
  saveState,
};
