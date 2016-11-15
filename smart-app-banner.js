(function(u){"object"===typeof exports&&"undefined"!==typeof module?module.exports=u():"function"===typeof define&&define.amd?define([],u):("undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:this).SmartBanner=u()})(function(){return function d(f,h,c){function a(e,g){if(!h[e]){if(!f[e]){var l="function"==typeof require&&require;if(!g&&l)return l(e,!0);if(b)return b(e,!0);l=Error("Cannot find module '"+e+"'");throw l.code="MODULE_NOT_FOUND",l;}l=h[e]=
{exports:{}};f[e][0].call(l.exports,function(b){var n=f[e][1][b];return a(n?n:b)},l,l.exports,d,f,h,c)}return h[e].exports}for(var b="function"==typeof require&&require,g=0;g<c.length;g++)a(c[g]);return a}({1:[function(d,f,h){var c=d("xtend/mutable"),a=d("component-query"),b=d("get-doc"),g=b&&b.documentElement,e=d("cookie-cutter"),v=d("ua-parser-js"),l=(navigator.language||navigator.userLanguage||navigator.browserLanguage).slice(-2)||"us",m={ios:{appMeta:"dw-itunes-app",urlMeta:"dw-itunes-app",iconRels:["apple-touch-icon-precomposed",
"apple-touch-icon"],getStoreLink:function(){return"https://itunes.apple.com/"+this.options.appStoreLanguage+"/app/id"+this.appId}},android:{appMeta:"google-play-app",urlMeta:"google-play-app",iconRels:["android-touch-icon","apple-touch-icon-precomposed","apple-touch-icon"],getStoreLink:function(){return"http://play.google.com/store/apps/details?id="+this.appId}},windows:{appMeta:"msApplication-ID",urlMeta:"msApplication-URL",iconRels:["windows-touch-icon","apple-touch-icon-precomposed","apple-touch-icon"],
getStoreLink:function(){return"http://www.windowsphone.com/s?appid="+this.appId}}};d=function(b){var a=v(navigator.userAgent);this.options=c({},{daysHidden:15,daysReminder:90,appStoreLanguage:l,button:"OPEN",buttonInstall:"INSTALL",deepDomains:["saas.docuware.com","docuware-online.de","docuware-online.com"],deepLink:"https://saas.docuware.com/iosuniversal/",store:{ios:"On the App Store",android:"In Google Play",windows:"In the Windows Store"},price:{ios:"FREE",android:"FREE",windows:"FREE"},theme:"",
icon:"",force:""},b||{});this.options.force?this.type=this.options.force:"Windows Phone"===a.os.name||"Windows Mobile"===a.os.name?this.type="windows":"iOS"===a.os.name?this.type="ios":"Android"===a.os.name&&(this.type="android");!this.type||navigator.standalone||e.get("smartbanner-closed")&&0<this.daysHidden||e.get("smartbanner-installed")&&0<this.daysReminder||(c(this,m[this.type]),this.parseAppId()&&(this.create(),this.show()))};d.prototype={constructor:d,timers:[],button:null,clearTimers:function(){this.timers.map(clearTimeout);
this.timers=[]},create:function(){var n=this.options.price[this.type]+" - "+this.options.store[this.type],c;if(this.options.icon)c=this.options.icon;else for(var q=0;q<this.iconRels.length;q++){var p=a('link[rel="'+this.iconRels[q]+'"]');if(p){c=p.getAttribute("href");break}}var r=b.createElement("div"),q=this.options.theme||this.type,p=this.options.button;this.isDeepDomain()&&(p=this.options.buttonInstall);r.className="smartbanner smartbanner-"+q;r.innerHTML='<div class="smartbanner-container"><a href="javascript:void(0);" class="smartbanner-close">&times;</a><span class="smartbanner-icon" style="background-image: url('+
c+')"></span><div class="smartbanner-info"><div class="smartbanner-title">'+this.options.title+"</div><div>"+this.options.author+"</div><span>"+n+'</span></div><a href="javascript:void(0);" class="smartbanner-button"><span class="smartbanner-button-text">'+p+"</span></a></div>";b.body?b.body.appendChild(r):b&&b.addEventListener("DOMContentLoaded",function(){b.body.appendChild(r)});this.button=a(".smartbanner-button",r);this.button.addEventListener("click",this.install.bind(this),!1);a(".smartbanner-close",
r).addEventListener("click",this.close.bind(this),!1);console.log("adding listeners");window.addEventListener("pagehide",this.clearTimers.bind(this));window.addEventListener("blur",this.clearTimers.bind(this));window.addEventListener("beforeunload",this.clearTimers.bind(this))},hide:function(){g.classList.remove("smartbanner-show")},show:function(){g.classList.add("smartbanner-show")},close:function(){this.hide();e.set("smartbanner-closed","true",{path:"/",expires:new Date(+new Date+864E5*this.options.daysHidden)})},
install:function(){this.openOrInstall();this.hide();e.set("smartbanner-installed","true",{path:"/",expires:new Date(+new Date+864E5*this.options.daysReminder)});return!1},iOSversion:function(){if(/iP(hone|od|ad)/.test(navigator.platform)){var a=navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);return[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3]||0,10)]}return-1},openOrInstall:function(){var a=this.parseUrl(),c=this.getStoreLink(),q=(new Date).getTime();this.timers.push(setTimeout(function(){9>
this.iOSversion()&&800>(new Date).getTime()-q&&(window.top.location=c)}.bind(this),600));if(9>this.iOSversion()){var p=b.createElement("iframe");p.src=a;p.frameborder=0;p.style.width="1px";p.style.height="1px";p.style.position="absolute";p.style.top="-100px";b.body.appendChild(p)}else this.clearTimers(),this.isDeepDomain()?location.href=c:location.href=this.options.deepLink+"?u="+a},parseAppId:function(){var b=a('meta[name="'+this.appMeta+'"]');if(b)return this.appId="windows"===this.type?b.getAttribute("content"):
/app-id=([^\s,]+)/.exec(b.getAttribute("content"))[1]},parseUrl:function(){var b=a('meta[name="'+this.urlMeta+'"]');if(b)return this.appArgument="windows"===this.type?b.getAttribute("content"):/app-argument=([^\s,]+)/.exec(b.getAttribute("content"))[1],"string"==typeof this.appArgument&&(this.appArgument=unescape(this.appArgument)),this.appArgument},isDeepDomain:function(){var b=location.host,a;for(a in this.options.deepDomains)if(this.options.deepDomains.hasOwnProperty(a)&&b.toLowerCase().endsWith(this.options.deepDomains[a].toLowerCase()))return!0;
return!1}};"function"!==typeof String.prototype.endsWith&&(String.prototype.endsWith=function(a){return-1!==this.indexOf(a,this.length-a.length)});f.exports=d},{"component-query":2,"cookie-cutter":3,"get-doc":4,"ua-parser-js":6,"xtend/mutable":7}],2:[function(d,f,h){function c(a,b){return b.querySelector(a)}h=f.exports=function(a,b){b=b||document;return c(a,b)};h.all=function(a,b){b=b||document;return b.querySelectorAll(a)};h.engine=function(a){if(!a.one)throw Error(".one callback required");if(!a.all)throw Error(".all callback required");
c=a.one;h.all=a.all;return h}},{}],3:[function(d,f,h){h=f.exports=function(c){c||(c={});"string"===typeof c&&(c={cookie:c});void 0===c.cookie&&(c.cookie="");return{get:function(a){for(var b=c.cookie.split(/;\s*/),g=0;g<b.length;g++){var e=b[g].split("=");if(unescape(e[0])===a)return unescape(e[1])}},set:function(a,b,g){g||(g={});a=escape(a)+"="+escape(b);g.expires&&(a+="; expires="+g.expires);g.path&&(a+="; path="+escape(g.path));return c.cookie=a}}};"undefined"!==typeof document&&(d=h(document),
h.get=d.get,h.set=d.set)},{}],4:[function(d,f,h){d=d("has-dom");f.exports=d()?document:null},{"has-dom":5}],5:[function(d,f,h){f.exports=function(){return"undefined"!==typeof window&&"undefined"!==typeof document&&"function"===typeof document.createElement}},{}],6:[function(d,f,h){(function(c,a){var b={extend:function(a,b){for(var c in b)-1!=="browser cpu device engine os".indexOf(c)&&0===b[c].length%2&&(a[c]=b[c].concat(a[c]));return a},has:function(a,b){return"string"===typeof a?-1!==b.toLowerCase().indexOf(a.toLowerCase()):
!1},lowerize:function(a){return a.toLowerCase()},major:function(b){return"string"===typeof b?b.split(".")[0]:a}},g=function(){for(var b,c=0,e,g,d,k,h,f,l=arguments;c<l.length&&!h;){var m=l[c],n=l[c+1];if("undefined"===typeof b)for(d in b={},n)n.hasOwnProperty(d)&&(k=n[d],"object"===typeof k?b[k[0]]=a:b[k]=a);for(e=g=0;e<m.length&&!h;)if(h=m[e++].exec(this.getUA()))for(d=0;d<n.length;d++)f=h[++g],k=n[d],"object"===typeof k&&0<k.length?2==k.length?b[k[0]]="function"==typeof k[1]?k[1].call(this,f):k[1]:
3==k.length?b[k[0]]="function"!==typeof k[1]||k[1].exec&&k[1].test?f?f.replace(k[1],k[2]):a:f?k[1].call(this,f,k[2]):a:4==k.length&&(b[k[0]]=f?k[3].call(this,f.replace(k[1],k[2])):a):b[k]=f?f:a;c+=2}return b},e=function(c,d){for(var e in d)if("object"===typeof d[e]&&0<d[e].length)for(var g=0;g<d[e].length;g++){if(b.has(d[e][g],c))return"?"===e?a:e}else if(b.has(d[e],c))return"?"===e?a:e;return c},d={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2E3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",
8:"NT 6.2","8.1":"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},l={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],["name","version"],[/\s(opr)\/([\w\.]+)/i],[["name","Opera"],"version"],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]+)*/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i],
["name","version"],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[["name","IE"],"version"],[/(edge)\/((\d+)?[\w\.]+)/i],["name","version"],[/(yabrowser)\/([\w\.]+)/i],[["name","Yandex"],"version"],[/(comodo_dragon)\/([\w\.]+)/i],[["name",/_/g," "],"version"],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,/(qqbrowser)[\/\s]?([\w\.]+)/i],["name","version"],[/(uc\s?browser)[\/\s]?([\w\.]+)/i,/ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i,/JUC.+(ucweb)[\/\s]?([\w\.]+)/i],[["name","UCBrowser"],
"version"],[/(dolfin)\/([\w\.]+)/i],[["name","Dolphin"],"version"],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[["name","Chrome"],"version"],[/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],["version",["name","MIUI Browser"]],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],["version",["name","Android Browser"]],[/FBAV\/([\w\.]+);/i],["version",["name","Facebook"]],[/fxios\/([\w\.-]+)/i],["version",["name","Firefox"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],["version",["name","Mobile Safari"]],
[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],["version","name"],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],["name",["version",e,{"1.0":"/8","1.2":"/1","1.3":"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}]],[/(konqueror)\/([\w\.]+)/i,/(webkit|khtml)\/([\w\.]+)/i],["name","version"],[/(navigator|netscape)\/([\w\.-]+)/i],[["name","Netscape"],"version"],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]+)*/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],["name","version"]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[["architecture","amd64"]],[/(ia32(?=;))/i],[["architecture",b.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[["architecture",
"ia32"]],[/windows\s(ce|mobile);\sppc;/i],[["architecture","arm"]],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[["architecture",/ower/,"",b.lowerize]],[/(sun4\w)[;\)]/i],[["architecture","sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[["architecture",b.lowerize]]],device:[[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],["model","vendor",["type","tablet"]],[/applecoremedia\/[\w\.]+ \((ipad)/],["model",["vendor","Apple"],["type",
"tablet"]],[/(apple\s{0,1}tv)/i],[["model","Apple TV"],["vendor","Apple"]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],["vendor","model",["type","tablet"]],[/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],["model",["vendor","Amazon"],["type","tablet"]],[/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i],[["model",e,{"Fire Phone":["SD","KF"]}],["vendor","Amazon"],["type","mobile"]],[/\((ip[honed|\s\w*]+);.+(apple)/i],
["model","vendor",["type","mobile"]],[/\((ip[honed|\s\w*]+);/i],["model",["vendor","Apple"],["type","mobile"]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],["vendor","model",["type","mobile"]],[/\(bb10;\s(\w+)/i],["model",["vendor","BlackBerry"],["type","mobile"]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i],["model",["vendor","Asus"],["type","tablet"]],
[/(sony)\s(tablet\s[ps])\sbuild\//i,/(sony)?(?:sgp.+)\sbuild\//i],[["vendor","Sony"],["model","Xperia Tablet"],["type","tablet"]],[/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i],[["vendor","Sony"],["model","Xperia Phone"],["type","mobile"]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],["vendor","model",["type","console"]],[/android.+;\s(shield)\sbuild/i],["model",["vendor","Nvidia"],["type","console"]],[/(playstation\s[34portablevi]+)/i],["model",["vendor","Sony"],["type","console"]],[/(sprint\s(\w+))/i],
[["vendor",e,{HTC:"APA",Sprint:"Sprint"}],["model",e,{"Evo Shift 4G":"7373KT"}],["type","mobile"]],[/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],["vendor","model",["type","tablet"]],[/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,/(zte)-(\w+)*/i,/(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],["vendor",["model",/_/g," "],["type","mobile"]],[/(nexus\s9)/i],["model",["vendor","HTC"],["type","tablet"]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],["model",["vendor","Microsoft"],["type",
"console"]],[/(kin\.[onetw]{3})/i],[["model",/\./g," "],["vendor","Microsoft"],["type","mobile"]],[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,/mot[\s-]?(\w+)*/i,/(XT\d{3,4}) build\//i,/(nexus\s[6])/i],["model",["vendor","Motorola"],["type","mobile"]],[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],["model",["vendor","Motorola"],["type","tablet"]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[["vendor","Samsung"],
"model",["type","tablet"]],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,/sec-((sgh\w+))/i],[["vendor","Samsung"],"model",["type","mobile"]],[/(samsung);smarttv/i],["vendor","model",["type","smarttv"]],[/\(dtv[\);].+(aquos)/i],["model",["vendor","Sharp"],["type","smarttv"]],[/sie-(\w+)*/i],["model",["vendor","Siemens"],["type","mobile"]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]+)*/i],[["vendor","Nokia"],"model",["type","mobile"]],[/android\s3\.[\s\w;-]{10}(a\d{3})/i],
["model",["vendor","Acer"],["type","tablet"]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[["vendor","LG"],"model",["type","tablet"]],[/(lg) netcast\.tv/i],["vendor","model",["type","smarttv"]],[/(nexus\s[45])/i,/lg[e;\s\/-]+(\w+)*/i],["model",["vendor","LG"],["type","mobile"]],[/android.+(ideatab[a-z0-9\-\s]+)/i],["model",["vendor","Lenovo"],["type","tablet"]],[/linux;.+((jolla));/i],["vendor","model",["type","mobile"]],[/((pebble))app\/[\d\.]+\s/i],["vendor","model",["type","wearable"]],[/android.+;\s(glass)\s\d/i],
["model",["vendor","Google"],["type","wearable"]],[/android.+(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i],[["model",/_/g," "],["vendor","Xiaomi"],["type","mobile"]],[/\s(tablet)[;\/\s]/i,/\s(mobile)[;\/\s]/i],[["type",b.lowerize],"vendor","model"]],engine:[[/windows.+\sedge\/([\w\.]+)/i],["version",["name","EdgeHTML"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,
/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],["name","version"],[/rv\:([\w\.]+).*(gecko)/i],["version","name"]],os:[[/microsoft\s(windows)\s(vista|xp)/i],["name","version"],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],["name",["version",e,d]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[["name","Windows"],["version",e,d]],[/\((bb)(10);/i],[["name","BlackBerry"],"version"],[/(blackberry)\w*\/?([\w\.]+)*/i,/(tizen)[\/\s]([\w\.]+)/i,
/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,/linux;.+(sailfish);/i],["name","version"],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],[["name","Symbian"],"version"],[/\((series40);/i],["name"],[/mozilla.+\(mobile;.+gecko.+firefox/i],[["name","Firefox OS"],"version"],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w+)*/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,
/(hurd|linux)\s?([\w\.]+)*/i,/(gnu)\s?([\w\.]+)*/i],["name","version"],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[["name","Chromium OS"],"version"],[/(sunos)\s?([\w\.]+\d)*/i],[["name","Solaris"],"version"],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],["name","version"],[/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i],[["name","iOS"],["version",/_/g,"."]],[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i,/(macintosh|mac(?=_powerpc)\s)/i],[["name","Mac OS"],["version",/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,
/(haiku)\s(\w+)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,/(unix)\s?([\w\.]+)*/i],["name","version"]]},m=function(a,e){if(!(this instanceof m))return(new m(a,e)).getResult();var d=a||(c&&c.navigator&&c.navigator.userAgent?c.navigator.userAgent:""),f=e?b.extend(l,e):l;this.getBrowser=function(){var a=g.apply(this,f.browser);a.major=b.major(a.version);return a};this.getCPU=function(){return g.apply(this,f.cpu)};this.getDevice=function(){return g.apply(this,
f.device)};this.getEngine=function(){return g.apply(this,f.engine)};this.getOS=function(){return g.apply(this,f.os)};this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}};this.getUA=function(){return d};this.setUA=function(a){d=a;return this};this.setUA(d);return this};m.VERSION="0.7.10";m.BROWSER={NAME:"name",MAJOR:"major",VERSION:"version"};m.CPU={ARCHITECTURE:"architecture"};m.DEVICE={MODEL:"model",
VENDOR:"vendor",TYPE:"type",CONSOLE:"console",MOBILE:"mobile",SMARTTV:"smarttv",TABLET:"tablet",WEARABLE:"wearable",EMBEDDED:"embedded"};m.ENGINE={NAME:"name",VERSION:"version"};m.OS={NAME:"name",VERSION:"version"};"undefined"!==typeof h?("undefined"!==typeof f&&f.exports&&(h=f.exports=m),h.UAParser=m):c.UAParser=m;var n=c.jQuery||c.Zepto;if("undefined"!==typeof n){var t=new m;n.ua=t.getResult();n.ua.get=function(){return t.getUA()};n.ua.set=function(a){t.setUA(a);a=t.getResult();for(var b in a)n.ua[b]=
a[b]}}})("object"===typeof window?window:this)},{}],7:[function(d,f,h){f.exports=function(a){for(var b=1;b<arguments.length;b++){var d=arguments[b],e;for(e in d)c.call(d,e)&&(a[e]=d[e])}return a};var c=Object.prototype.hasOwnProperty},{}]},{},[1])(1)});
