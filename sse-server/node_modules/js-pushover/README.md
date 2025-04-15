# js-pushover  
js-pushover is a simple [Pushover](https://pushover.net) library and is not written or supported by Superblock (the creators of Pushover).

## Using js-pushover
Import jspushover into your JavaScript file. 

`const jsPushover = require('../js-pushover');`

Create object with following values (token, user and message are mandatory.  
(More information at [Pushover: API](https://pushover.net/api)).

```javascript
const jsPushoverObj = {
  token: "your Pushover token",
  user: "your Pushover user key",
  message: "message",
};
```

Additionally, you can add the following properties: device, title, url, url_title, priority, sound and timestamp.

```javascript
const jsPushoverObj = {
  token: "",
  user: "",
  message: "",
  device: "",
  title: "",
  url: "",
  url_title: "",
  priority: "",
  sound: "",
  timestamp: "",
};

```


Then call the js-pushover Push method:
`jsPushover.Push(jsPushoverObj)`

*Call will return true is successful and false if unsuccessful*