define(
["core/events", "core/ui/dock", "modules/roster", "core/template", "core/settings"],
function (events, dock, roster, template, settings) {
	settings({contactList: {
		visible: false
	}});
	var htmlCache = {
/*		"groupA": {
			html: Element, // li > header + ul
			contacts: {
				"jidA": Element, // li
				"jidB": Element // li
			}
		},
		"groupB": {
			html: Element, // li
			contacts: {
				"jidA": Element, // li
				"jidC": Element // li
			}
		}
*/	};
	var getGroupFromCache = function (group) {
		if (!htmlCache[group]) {
			var groupHtml = document.createElement("li");
			groupHtml.appendChild(document.createElement("header"));
			groupHtml.appendChild(document.createElement("ul"));
			htmlCache[group] = {html: groupHtml, contacts: {}};
			widget.content.querySelector("ul").insertAdjacentElement("beforeEnd", groupHtml);
		}
		return htmlCache[group];
	};
	var getContactFromCache = function (group, jid) {
		var cachedGroup = getGroupFromCache(group);
		if (!cachedGroup.contacts[jid]) {
			var contactHtml = document.createElement("li");
			cachedGroup.contacts[jid] = contactHtml;
			cachedGroup.html.lastChild.insertAdjacentElement("beforeEnd", contactHtml);
		}
		return cachedGroup.contacts[jid];
	};
	var removeGroupFromCache = function (group) {
		if (htmlCache[group]) {
			var cachedGroup = htmlCache[group];
			cachedGroup.html.parentElement.removeChild(cachedGroup.html);
			delete htmlCache[group];
		}
	};
	var removeContactFromCache = function (group, jid) {
		if (htmlCache[group] && htmlCache[group].contacts[jid]) {
			var cachedGroup = htmlCache[group];
			var contact = cachedGroup.contacts[jid];
			contact.parentElement.removeChild(contact);
			delete cachedGroup.contacts[jid];
			if (Object.keys(cachedGroup.contacts).length === 0) {
				removeGroupFromCache(group);
			}
		}
	};

	var updateGroupHeader = function (group) {
		if (htmlCache[group]) {
			if (Object.keys(htmlCache[group].contacts).length > 0) {
				var groupHeader = htmlCache[group].html.firstChild;
				while (groupHeader.hasChildNodes()) {
					groupHeader.removeChild(groupHeader.firstChild);
				}
				template({
					container: groupHeader,
					source: "contactListGroup",
					data: {name: group}
				});
			} else {
				htmlCache[group].html.parentNode.removeChild(htmlCache[group].html);
				delete htmlCache[group];
			}
		}
	};

	var updateContact = function (group, contact) {
		var cachedContact = getContactFromCache(group, contact.jid);
		while (cachedContact.hasChildNodes()) {
			cachedContact.removeChild(cachedContact.firstChild);
		}
		var resources = Object.keys(contact.resources)
				.map(function (resource) {
					var res = contact.resources[resource];
					return {
						jid: contact.jid,
						priority: res.priority,
						resource: resource,
						show: res.show,
						status: res.status
					};
				})
				.sort(function (a, b) {
					return b.priority - a.priority;
				});
		template({
			container: cachedContact,
			source: "contactListItem",
			data: {
				jid: contact.jid,
				name: contact.name,
				ask: contact.ask,
				subscription: contact.subscription,
				resource: resources.length > 0 ? resources[0] : undefined,
				resources: resources
			}
		});
	};

	var widget = new dock({
		title: "Contacts",
		sticky: true,
		close: false,
		visible: settings.contactList.visible,
		events: {
			toggle: function (widget) {
				settings.contactList.visible = widget.visible;
			}
		}
	});
	template({
		css: "modules/contactList",
		source: "contactList",
		container: widget.content
	});

	events.subscribe("roster.change", function (changedContacts) {
		widget.content.querySelector("p").classList.add("hide");
		var groupsToUpdate = {};
		Object.keys(changedContacts).forEach(function (jid) {
			// Remove from old groups
			Object.keys(htmlCache).filter(function (group) {
				return Object.hasOwnProperty.call(htmlCache[group], jid)
					&& changedContacts[jid].groups.indexOf(group) === -1;
			}).forEach(function (group) {
				removeContactFromCache(group, jid);
			});
			// Update new groups
			(changedContacts[jid].groups.length > 0
				? changedContacts[jid].groups
				: ["Other Contacts"])
			.forEach(function (group) {
				groupsToUpdate[group] = true;
				updateContact(group, changedContacts[jid]);
			});
		});
		Object.keys(groupsToUpdate).forEach(updateGroupHeader);
		return true;
	});

	events.subscribe("roster.available", function (presence, jid, resource, rosterResource) {
		return true;
		var contact = roster[jid];
		(contact.groups.length > 0
			? contact.groups
			: ["Other Contacts"])
		.forEach(function (group) {
			updateContact(group, contact);
		});
		return true;
	});

	events.subscribe("roster.unavailable", function (presence, jid, resource, status) {
		return true;
	});

	return {};
});
