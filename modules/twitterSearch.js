﻿/**
	This file is part of Web Client
	@author Copyright (c) 2010 Sebastiaan Deckers
	@license GNU General Public License version 3 or later
*/
define(["core/events"], function (events) {
	events.subscribe("search.query", function (queryString) {
		/* TODO: Don't use require.js for this JSONP call since it doesn't clean up the script tag and caches results.
		   See: http://requirejs.org/docs/api.html#jsonp
		 */
		require(["http://search.twitter.com/search.json?q=" + encodeURIComponent(queryString) + "&callback=define"],
			function (payload) {
				events.publish("search.results", payload);
			}
		);
	});
	return {};
});
