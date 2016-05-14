/// <reference path="../core/_all.d.ts" />


"use strict";

import {Auth} from '../models/auth.mod';

module.exports = (req, res) => {
	let email: string = req.query.email.toLowerCase();
	const password: string = req.query.password;

	

	let AuthOBJ = new Auth();
	let createUser = AuthOBJ.createUser(email, password);
	createUser.then((results) => {
		if(results.error) {
			console.log(results);
		}

		console.log(results.msg);
		res.send("Email: " + email + " Password: " + password);
	});
};