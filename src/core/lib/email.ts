/// <reference path="../_all.d.ts" />

"use strict";

const config = require('../../config/config.json');
const nodemailer = require('nodemailer');

export class Email {
	private sender;

	constructor() {
		// create reusable transporter object using the default SMTP transport
		this.sender = nodemailer.createTransport(`smtps://${config.smtp.user}:${config.smtp.password}@${config.smtp.host}`);
	}

	public send() {
		// setup e-mail data with unicode symbols
		let mailOptions = {
			from: config.systemEmail,
			to: 'ariel@qwikwiz.com',
			subject: 'Hello',
			text: 'Hello world'
		};

		// send mail with defined transport object
		this.sender.sendMail(mailOptions, function(error, info){
			if(error){
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});
	}
}