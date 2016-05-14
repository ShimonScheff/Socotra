/// <reference path="../core/_all.d.ts" />


import {DB} from  '../core/lib/db';

class demo extends DB {
	constructor() {
		super();

		this.db.collection("demo").insert({ "b": 1 });
	}
}