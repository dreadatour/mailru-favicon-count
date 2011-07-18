var mailru_favicon_count = {
	updateInterval: 60,

	bind: function(aFunc, aObj) {
		if (!aObj) aObj = this;
		return function() {
			return aFunc.apply(aObj, arguments);
		};
	},

	updateFavicon: function() {
		var req = new XMLHttpRequest();
		var time = new Date().getTime();
		req.open('GET', 'http://e.mail.ru/cgi-bin/mailcnt?json=1&' + time, true);
		req.onreadystatechange = function () {
			if (req.readyState == 4 && req.status == 200) {
				var mail_count = /NewMailCNT:"(\d+)"/.exec(req.responseText);
				if (mail_count[1].length > 0) {
					var favicon = 'chrome://mailru-favicon-count/skin/favicon.png'
					if (mail_count[1] > 0 && mail_count[1] < 100) {
						favicon = 'chrome://mailru-favicon-count/skin/favicon-' + mail_count[1] + '.png'
					} else if (mail_count[1] >= 100) {
						favicon = 'chrome://mailru-favicon-count/skin/favicon-100.png'
					}
					for (var i = 0; i < gBrowser.mTabs.length; i++) {
						var tab_host = gBrowser.getBrowserForTab(gBrowser.mTabs[i]).currentURI.host;
						if (tab_host == 'mail.ru' || tab_host == 'e.mail.ru') {
							if (gBrowser.getIcon(gBrowser.mTabs[i]) != favicon) {
								gBrowser.setIcon(gBrowser.mTabs[i], favicon);
							}
						}
					}
				}
			}
		};
		req.send(null);
		setTimeout(this.updateFavicon, this.updateInterval * 1000);
	},

	onPageChange: function(aEvent) {
		var host = aEvent.currentTarget.currentURI.host;
		if (host == 'mail.ru' || host == 'e.mail.ru') {
			this.updateFavicon();
		}
	},

	init: function() {
		gBrowser.addEventListener("load", this.bind(this.onPageChange), true);
		this.updateFavicon();
	}
};

window.addEventListener("load", function() { mailru_favicon_count.init(); }, false);

