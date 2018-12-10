const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
	secret: 'session',
	name: 'SID',
	cookie: { secure: false },
	resave: false,
	saveUninitialized: true,
}));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/create', (req, res) => {
	try {
		req.session.created = true;
		res.send();
	} catch (e) {
		console.error(e);
	}
});

app.get('/download', (req, res) => {
	console.log('download', req.session.created);
	if (req.session.created) {
		res.setHeader('Set-cookie', req.get('cookie'));
		res.setHeader('Content-disposition', 'attachment; filename=export.zip');
		res.setHeader('Content-type', 'application/zip');
		fs.createReadStream(path.join(__dirname, 'export.zip')).pipe(res);
	} else {
		res.status(404).sendFile(path.join(__dirname, '404.html'));
	}
});

app.listen(8000);

console.log('Listening on port 8000');