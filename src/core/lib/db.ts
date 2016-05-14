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

		"mongo.example.com:12345"

		this.db = server.db(config.dbName);

		if (typeof config.dbUserPasswrod !== undefined &&
			config.dbUserPasswrod.length) {
			// Authenticate a database
			this.db.auth(config.dbUserName, config.dbUserPasswrod);
		}
	}
}