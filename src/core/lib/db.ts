/// <reference path="../_all.d.ts" />

"use strict";

const config = require('../../config/config.json');
const Mongolian = require('mongolian');


export class DB {
	public db;

	constructor() {
		this.connect();
	}

	public connect() {
		// Create a server instance with default host and port
		const server = new Mongolian(config.dbHost + ":" + config.dbPort);

		this.db = server.db(config.dbName);

		if (typeof config.dbUserPassword !== undefined &&
			config.dbUserPassword.length) {
			// Authenticate a database
			this.db.auth(config.dbUserName, config.dbUserPassword);
		}
	}
}