!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var n in r)("object"==typeof exports?exports:e)[n]=r[n]}}(window,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
function(e,t,r){"use strict";var n=r(/*! @babel/runtime/helpers/interopRequireDefault */1);Object.defineProperty(t,"__esModule",{value:!0}),t.createDevLogFromImmutable=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];if(!t||0===t.length)return f;return function(e,r,n,o){var u=function(e,t,r){for(var n={},o={},u=0;u<r.length;u++){var i=void 0,c=void 0;if("[object Array]"===Object.prototype.toString.call(r[u])?(i=e.getIn(r[u]),c=t.getIn(r[u])):(i=e.get(r[u]),c=t.get(r[u])),i!==c)if("[object Object]"===Object.prototype.toString.call(c))for(var a in n[r[u]]={},c){var l=e.getIn([r[u],a]),f=e.getIn([r[u],a]);l!==f&&(n[r[u]][a]=f)}else n[r[u]]=c;o[r[u]]=c}return[n,o]}(e,r,t);o&&(console.log("%c|------- redux: ".concat(n.type," -------|"),"background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;"),console.log("|--diff:",u[0]),console.log("|--next:",u[1]))}},t.default=function(e){var t,r=(0,a.default)({isDev:!1,reducer:s,initialState:{},actions:{},middleware:e.isDev?[f]:void 0},e),n=r.isDev,d=r.reducer,p=r.initialState,b=r.actions,v=r.middleware,g=l.default.createContext(),y={useContext:function(){return l.default.useContext(g)},actions:b,dispatch:void 0,state:p,initialState:p};t=v?function(e,t){for(var r=d(e,t),o=0;o<v.length;o++){var u=v[o](e,r,t,n);u&&(r=u)}return r}:d;return{Provider:function(e){var r=l.default.useReducer(t,p),n=(0,c.default)(r,2),a=n[0],f=n[1];return y.dispatch||(y.dispatch=function(){var e=(0,i.default)(u.default.mark(function e(t){return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("function"!=typeof t){e.next=5;break}return e.next=3,t(f,y.state);case 3:e.next=6;break;case 5:f(t);case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()),y.state=a,l.default.createElement(g.Provider,(0,o.default)({},e,{value:a}))},store:y}};var o=n(r(/*! @babel/runtime/helpers/extends */2)),u=n(r(/*! @babel/runtime/regenerator */3)),i=n(r(/*! @babel/runtime/helpers/asyncToGenerator */4)),c=n(r(/*! @babel/runtime/helpers/slicedToArray */5)),a=n(r(/*! @babel/runtime/helpers/objectSpread */6)),l=n(r(/*! react */7));function f(e,t,r,n){n&&(console.log("%c|------- redux: ".concat(r.type," -------|"),"background: rgb(70, 70, 70); color: rgb(240, 235, 200); width:100%;"),e&&"function"==typeof e.toJS?console.log("|--last:",e.toJS()):console.log("|--last:",e),t&&"function"==typeof t.toJS?console.log("|--next:",t.toJS()):console.log("|--next:",t))}function s(e,t){return"function"==typeof t.reducer?t.reducer(e):e}},
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