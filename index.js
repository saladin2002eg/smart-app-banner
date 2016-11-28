var extend = require('xtend/mutable');
var q = require('component-query');
var doc = require('get-doc');
var root = doc && doc.documentElement;
var cookie = require('cookie-cutter');
var ua = require('ua-parser-js');

// IE < 11 doesn't support navigator language property.
var userLangAttribute = navigator.language || navigator.userLanguage || navigator.browserLanguage;
var userLang = userLangAttribute.slice(-2) || 'us';

// platform dependent functionality
var mixins = {
	ios: {
		appMeta: 'hs-itunes-app',
		urlMeta: 'hs-itunes-app',
		iconRels: ['apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function() {
			return 'https://itunes.apple.com/' + this.options.appStoreLanguage + '/app/id' + this.appId;
		}
	},
	android: {
		appMeta: 'google-play-app',
		urlMeta: 'google-play-app',
		iconRels: ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function() {
			return 'http://play.google.com/store/apps/details?id=' + this.appId;
		}
	},
	windows: {
		appMeta: 'msApplication-ID',
		urlMeta: 'msApplication-URL',
		iconRels: ['windows-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
		getStoreLink: function() {
			return 'http://www.windowsphone.com/s?appid=' + this.appId;
		}
	}
};

var SmartBanner = function(options) {
	var agent = ua(navigator.userAgent);
	this.options = extend({}, {
		daysHidden: 15,
		daysReminder: 90,
		appStoreLanguage: userLang, // Language code for App Store
		button: 'OPEN', // Text for the install button
		buttonInstall: 'INSTALL',
		deepDomains: ["hungerstation.com"],
		deepLink: "hungerstation://",
		store: {
			ios: 'On the App Store',
			android: 'In Google Play',
			windows: 'In the Windows Store'
		},
		price: {
			ios: 'FREE',
			android: 'FREE',
			windows: 'FREE'
		},
		theme: '', // put platform type ('ios', 'android', etc.) here to force single theme on all device
		icon: '', // full path to icon image if not using website icon image
		force: '' // put platform type ('ios', 'android', etc.) here for emulation
	}, options || {});

	if (this.options.force) {
		this.type = this.options.force;
	} else if (agent.os.name === 'Windows Phone' || agent.os.name === 'Windows Mobile') {
		this.type = 'windows';
	} else if (agent.os.name === 'iOS') {
		this.type = 'ios';
	} else if (agent.os.name === 'Android') {
		this.type = 'android';
	}

	// Don't show banner on ANY of the following conditions:
	// - device os is not supported,
	// - user is on mobile safari for ios 6 or greater (iOS >= 6 has native support for SmartAppBanner)
	// - running on standalone mode
	// - user dismissed banner
	if (!this.type
		/*|| ( this.type === 'ios' && agent.browser.name === 'Mobile Safari' && parseInt(agent.os.version) >= 6 )*/
		|| navigator.standalone
		|| cookie.get('smartbanner-closed') && this.daysHidden > 0
		|| cookie.get('smartbanner-installed') && this.daysReminder > 0) {
		return;
	}

	extend(this, mixins[this.type]);

	// - If we dont have app id in meta, dont display the banner
	if (!this.parseAppId()) {
		return;
	}

	this.create();
	this.show();
};

SmartBanner.prototype = {
	constructor: SmartBanner,
	timers: [],
	button: null,
	buttonInstall: null,
	clearTimers: function() {
		this.timers.map(clearTimeout);
      this.timers = [];
	},

	create: function() {
		var inStore = this.options.price[this.type] + ' - ' + this.options.store[this.type];
		var icon;

		if (this.options.icon) {
			icon = this.options.icon;
		} else {
			for (var i = 0; i < this.iconRels.length; i++) {
				var rel = q('link[rel="' + this.iconRels[i] + '"]');

				if (rel) {
					icon = rel.getAttribute('href');
					break;
				}
			}
		}

		var sb = doc.createElement('div');
		var theme = this.options.theme || this.type;
		var buttonTitle = this.options.button;
		if(this.isDeepDomain()) {
			buttonTitle = this.options.buttonInstall;
		}

		sb.className = 'smartbanner' + ' smartbanner-' + theme;
		sb.innerHTML = '<div class="smartbanner-container">' +
							'<a href="javascript:void(0);" class="smartbanner-close">&times;</a>' +
							'<span class="smartbanner-icon" style="background-image: url('+icon+')"></span>' +
							'<div class="smartbanner-info">' +
								'<div class="smartbanner-title">'+this.options.title+'</div>' +
								'<div>'+this.options.author+'</div>' +
								'<span>'+inStore+'</span>' +
							'</div>' +
							'<a href="javascript:void(0);" class="smartbanner-button smartbanner-button-install">' +
								'<span class="smartbanner-button-text">'+this.options.buttonInstall+'</span>' +
							'</a>' +
							'<a href="javascript:void(0);" class="smartbanner-button smartbanner-button-open">' +
								'<span class="smartbanner-button-text">'+buttonTitle+'</span>' +
							'</a>' +
						'</div>';

		//there isn’t neccessary a body
		if (doc.body) {
			doc.body.appendChild(sb);
		}
		else if (doc) {
			doc.addEventListener('DOMContentLoaded', function(){
				doc.body.appendChild(sb);
			});
		}

		this.button = q('.smartbanner-button-open', sb);
		this.buttonInstall = q(".smartbanner-button-install", sb);

		if(!this.isSamsung()) {
			this.buttonInstall.remove();
		}

		this.buttonInstall.addEventListener('click', this.forceInstall.bind(this), false);
		this.button.addEventListener('click', this.install.bind(this), false);
		q('.smartbanner-close', sb).addEventListener('click', this.close.bind(this), false);

		// events for opening up apps.
		console.log("adding listeners");
		window.addEventListener("pagehide", this.clearTimers.bind(this));
		window.addEventListener("blur", this.clearTimers.bind(this));
		window.addEventListener("beforeunload", this.clearTimers.bind(this));
		window.addEventListener("unload", this.clearTimers.bind(this));
		document.addEventListener("visibilitychange", function(){
			this.clearTimers();
		}.bind(this));
	},
	hide: function() {
		root.classList.remove('smartbanner-show');
	},
	show: function() {
		root.classList.add('smartbanner-show');
	},
	close: function() {
		this.hide();
		cookie.set('smartbanner-closed', 'true', {
			path: '/',
			expires: new Date(+new Date() + this.options.daysHidden * 1000 * 60 * 60 * 24)
		});
	},
	forceInstall: function() {
		var appStoreUrl = this.getStoreLink();
		location.href = appStoreUrl;
	},
	install: function() {
		this.openOrInstall();

		this.hide();
		cookie.set('smartbanner-installed', 'true', {
			path: '/',
			expires: new Date(+new Date() + this.options.daysReminder * 1000 * 60 * 60 * 24)
		});
		return false;
	},
	iOSversion: function() {
  		if (/iP(hone|od|ad)/.test(navigator.platform)) {
	    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
	    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
	    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
	  }

	  return -1;
  	},
	openOrInstall: function() {
		var url = this.parseUrl();
		var appStoreUrl = this.getStoreLink();
		var time = new Date().getTime();
		this.timers.push(setTimeout(function(){
			if(this.iOSversion() < 9) {
				if((new Date().getTime()) - time < 800) {
					window.top.location = appStoreUrl;
				}
			}
		}.bind(this), 600));

		if(this.iOSversion() < 9) {
			if(this.isSamsung()) {
				location.href = url;
			} else {
				var iframe = doc.createElement('iframe');
				iframe.src = url;
				iframe.frameborder = 0;
				iframe.style.width = "1px";
				iframe.style.height = "1px";
				iframe.style.position = "absolute";
				iframe.style.top = "-100px";
				doc.body.appendChild(iframe);
			}
		} else {
			this.clearTimers();
			if(this.isDeepDomain()) {
				location.href = appStoreUrl;
			} else {
				location.href = this.options.deepLink + "?" + url;
			}
		}
	},
	parseAppId: function() {
		var meta = q('meta[name="' + this.appMeta + '"]');
		if (!meta) {
			return;
		}

		if (this.type === 'windows') {
			this.appId = meta.getAttribute('content');
		} else {
			this.appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];
		}

		return this.appId;
	},
	parseUrl: function() {
		var meta = q('meta[name="' + this.urlMeta + '"]');
		if (!meta) {
			return;
		}

		if (this.type === 'windows') {
			this.appArgument = meta.getAttribute('content');
		} else {
			this.appArgument = /app-argument=([^\s,]+)/.exec(meta.getAttribute('content'))[1];
		}

		if(typeof this.appArgument == "string") {
			this.appArgument = unescape(this.appArgument);
		}

		return this.appArgument;
	},
	isDeepDomain: function() {
		var host = location.host;
		for(var i in this.options.deepDomains) {
			if(this.options.deepDomains.hasOwnProperty(i)) {
				if(host.toLowerCase().endsWith(this.options.deepDomains[i].toLowerCase())) {
					return true;
				}
			}
		}

		return false;
	},
	isSamsung: function() {
		return /Samsung/.test(navigator.userAgent);
	}
};

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

module.exports = SmartBanner;
