!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var o in r)("object"==typeof exports?exports:e)[o]=r[o]}}(window,function(){return function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t,r){"use strict";var o=r(/*! @babel/runtime/helpers/interopRequireDefault */1);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,t=(0,c.default)({},v,e),r=t.isDev,o=t.reducer,f=t.initialState,s=t.middleware,b=t.autoSave,y=l.default.createContext(),m={isDev:r,_state:f,useContext:function(){return l.default.useContext(y)},subscribe:d,dispatch:void 0,getState:function(){return m._state},onload:[],initialState:f},S=!1,h=function(e,t){if(!t)return e;var r=o(e,t);if(!S){if("[object Array]"!==Object.prototype.toString.call(s))throw new Error("react-hooks-redux: middleware isn't Array");S=!0}for(var n=0;n<s.length;n++){var a=s[n](m,e,r,t);a&&(r=a)}return m._state=r,p(r,t),r};b&&b.item&&g(m,b.item,b.keys);return{Provider:function(e){var t=l.default.useReducer(h,f),r=(0,u.default)(t,2),o=r[0],c=r[1];m.dispatch||(m.dispatch=function(){var e=(0,i.default)(a.default.mark(function e(t){return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("function"!=typeof t){e.next=5;break}return e.next=3,t(c,m._state);case 3:e.next=6;break;case 5:c(t);case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}());return l.default.useEffect(function(){for(var e=0;e<m.onload.length;e++)m.onload[e]()},[]),l.default.createElement(y.Provider,(0,n.default)({},e,{value:o}))},store:m}},t.autoSaveLocalStorage=g,t.middlewareLog=y,t.storage=void 0;var n=o(r(/*! @babel/runtime/helpers/extends */2)),a=o(r(/*! @babel/runtime/regenerator */3)),i=o(r(/*! @babel/runtime/helpers/asyncToGenerator */4)),u=o(r(/*! @babel/runtime/helpers/slicedToArray */5)),c=o(r(/*! @babel/runtime/helpers/objectSpread */6)),l=o(r(/*! react */7));var f={},s=0;function d(e){if("function"!=typeof e)throw new Error("react-hooks-redux: subscribe params need a function");return f[++s]=e,function(){delete f[s]}}function p(e,t){for(var r in f)f[r](e,t)}var v={isDev:!1,reducer:function(e,t){return"function"==typeof t.reducer?t.reducer(e):e},initialState:{},middleware:[y],autoSave:{item:void 0,keys:[]}};var b={localName:"defaultIOKey",save:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:b.localName,r=Object.prototype.toString.call(e);"[object Object]"===r?localStorage.setItem(t,JSON.stringify(e)):"[object String]"===r?localStorage.setItem(t,e):console.warn("Warn: storage.save() param is no a Object")},load:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b.localName;try{var t=localStorage.getItem(e);if(t)return"string"==typeof t?JSON.parse(t):t}catch(e){console.warn("load last localSate error")}},clear:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b.localName;localStorage.setItem(e,{})}};function g(e,t,r){t&&(b.localName=t),"[object Array]"!==Object.prototype.toString.call(r)&&console.warn("autoSaveStorageKeys: params is no a Array");var o=b.load(b.localName);"[object Object]"===Object.prototype.toString.call(o)&&e.onload.push(function(){e.dispatch({type:"localStorageLoad: IO",reducer:function(e){if(e&&e.toJS){var t=(0,c.default)({},e.toJS(),o);for(var r in t)e=e.set(r,t[r]);return e}return(0,c.default)({},e,o)}})});var n={};r.forEach(function(e){n[e]=void 0}),e.subscribe(function(){var t=e.getState();if(t&&t.toJS){var o={},a=!1;r.forEach(function(e){"[object Array]"===Object.prototype.toString.call(e)?o[e]=t.getIn(e):o[e]=t.get(e),n[e]!==o[e]&&(a=!0),n[e]=o[e]}),a&&b.save(o)}else{var i={},u=!0;r.forEach(function(e){i[e]=t[e],n[e]!==i[e]&&(u=!0),n[e]=i[e]}),u&&b.save(i)}})}function y(e,t,r,o){if(e.isDev&&!o.$NOLOG)if(console.log("%c|------- redux: ".concat(o.type," -------|"),"background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;"),!o.$OBJLOG&&r&&"function"==typeof r.toJS){var n={};if(r.map(function(e,t){n[t]=e}),o.$LASTLOG){var a={};t.map(function(e,t){a[t]=e}),console.log("|--last",a),console.log("|--next",n)}else console.log("|--",n)}else if(o.$LASTLOG){var i={};t.map(function(e,t){i[t]=e}),console.log("|--last",t),console.log("|--next",r)}else console.log("|--",r)}t.storage=b},
/*!***************************************************************!*\
  !*** external "@babel/runtime/helpers/interopRequireDefault" ***!
  \***************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t){e.exports=require("@babel/runtime/helpers/interopRequireDefault")},
/*!*************************************************!*\
  !*** external "@babel/runtime/helpers/extends" ***!
  \*************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t){e.exports=require("@babel/runtime/helpers/extends")},
/*!*********************************************!*\
  !*** external "@babel/runtime/regenerator" ***!
  \*********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t){e.exports=require("@babel/runtime/regenerator")},
/*!**********************************************************!*\
  !*** external "@babel/runtime/helpers/asyncToGenerator" ***!
  \**********************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t){e.exports=require("@babel/runtime/helpers/asyncToGenerator")},
/*!*******************************************************!*\
  !*** external "@babel/runtime/helpers/slicedToArray" ***!
  \*******************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t){e.exports=require("@babel/runtime/helpers/slicedToArray")},
/*!******************************************************!*\
  !*** external "@babel/runtime/helpers/objectSpread" ***!
  \******************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t){e.exports=require("@babel/runtime/helpers/objectSpread")},
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t){e.exports=require("react")}])});
//# sourceMappingURL=index.js.map