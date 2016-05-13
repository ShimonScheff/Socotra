/// <reference path="../_all.d.ts" />

"use strict";


export module Core {
	const config = require('../../config/config.json');
	const Mongolian = require("mongolian");

	export class DB {
		public db;

		constructor() {
			this.connect();
		}

		public connect() {
			// Create a server instance with default host and port
			const server = new Mongolian;

			this.db = server.db(config.dbName)
		}
	}
}