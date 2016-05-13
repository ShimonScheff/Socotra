/// <reference path="../core/_all.d.ts" />


"use strict";

import ns = require('../core/lib/validator');

module.exports = (req, res) => {
	let email: String = req.query.email.toLowerCase();
	const password: String = req.query.password;

	//check if the client send email and password
	//for creating the new user and if not reject the request
	if(typeof email === "undefined") {
		res.send({
			status: false,
			error: "Missing email value",
			errorCode: 1
		});
		return;
	}

	if (typeof password === "undefined") {
		res.send({
			status: false,
			error: "Missing password value",
			errorCode: 2
		});
		return;
	}

	const valditor = new ns.Core.Validator();
	if(!valditor.isValidEmail(email)) {
		res.send({
			status: false,
			error: "invalid email value",
			errorCode: 3
		});
		return;
	}

	if (!valditor.isValidPassword(password)) {
		res.send({
			status: false,
			error: "invalid password At least one number, one lowercase and one uppercase letter at least six characters",
			errorCode: 4
		});
		return;
	}

	res.send("Email: " + email + " Password: " + password);
};