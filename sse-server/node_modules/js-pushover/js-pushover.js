"use strict";
/*js-pushover is a simple Pushover (https://pushover.net) library
and is not written or supported by Superblock (the creators of Pushover).
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
function paramQueryParse(pushoverMsg) {
    let bodyParsed = "";
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
function Push(pushoverMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pushoverMsg.hasOwnProperty("token") ||
            !pushoverMsg.hasOwnProperty("user") ||
            !pushoverMsg.hasOwnProperty("message")) {
            console.log(`Error: Must supply token, user and message properties.`);
            return false;
        }
        const pushoverURL = "https://api.pushover.net/1/messages.json";
        let pushoverResponse = yield node_fetch_1.default(pushoverURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: paramQueryParse(pushoverMsg)
        });
        let resData = yield pushoverResponse.json();
        console.log(`pushover Response: ${JSON.stringify(resData)}`);
        if (resData.status === 1) {
            console.log("pushover Notification Success");
            return true;
        }
        else {
            console.log("pushover Notification Failure");
            return false;
        }
    });
}
exports.Push = Push;
