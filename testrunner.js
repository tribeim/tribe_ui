var testrunner = require("qunit");

testrunner.run(
	{
		code: "./core/events.js",
		tests: "./tests/core/events.js"
	},
	{
		code: "./core/settings.js",
		tests: "./tests/core/settings.js"
	},
	{
		code: "./core/xpath.js",
		tests: "./tests/core/xpath.js"
	},
	{
		code: "./core/promise.js",
		tests: "./tests/core/promise.js"
	}
);
