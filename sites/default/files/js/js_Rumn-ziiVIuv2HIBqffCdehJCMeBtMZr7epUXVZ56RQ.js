/* Source and licensing information for the line(s) below can be found at https://help.unicef.org/core/misc/drupalSettingsLoader.js. */
(function(){var t=document.querySelector('head > script[type="application/json"][data-drupal-selector="drupal-settings-json"], body > script[type="application/json"][data-drupal-selector="drupal-settings-json"]');window.drupalSettings={};if(t!==null){window.drupalSettings=JSON.parse(t.textContent)}})();
/* Source and licensing information for the above line(s) can be found at https://help.unicef.org/core/misc/drupalSettingsLoader.js. */;
/* Source and licensing information for the line(s) below can be found at https://help.unicef.org/sites/default/files/languages/en_Z1uWU1Y5jVizPH01v0fZ_NZCv56c2YTL0Zq9vmA6Wxk.js. */
window.drupalTranslations = {"strings":{"":{"Next":"Donate"}}};
/* Source and licensing information for the above line(s) can be found at https://help.unicef.org/sites/default/files/languages/en_Z1uWU1Y5jVizPH01v0fZ_NZCv56c2YTL0Zq9vmA6Wxk.js. */;
/* Source and licensing information for the line(s) below can be found at https://help.unicef.org/core/misc/drupal.js. */
;window.Drupal={behaviors:{},locale:{}};(function(t,e,r,n,o,a){t.throwError=function(t){setTimeout(function(){throw t},0)};t.attachBehaviors=function(r,n){r=r||document;n=n||e;var o=t.behaviors;Object.keys(o||{}).forEach(function(e){if(typeof o[e].attach==='function'){try{o[e].attach(r,n)}catch(a){t.throwError(a)}}})};t.detachBehaviors=function(r,n,o){r=r||document;n=n||e;o=o||'unload';var a=t.behaviors;Object.keys(a||{}).forEach(function(e){if(typeof a[e].detach==='function'){try{a[e].detach(r,n,o)}catch(c){t.throwError(c)}}})};t.checkPlain=function(t){t=t.toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');return t};t.formatString=function(e,r){var n={};Object.keys(r||{}).forEach(function(e){switch(e.charAt(0)){case'@':n[e]=t.checkPlain(r[e]);break;case'!':n[e]=r[e];break;default:n[e]=t.theme('placeholder',r[e]);break}});return t.stringReplace(e,n,null)};t.stringReplace=function(e,r,n){if(e.length===0){return e};if(!Array.isArray(n)){n=Object.keys(r||{});n.sort(function(t,e){return t.length-e.length})};if(n.length===0){return e};var c=n.pop(),a=e.split(c);if(n.length){for(var o=0;o<a.length;o++){a[o]=t.stringReplace(a[o],r,n.slice(0))}};return a.join(r[c])};t.t=function(e,o,n){n=n||{};n.context=n.context||'';if(typeof r!=='undefined'&&r.strings&&r.strings[n.context]&&r.strings[n.context][e]){e=r.strings[n.context][e]};if(o){e=t.formatString(e,o)};return e};t.url=function(t){return e.path.baseUrl+e.path.pathPrefix+t};t.url.toAbsolute=function(t){var r=document.createElement('a');try{t=decodeURIComponent(t)}catch(e){};r.setAttribute('href',t);return r.cloneNode(!1).href};t.url.isLocal=function(r){var n=t.url.toAbsolute(r),c=window.location.protocol;if(c==='http:'&&n.indexOf('https:')===0){c='https:'};var o=''.concat(c,'//').concat(window.location.host).concat(e.path.baseUrl.slice(0,-1));try{n=decodeURIComponent(n)}catch(a){};try{o=decodeURIComponent(o)}catch(a){};return n===o||n.indexOf(''.concat(o,'/'))===0};t.formatPlural=function(n,o,c,a,u){a=a||{};a['@count']=n;var l=e.pluralDelimiter,f=t.t(o+l+c,a,u).split(l),i=0;if(typeof r!=='undefined'&&r.pluralFormula){i=n in r.pluralFormula?r.pluralFormula[n]:r.pluralFormula.default}
else if(a['@count']!==1){i=1};return f[i]};t.encodePath=function(t){return window.encodeURIComponent(t).replace(/%2F/g,'/')};t.deprecationError=function(t){var r=t.message;if(e.suppressDeprecationErrors===!1&&typeof n!=='undefined'&&n.warn){n.warn('[Deprecation] '.concat(r))}};t.deprecatedProperty=function(e){var r=e.target,n=e.deprecatedProperty,c=e.message;if(!o||!a){return r};return new o(r,{get:function(e,r){if(r===n){t.deprecationError({message:c})};for(var i=arguments.length,u=new Array(i>2?i-2:0),o=2;o<i;o++){u[o-2]=arguments[o]};return a.get.apply(a,[e,r].concat(u))}})};t.theme=function(e){if(e in t.theme){var a;for(var n=arguments.length,o=new Array(n>1?n-1:0),r=1;r<n;r++){o[r-1]=arguments[r]};return(a=t.theme)[e].apply(a,o)}};t.theme.placeholder=function(e){return'<em class="placeholder">'.concat(t.checkPlain(e),'</em>')}})(Drupal,window.drupalSettings,window.drupalTranslations,window.console,window.Proxy,window.Reflect);
/* Source and licensing information for the above line(s) can be found at https://help.unicef.org/core/misc/drupal.js. */;
/* Source and licensing information for the line(s) below can be found at https://help.unicef.org/core/misc/drupal.init.js. */
;if(window.jQuery){jQuery.noConflict()};document.documentElement.className+=' js';(function(e,n){var t=function(e){var n=function t(){e();document.removeEventListener('DOMContentLoaded',t)};if(document.readyState!=='loading'){setTimeout(e,0)}
else{document.addEventListener('DOMContentLoaded',n)}};t(function(){e.attachBehaviors(document,n)})})(Drupal,window.drupalSettings);
/* Source and licensing information for the above line(s) can be found at https://help.unicef.org/core/misc/drupal.init.js. */;
/* Source and licensing information for the line(s) below can be found at https://help.unicef.org/core/assets/vendor/js-cookie/js.cookie.min.js. */
/*! js-cookie v3.0.0-rc.0 | MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var r=e.Cookies,n=e.Cookies=t();n.noConflict=function(){return e.Cookies=r,n}}())}(this,function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)e[n]=r[n]}return e}var t={read:function(e){return e.replace(/%3B/g,";")},write:function(e){return e.replace(/;/g,"%3B")}};return function r(n,i){function o(r,o,u){if("undefined"!=typeof document){"number"==typeof(u=e({},i,u)).expires&&(u.expires=new Date(Date.now()+864e5*u.expires)),u.expires&&(u.expires=u.expires.toUTCString()),r=t.write(r).replace(/=/g,"%3D"),o=n.write(String(o),r);var c="";for(var f in u)u[f]&&(c+="; "+f,!0!==u[f]&&(c+="="+u[f].split(";")[0]));return document.cookie=r+"="+o+c}}return Object.create({set:o,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var r=document.cookie?document.cookie.split("; "):[],i={},o=0;o<r.length;o++){var u=r[o].split("="),c=u.slice(1).join("="),f=t.read(u[0]).replace(/%3D/g,"=");if(i[f]=n.read(c,f),e===f)break}return e?i[e]:i}},remove:function(t,r){o(t,"",e({},r,{expires:-1}))},withAttributes:function(t){return r(this.converter,e({},this.attributes,t))},withConverter:function(t){return r(e({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(i)},converter:{value:Object.freeze(n)}})}(t,{path:"/"})});

/* Source and licensing information for the above line(s) can be found at https://help.unicef.org/core/assets/vendor/js-cookie/js.cookie.min.js. */;
/* Source and licensing information for the line(s) below can be found at https://help.unicef.org/core/misc/jquery.cookie.shim.js. */
;function ownKeys(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);if(r){t=t.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})};n.push.apply(n,t)};return n};function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};if(t%2){ownKeys(Object(r),!0).forEach(function(t){_defineProperty(e,t,r[t])})}
else if(Object.getOwnPropertyDescriptors){Object.defineProperties(e,Object.getOwnPropertyDescriptors(r))}
else{ownKeys(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}};return e};function _defineProperty(e,r,t){if(r in e){Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0})}
else{e[r]=t};return e}(function(e,r,t){var n='is deprecated in Drupal 9.0.0 and will be removed in Drupal 10.0.0. Use the core/js-cookie library instead. See https://www.drupal.org/node/3104677',o=function(e){return Object.prototype.toString.call(e)==='[object Function]'},i=function(e,r){if(e.indexOf('"')===0){e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\')};try{e=decodeURIComponent(e.replace(/\+/g,' '));return r?JSON.parse(e):e}catch(t){}},c=function(e,r,t,c,a){var n=c?e:i(e,a);if(t!==undefined&&o(t)){return t(n,r)};return n};e.cookie=function(i){var a=arguments.length>1&&arguments[1]!==undefined?arguments[1]:undefined,l=arguments.length>2&&arguments[2]!==undefined?arguments[2]:undefined;r.deprecationError({message:'jQuery.cookie() '.concat(n)});i=i&&!e.cookie.raw?encodeURIComponent(i):i;if(a!==undefined&&!o(a)){var u=_objectSpread(_objectSpread({},e.cookie.defaults),l);if(typeof u.expires==='string'&&u.expires!==''){u.expires=new Date(u.expires)};var p=t.withConverter({write:function(e){return encodeURIComponent(e)}});a=e.cookie.json&&!e.cookie.raw?JSON.stringify(a):String(a);return p.set(i,a,u)};var d=a,f=t.withConverter({read:function(r,t){return c(r,t,d,e.cookie.raw,e.cookie.json)}});if(i!==undefined){return f.get(i)};var s=f.get();Object.keys(s).forEach(function(e){if(s[e]===undefined){delete s[e]}});return s};e.cookie.defaults=_objectSpread({path:''},t.defaults);e.cookie.json=!1;e.cookie.raw=!1;e.removeCookie=function(o,i){r.deprecationError({message:'jQuery.removeCookie() '.concat(n)});t.remove(o,_objectSpread(_objectSpread({},e.cookie.defaults),i));return!t.get(o)}})(jQuery,Drupal,window.Cookies);
/* Source and licensing information for the above line(s) can be found at https://help.unicef.org/core/misc/jquery.cookie.shim.js. */;
/* Source and licensing information for the line(s) below can be found at https://help.unicef.org/libraries/url-search-params-polyfill/index.js. */
(function(t){"use strict";var r=(t.URLSearchParams&&t.URLSearchParams.prototype.get)?t.URLSearchParams:null,s=r&&(new r({a:1})).toString()==="a=1",l=r&&(new r("s=%2B").get("s")==="+"),e="__URLSearchParams__",y=r?(function(){var t=new r();t.append("s"," &");return t.toString()==="s=+%26"})():!0,i=a.prototype,h=!!(t.Symbol&&t.Symbol.iterator);if(r&&s&&l&&y){return};function a(t){t=t||"";if(t instanceof URLSearchParams||t instanceof a){t=t.toString()};this[e]=c(t)};i.append=function(t,n){o(this[e],t,n)};i["delete"]=function(t){delete this[e][t]};i.get=function(t){var n=this[e];return t in n?n[t][0]:null};i.getAll=function(t){var n=this[e];return t in n?n[t].slice(0):[]};i.has=function(t){return t in this[e]};i.set=function(t,n){this[e][t]=[""+n]};i.toString=function(){var i=this[e],o=[],t,n,a,r;for(n in i){a=p(n);for(t=0,r=i[n];t<r.length;t++){o.push(a+"="+p(r[t]))}};return o.join("&")};var S=!l,v=(!S&&r&&!s&&t.Proxy);Object.defineProperty(t,"URLSearchParams",{value:(v?new Proxy(r,{construct:function(t,n){return new t((new a(n[0]).toString()))}}):a)});var n=t.URLSearchParams.prototype;n.polyfill=!0;n.forEach=n.forEach||function(t,n){var r=c(this.toString());Object.getOwnPropertyNames(r).forEach(function(e){r[e].forEach(function(r){t.call(n,r,e,this)},this)},this)};n.sort=n.sort||function(){var o=c(this.toString()),n=[],a,t,r;for(a in o){n.push(a)};n.sort();for(t=0;t<n.length;t++){this["delete"](n[t])};for(t=0;t<n.length;t++){var e=n[t],i=o[e];for(r=0;r<i.length;r++){this.append(e,i[r])}}};n.keys=n.keys||function(){var t=[];this.forEach(function(n,r){t.push(r)});return u(t)};n.values=n.values||function(){var t=[];this.forEach(function(n){t.push(n)});return u(t)};n.entries=n.entries||function(){var t=[];this.forEach(function(n,r){t.push([r,n])});return u(t)};if(h){n[t.Symbol.iterator]=n[t.Symbol.iterator]||n.entries};function p(t){var n={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\x00"};return encodeURIComponent(t).replace(/[!'\(\)~]|%20|%00/g,function(t){return n[t]})};function f(t){return t.replace(/[ +]/g,"%20").replace(/(%[a-f0-9]{2})+/ig,function(t){return decodeURIComponent(t)})};function u(n){var r={next:function(){var t=n.shift();return{done:t===undefined,value:t}}};if(h){r[t.Symbol.iterator]=function(){return r}};return r};function c(t){var r={};if(typeof t==="object"){if(g(t)){for(var c=0;c<t.length;c++){var e=t[c];if(g(e)&&e.length===2){o(r,e[0],e[1])}
else{throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements")}}}
else{for(var u in t){if(t.hasOwnProperty(u)){o(r,u,t[u])}}}}
else{if(t.indexOf("?")===0){t=t.slice(1)};var s=t.split("&");for(var a=0;a<s.length;a++){var n=s[a],i=n.indexOf("=");if(-1<i){o(r,f(n.slice(0,i)),f(n.slice(i+1)))}
else{if(n){o(r,f(n),"")}}}};return r};function o(t,n,r){var e=typeof r==="string"?r:(r!==null&&r!==undefined&&typeof r.toString==="function"?r.toString():JSON.stringify(r));if(n in t){t[n].push(e)}
else{t[n]=[e]}};function g(t){return!!t&&"[object Array]"===Object.prototype.toString.call(t)}})(typeof global!=="undefined"?global:(typeof window!=="undefined"?window:this));
/* Source and licensing information for the above line(s) can be found at https://help.unicef.org/libraries/url-search-params-polyfill/index.js. */;
/* Source and licensing information for the line(s) below can be found at https://help.unicef.org/modules/custom/unicef_locale_redirect/js/cookie_redirect.js. */
(function(t,e,c,a){var r=t.cookie('Drupal.visitor.selected_country_code'),o=new URLSearchParams(e.location.search),n=o.get('country');if(r&&!n&&n!==''){o.append('country',r);e.location.search=encodeURI(o.toString())}})(jQuery,window,Drupal,drupalSettings);
/* Source and licensing information for the above line(s) can be found at https://help.unicef.org/modules/custom/unicef_locale_redirect/js/cookie_redirect.js. */;