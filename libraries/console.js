﻿if (!("console" in window)) {
	window.console = {};
}

(	"assert count debug dir dirxml error group groupCollapsed groupEnd " +
	"info log markTimeline profile profileEnd time timeEnd trace warn"
).split(" ").forEach(function (api) {
	if (!(api in window.console)) {
		window.console[api] = function () {};
	}
});
