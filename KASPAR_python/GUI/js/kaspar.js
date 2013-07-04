function dataHelper() {
}

dataHelper.prototype = {
	getMenu : function() {
		var menu = null;
		$.ajax({
			url : 'data',
			dataType : 'json',
			async : false,
			success : function(data, textStatus, jqXHR) {
				menu = data
			},
		});

		return menu;
	},
}

function uiHelper() {
}

uiHelper.prototype = {
	load : function(navbar, contentTag) {
		var menuData = new dataHelper().getMenu()

		var menu = $('<div id="menu"></div>');
		for (index in menuData['groups']) {
			var menugroup = menuData['groups'][index];
			var head = $('<h3></h3>');
			head.text(menugroup['title']);

			var content = $('<div></div>');
			for (linkindex in menugroup['links']) {
				var link = menugroup['links'][linkindex];
				var newLnk = $('<div></div>');
				newLnk.text(link['title']);
				newLnk.click(function(uihelper, url, contentTag) {
					return function() {
						uihelper.loadContent(url, contentTag);
					}
				}(this, link['path'], contentTag));

				$(content).append(newLnk);
			}

			$(menu).append(head);
			$(menu).append(content);
		}

		$(navbar).append(menu);
		$(menu).accordion({
			heightStyle : 'fill'
		});
	},

	loadContent : function(url, contentTag) {
		$(contentTag).load(url);
	},
}
