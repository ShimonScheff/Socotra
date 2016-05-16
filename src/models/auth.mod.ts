/// <reference path="../core/_all.d.ts" />


import {DB} from  '../core/lib/db';
import * as validator from '../core/lib/generic/validation';
import {Email}  from '../core/lib/email';
import * as crypto from 'crypto';


const path = require("path");
var fs = require('fs');

export class Auth extends DB {
	constructor() {
		super();
	}

	private isUserExists(email: string) {
		const where = {
			email: email
		};

		return new Promise((resolve, reject) => {
			this.db.collection("users").findOne(where, (err, doc) => {
				if (err) {
					reject(err);
					return;
				}

				if (doc !== undefined) {
					resolve(true);
					return;
				}

				resolve(false);
			});
		});		
	}

	private async sendMailToNewUser(email: string) {
		let emailObj = new Email();
		let template = await emailObj.render('test', {body:"this is the body"});
		const emailOptions = {
			subject: "test email",
			to: "ariel@qwikwiz.com",
			html: template
		};
		emailObj.send(emailOptions);
		console.log("test email was sent");
	}

	private makeNewUser(email: string, password: string) {
		const solt = crypto.randomBytes(16).toString('hex');
		const hashPassword = crypto
			.createHmac("sha256", solt)
			.update(password)
			.digest('hex');

		const newUser = {
			UTC: new Date(),
			email: email,
			solt: solt,
			password: hashPassword,
		};

		this.sendMailToNewUser(email);

		return new Promise((resolve) => {
			this.db.collection("users").insert(newUser, (err) => {
				if (err) {
					resolve(false);
					return;
				}

				resolve(true);
				return;
			});
		});

	}

	public async createUser(email: string, password: string) {
		//check if the client send email and password
		//for creating the new user and if not reject the request
		if (typeof email === "undefined") {
			return {
				error: 1,
				msg: "Missing email value"
			};
		}

		if (typeof password === "undefined") {
			return {
				error: 2,
				msg: "Missing password value"
			};
		}

		if (!validator.isValidEmail(email)) {
			return {
				error: 3,
				msg: "invalid email value"
			};
		}

		if (!validator.isValidPassword(password)) {
			return {
				error: 4,
				msg: "invalid password At least one number, one lowercase and one uppercase letter at least six characters"
			};
		}

		const isUserExists = await this.isUserExists(email);
		if(isUserExists) {
			return {
				error: 1,
				msg: 'User is alrady exsist'
			};
		}

		const makeUser = await this.makeNewUser(email, password);
		if (!makeUser) {
			return {
				error: 2,
				msg: 'Cant write to DB'
			}
		}

		return {
			error: 0,
			msg: 'successfully create new user'
		};
	}
}