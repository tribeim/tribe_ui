﻿/**
	This file is part of Web Client
	@author Copyright (c) 2010 Sebastiaan Deckers
	@license GNU General Public License version 3 or later
*/
define(
	[
		"libraries/polyfill",
		"core/events",
		"core/session",
		"core/help"
	],
	function (polyfill, events, settings, help) {
		events.publish("app.ready");
		return {};
	}
);
