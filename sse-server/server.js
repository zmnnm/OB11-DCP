const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsPushover = require('js-pushover');
const fs = require('node:fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let clients = [];
let cafeStatus = 'Zárva';
let poAdd = [];

//prepare pushover
async function prepover() {
    const proxyUrl = "https://corsproxy.io/";
    const backgroundTxtUrl = "https://lisy.ahrt.hu/documents/OB_API_DOKU/filename_OB11.txt";
    const poapi = "a9fvkphtymjafwnqaeq5krduv1gut7";

    try {
        let response = await fetch(proxyUrl + backgroundTxtUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        let fileContent = await response.text();
		fileContent = fileContent.replace(/[\r\n]+/g, '').trim();
        poAdd = fileContent.split("@");
        console.log("Split Result:");
        console.log("CP link: ", poAdd[0]);
        console.log("Sound tech ID: ", poAdd[1]);
        console.log("Tech ID: ", poAdd[2]);
        console.log("EIC ID: ", poAdd[3]);
        return poAdd;
    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
}

prepover();

//sse connection
app.get("/sse", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    console.log("New SSE connection established");
    clients.push(res);
    req.on("close", () => {
        clients = clients.filter(client => client !== res);
    });
});


// Message Sender Endpoint
app.post('/send', (req, res) => {
    const { message, status } = req.body;
    console.log("Received data:", req.body);
    let isImage = false;
    const payload = { message, status };
    console.log("Sending to clients:", payload);
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(payload)}\n\n`);
    });
    res.status(200).json({ success: true });
    poSend(message);
});

//RELOAD ALL CLIENT
app.post('/reload', (req, res) => {
    const { message, status, cmd } = req.body;
    console.log("Received command:", req.body);
    let isImage = false;
    const payload = { message, status, cmd };
    console.log("Sending to clients:", payload);
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(payload)}\n\n`);
    });
    res.status(200).json({ success: true });
});

//ISOLATED MESSEGE TO SOUND TECH
app.post('/isomic', (req, res) => {
    if (poAdd[1]!="-") {
    const { message, status } = req.body;
    console.log("Sending isolated messege to sound tech: ", message);
    const jsPushoverObj = {
        token: poapi,
        user: poAdd[1],
        message: message,
        title: "OB4",
      };
    jsPushover.Push(jsPushoverObj)
    res.status(200).json({ success: true });
    } else {
        console.log("Sending failed, no ID found");
    }
});

//ISOLATED MESSEGE TO TECH
app.post('/isotech', (req, res) => {
    if (poAdd[2]!="-") {
    const { message, status } = req.body;
    console.log("Sending isolated messege to Mic: ", message);
    const jsPushoverObj = {
        token: poapi,
        user: poAdd[2],
        message: message,
        title: "OB4",
      };
    jsPushover.Push(jsPushoverObj)
    res.status(200).json({ success: true });
    } else {
        console.log("Sending failed, no ID found");
    }
});

//ISOLATED MESSEGE TO EIC
app.post('/isoeic', (req, res) => {
    if (poAdd[3]!="-") {
    const { message, status } = req.body;
    console.log("Sending isolated messege to EIC: ", message);
    const jsPushoverObj = {
        token: poapi,
        user: poAdd[3],
        message: message,
        title: "OB4",
      };
    jsPushover.Push(jsPushoverObj)
    res.status(200).json({ success: true });
    } else {
        console.log("Sending failed, no ID found");
    }
});

//PUSHOVER SEND
async function poSend(msg) {
    poAdd.slice(1).forEach(element => {
		if (element!="-") {
        const jsPushoverObj = {
        token: poapi,
        user: element,
        message: msg,
        title: "OB4",
		};
		jsPushover.Push(jsPushoverObj)
    } else {
        return;
    }
    });
}

app.post('/cafe-status', (req, res) => {
    cafeStatus = cafeStatus === "Nyitva" ? "Zárva" : "Nyitva";
    console.log(`Café status toggled: ${cafeStatus}`);
    clients.forEach(client => {
        client.write(`data: {"status": "${cafeStatus}"}\n\n`);
    });
	//postData("https://lisy.ahrt.hu/cgi-bin/mtarsadat.exe?kavezo=KK11-"+cafeStatus);
    res.status(200).json({ success: true, status: cafeStatus });
});

async function postData(url = '') {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: JSON.stringify("Hello")
    });
    return await response;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

app.get('/fetch-pdf', async (req, res) => {
    const pdfUrl = req.query.url;
    if (!pdfUrl) {
        return res.status(400).send('Missing PDF URL');
    }

    try {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(buffer));
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).send('Error fetching PDF');
    }
});

app.listen(port, () => {
    console.log(`SSE server running on http://localhost:${port}`);
});
