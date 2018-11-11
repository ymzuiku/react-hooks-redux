!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var o in r)("object"==typeof exports?exports:e)[o]=r[o]}}(window,function(){return function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t,r){"use strict";var o=r(/*! @babel/runtime/helpers/interopRequireDefault */1);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=(0,u.default)({isDev:!1,reducer:f,initialState:{},middleware:e.isDev?[y]:void 0,autoSave:{localName:void 0,keys:[]}},e),r=t.isDev,o=t.reducer,s=t.initialState,d=t.middleware,b=l.default.createContext(),m={isDev:r,useContext:function(){return l.default.useContext(b)},subscribe:p,dispatch:void 0,state:s,initialState:s};m.autoSave&&m.autoSave.localName&&g(m,m.autoSave.localName,m.autoSave.keys);var S=function(e,t){var r=o(e,t);if(d){if("[object Array]"!==Object.prototype.toString.call(d))throw new Error("react-hooks-redux: middleware isn't Array");for(var n=0;n<d.length;n++){var a=d[n](m,e,r,t);a&&(r=a)}}return v(t,r),r};return{Provider:function(e){var t=l.default.useReducer(S,s),r=(0,c.default)(t,2),o=r[0],u=r[1];m.dispatch||(m.dispatch=function(){var e=(0,i.default)(a.default.mark(function e(t){return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("function"!=typeof t){e.next=5;break}return e.next=3,t(u,m.state);case 3:e.next=6;break;case 5:u(t);case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}());return m.state=o,l.default.createElement(b.Provider,(0,n.default)({},e,{value:o}))},store:m}},t.autoSaveLocalStorage=g,t.middlewareLog=y,t.middlewareImmutableLog=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];if(!t||0===t.length)throw new Error("middlewareImmutableLog: no have immutable keys");return function(e,r,o,n){var a;e.isDev&&(a=void 0!==o&&o.toJS?function(e,t,r){for(var o={},n={},a=0;a<r.length;a++){var i=void 0,c=void 0;if("[object Array]"===Object.prototype.toString.call(r[a])?(i=e.getIn(r[a]),c=t.getIn(r[a])):(i=e.get(r[a]),c=t.get(r[a])),i!==c)if("[object Object]"===Object.prototype.toString.call(c))for(var u in o[r[a]]={},c){var l=e.getIn([r[a],u]),f=e.getIn([r[a],u]);l!==f&&(o[r[a]][u]=f)}else o[r[a]]=c;n[r[a]]=c}return[o,n]}(r,o,t):[r,o],console.log("%c|------- redux: ".concat(n.type," -------|"),"background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;"),console.log("|--diff:",a[0]),console.log("|--merge:",a[1]))}},t.storage=void 0;var n=o(r(/*! @babel/runtime/helpers/extends */2)),a=o(r(/*! @babel/runtime/regenerator */3)),i=o(r(/*! @babel/runtime/helpers/asyncToGenerator */4)),c=o(r(/*! @babel/runtime/helpers/slicedToArray */5)),u=o(r(/*! @babel/runtime/helpers/objectSpread */6)),l=o(r(/*! react */7));function f(e,t){return"function"==typeof t.reducer?t.reducer(e):e}var s={},d=0;function p(e){if("function"!=typeof e)throw new Error("react-hooks-redux: subscribe params need a function");return d++,function(){delete s[d]}}function v(e,t){for(var r in s)s[r](t)}var b={localName:"defaultIOKey",save:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:b.localName,r=Object.prototype.toString.call(e);"[object Object]"===r?localStorage.setItem(t,JSON.stringify(e)):"[object String]"===r?localStorage.setItem(t,e):console.warn("Warn: storage.save() param is no a Object")},load:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b.localName;try{var t=localStorage.getItem(e);if(t)return"string"==typeof t?JSON.parse(t):t}catch(e){console.warn("load last localSate error")}},clear:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b.localName;localStorage.setItem(e,{})}};function g(e,t,r){t&&(b.localName=t),"[object Array]"!==Object.prototype.toString.call(r)&&console.warn("autoSaveStorageKeys: params is no a Array");var o={};r.forEach(function(e){o[e]=void 0}),e.subscribe(function(){var t=e.getState();if(t&&t.toJS){var n={},a=!1;r.forEach(function(e){"[object Array]"===Object.prototype.toString.call(e)?n[e]=t.getIn(e):n[e]=t.get(e),o[e]!==n[e]&&(a=!0)}),a&&(b.save(n),r.forEach(function(e){o[e]=n[e]}))}else{var i={},c=!0;r.forEach(function(e){i[e]=t[e],o[e]!==i[e]&&(c=!0)}),c&&(b.save(i),r.forEach(function(e){o[e]=i[e]}))}});var n=b.load(b.localName);"[object Object]"===Object.prototype.toString.call(n)&&e.dispatch({type:"localStorageLoad: IO",reducer:function(e){if(e&&e.toJS){var t=(0,u.default)({},e.toJS(),n);for(var r in t)e=e.setIn(r,t[r]);return e}return(0,u.default)({},e,n)}})}function y(e,t,r,o){e.isDev&&(console.log("%c|------- redux: ".concat(o.type," -------|"),"background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;"),t&&"function"==typeof t.toJS?console.log("|--last:",t.toJS()):console.log("|--last:",t),r&&"function"==typeof r.toJS?console.log("|--next:",r.toJS()):console.log("|--next:",r))}t.storage=b},
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