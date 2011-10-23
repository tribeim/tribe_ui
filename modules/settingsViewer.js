define(
["core/settings", "core/events", "core/ui/content", "core/ui/navigation"],
function (settings, events, content, navigation) {
	var drawSettings = function () {
		var output = document.querySelector("#settings-viewer");
		while (output.hasChildNodes()) {
			output.removeChild(output.firstChild);
		}
		output.insertAdjacentText("beforeEnd",
			Object.keys(settings).map(function (key) {
				return key === "session"
					? ""
					: (key + ": " + JSON.stringify(settings[key], null, 2));
			}).join("\n")
		);
	};
	new content({
		path: /^settings/,
		open: function (path, element) {
			require(["core/template"], function (template) {
				template({
					css: "modules/settingsViewer",
					source: "settingsViewer",
					container: element
				})
				.then(function () {
					drawSettings();
					events.subscribe("settings.change", drawSettings);
				});
			});
		},
		close: function (path, element) {
			events.unsubscribe("settings.change", drawSettings);
			require(["core/css"], function (css) {
				css.unload("core/settingsViewer");
			});
		}
	});
	new navigation({
		title: "Settings",
		path: "settings"
	});
	return {};
});
