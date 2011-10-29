/**	Package: template
 *	Utility to easily load HTML and CSS.
 *
 *	Returns:
 *		Function
 *
 *	Arguments:
 *		(TemplateSettings) settings - Map of properties for the CSS and HTML to be loaded. See: <TemplateSettings>
 *		(Function) callback - Optional function to be called when the HTML has been loaded. See: <TemplateCallback>
 *
 *	Example:
 *		Loading a CSS file and Mustache template with data objects.
 *
 *		Template file "myForm.html"
 *		(code)
 *		<h1>{{header}}</h1>
 *		{{#items}}
 *			{{#first}}
 *				<li><strong>{{name}}</strong></li>
 *			{{/first}}
 *			{{#link}}
 *				<li><a href="{{url}}">{{name}}</a></li>
 *			{{/link}}
 *		{{/items}}
 *		(end)
 *
 *		JSON data
 *		(code)
 *		var jsonData = {
 *			"header": "Colors",
 *			"items": [
 *				{"name": "red", "first": true, "url": "#Red"},
 *				{"name": "green", "link": true, "url": "#Green"},
 *				{"name": "blue", "link": true, "url": "#Blue"}
 *			]
 *		};
 *		(end)
 *
 *		Using template
 *		(code)
 *		template({
 *			css: "customDialog", // "customDialog.css"
 *			container: "#myDialog",
 *			position: "afterBegin",
 *			source: "myForm" // "myForm.html"
 *			data: jsonData
 *		}, function (html, container) {
 *			// do something with container or html
 *		});
 *		(end)
 */
/**	Interface: TemplateSettings
 *	Map of properties for the CSS and HTML to be loaded.
 *
 *	Properties:
 *		(String) css - Path to a Cascading Style Sheet. The ".css" extension is optional.
 *		(String) source - Path to a Mustache template file. The ".html" extension is optional.
 *		(Object) data - Map of keys/values for the template parser.
 *		(Element|String) container - The HTML element (Element) or CSS selector (String) to receive the HTML output.
 *		(String) position - Location relative to the container to insert the HTML.
 *							Values: *beforeBegin*, *afterBegin*, *beforeEnd*, *afterEnd*. Values are case-insensitive.
 *							See: <insertAdjacentHTML at http://www.w3.org/TR/html5/apis-in-html-documents.html#insertadjacenthtml>
 */
/**	Interface: TemplateCallback
 *	Optional function to be called when the HTML has been loaded.
 *
 *	Note that the CSS loads asynchronously and may not yet be available when the callback is executed.
 *
 *	Parameters:
 *		(String) html - The parsed HTML output from the template.
 *		(Element) container - The HTML element that received the HTML output.
 */
define(
["core/promise", "core/css", "libraries/mustache"],
function (promise, css, mustache) {
	return function (settings, callback) {
		return new promise(function (templateDeferred) {
			var ready = new promise(),
				rawHtml = "";
			if ("css" in settings) {
				ready.when(css.load(settings.css));
			}
			if ("source" in settings) {
				ready.when(new promise(function (sourceDeferred) {
					var extension = ".html",
						file = settings.source;
					if (file.substr(file.length - extension.length) !== extension) {
						file += extension;
					}
					require(["text!templates/" + file], function (source) {
						rawHtml = source;
						sourceDeferred.done();
					});
				}));
			}
			ready.then(function () {
				var html = mustache.to_html(rawHtml, settings.data),
					where = "position" in settings ? settings.position : "beforeEnd";
				if ("container" in settings) {
					if (typeof settings.container === "string") {
						settings.container = document.querySelector(settings.container);
					}
					if (settings.container) {
						settings.container.insertAdjacentHTML(where, html);
					}
				}
				templateDeferred.done(html, settings.container);
			});
		});
	};
});
