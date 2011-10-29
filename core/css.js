define(["core/promise"], function (promise) {
	var theme = "themes/base/",
		extension = ".css",
		stylesheets = {},
		fixName = function (file) {
			if (file.substr(file.length - extension.length) !== extension) {
				file += extension;
			}
			return file;
		},
		load = function (file) {
			return new promise(function (deferred) {
				if (!(file in stylesheets)) {
					var link = document.createElement("link");
					link.rel = "stylesheet";
					/* * /
					// Load event on LINK is currently not supported by Gecko/Webkit.
					// + https://bugzilla.mozilla.org/show_bug.cgi?id=185236
					// + http://code.google.com/p/chromium/issues/detail?id=67522
					// + https://bugs.webkit.org/show_bug.cgi?id=38995
					link.addEventListener("load", function (event) {
						link.removeEventListener("load", this);
						deferred.done();
					}, false);
					/* */
					link.href = theme + file;
					stylesheets[file] = link;
					document.getElementsByTagName("head")[0].appendChild(link);
					// Load event workaround
					var img = document.createElement('img');
					img.src = theme + file;
					img.style.display = "none";
					img.addEventListener("error", function () {
						document.body.removeChild(img);
						deferred.done();
					}, false);
					document.body.appendChild(img);
				}
			});
		},
		unload = function (file) {
			if (file in stylesheets) {
				var link = stylesheets[file];
				link.parentNode.removeChild(link);
				delete stylesheets[file];
			}
		};
	return {
		load: function (file) {
			return load(fixName(file));
		},
		unload: function (file) {
			return unload(fixName(file));
		}
	};
});
