/// <reference path="../_all.d.ts" />

"use strict";

const config = require('../../config/config.json');
const nodemailer = require('nodemailer');
const fs = require('fs');

export class Email {
	private sender;

	constructor() {
		// create reusable transporter object using the default SMTP transport
		this.sender = nodemailer.createTransport(`smtps://${config.smtp.user}:${config.smtp.password}@${config.smtp.host}`);
	}

	public send(options) {
		// setup e-mail data with unicode symbols
		let mailOptions = {
			from: config.systemEmail,
			to: options.to,
			subject: options.subject,
			html: options.html
		};

		// send mail with defined transport object
		this.sender.sendMail(mailOptions, function(error, info){
			if(error){
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});
	}


	//async function that load template by name
	//insert the paramters to the template
	//and the resolve the template
	public render(template, params) {
		return new Promise((resolve, reject) => {
			fs.readFile(config.emailBuildDir + "/" + template + '.html', function(err, data) {
				if (err) {
					throw err;
				}

				let template = data.toString();

				//Insert the  param to the template
				for (let key in params) {
					//For replace all string not only the first
					//string we use regex with g
					var re = new RegExp('{{' + key + '}}', 'g');
					template = template.replace(re, params[key]);
				}

				resolve(template);
			});
		});
	}
}