﻿define(
["core/ui/content"],
function (content) {
	new content({
		path: /^$/,
		open: function (path, element) {
			require(["core/template"], function (template) {
				template({
					css: "modules/welcome",
					source: "welcome",
					container: element
				});
			});
		},
		close: function (path, element) {
			require(["core/css"], function (css) {
				css.unload("modules/welcome");
			});
		}
	});
	return {};
});
