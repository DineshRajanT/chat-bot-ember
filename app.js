const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');
const axios = require('axios');
require('dotenv').config();

const app = express();
var query;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ensure that your pusher credential are properly set in the .env file  
const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_APP_KEY,
	secret: process.env.PUSHER_APP_SECRET,
	cluster: process.env.PUSHER_APP_CLUSTER,
	encrypted: true
});

const dialogFlowURL = "https://api.dialogflow.com/v1/query?v=20150910";

const t1 = process.env.DEVELOPER_ACCESS_TOKEN;//events

const t2 = process.env.DEVELOPER_ACCESS_TOKEN1;//general

const t3 = process.env.DEVELOPER_ACCESS_TOKEN2;//banking

const t4= process.env.DEVELOPER_ACCESS_TOKEN3;//car

const t5= process.env.DEVELOPER_ACCESS_TOKEN4;//small talk

app.set('port', process.env.PORT || 3000);
app.post('/dialogue', (req, res) => {
	const data = {
		query: req.body.text,
		lang: 'en',
		sessionId: '1234567890!@#$%^&*()'
	}
var token;
var x=data.query;
var ch=x.charAt(0);
if(ch=='$')
	token=t1;
else if(ch=='@')
	token=t2;
else if(ch=='*')
	token=t3;
else if(ch=='&')
	token=t4;
else if(ch=='^')
	token=t5;


//	query = '$kashfkjshlsaif'
//	dollar = query.split('$');
//	hash = query.split('#');
//if(dollar.length > 1)


	//console.log(data);
	
	axios.post(`${dialogFlowURL}`, data, { headers: { Authorization: `Bearer ${token}` } })
		.then(response => {
			const responseData = {
				query: data.query,
				speech: response.data.result.fulfillment.speech
			};
			//console.log(response);
			console.log(responseData);
			pusher.trigger('bot', 'bot-response', responseData);
		})
})   

app.listen(app.get('port'), () => {
	console.log("Listening on " + app.get('port'));
})