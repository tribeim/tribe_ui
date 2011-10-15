define(
["core/paths", "core/css", "libraries/mustache", "text!templates/ui.html"],
function (paths, css, mustache, uiTemplate) {

	css.load("core/ui");
	document.body.insertAdjacentHTML("beforeEnd", mustache.to_html(uiTemplate));

	document.body.addEventListener("click", function (event) {
		if (event.target.tagName === "A") {
			var href = event.target.getAttribute("href").trim();
			if (href !== "#" && !/^(http|https)+:\/\//.test(href)) {
				event.preventDefault();
				paths.publish(href);
			}
		}
	}, false);

	return {};
});
