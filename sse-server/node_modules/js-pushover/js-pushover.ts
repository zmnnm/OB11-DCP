/*js-pushover is a simple Pushover (https://pushover.net) library
and is not written or supported by Superblock (the creators of Pushover).
 */

import fetch from "node-fetch";

interface pushoverItem {
  token: string;
  user: string;
  message: string;
  device: string;
  title: string;
  url: string;
  url_title: string;
  priority: string;
  sound: string;
  timestamp: string;
  [key: string]: string;
}

function paramQueryParse(pushoverMsg: pushoverItem) {
  let bodyParsed: string = "";
  for (let key in pushoverMsg) {
    if (bodyParsed.length > 0) {
      bodyParsed += "&";
    }
    bodyParsed += key;
    bodyParsed += "=";
    bodyParsed += encodeURIComponent(pushoverMsg[key]);
  }
  return bodyParsed;
}

export async function Push(pushoverMsg: pushoverItem) {
  if (
    !pushoverMsg.hasOwnProperty("token") ||
    !pushoverMsg.hasOwnProperty("user") ||
    !pushoverMsg.hasOwnProperty("message")
  ) {
    console.log(`Error: Must supply token, user and message properties.`);
    return false;
  }
  const pushoverURL = "https://api.pushover.net/1/messages.json";
  let pushoverResponse = await fetch(pushoverURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: paramQueryParse(pushoverMsg)
  });
  let resData = await pushoverResponse.json();
  console.log(`pushover Response: ${JSON.stringify(resData)}`);
  if (resData.status === 1) {
    console.log("pushover Notification Success");
    return true;
  } else {
    console.log("pushover Notification Failure");
    return false;
  }
}
