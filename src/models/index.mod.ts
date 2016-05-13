/// <reference path="../core/_all.d.ts" />


import ns = require ('../core/lib/db');


class demo extends ns.Core.DB {
	constructor() {
		super();

		this.db.collection("demo").insert({ "b": 1 });
	}
}