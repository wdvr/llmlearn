function Kc(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const o in r)if(o!=="default"&&!(o in e)){const l=Object.getOwnPropertyDescriptor(r,o);l&&Object.defineProperty(e,o,l.get?l:{enumerable:!0,get:()=>r[o]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}})();function Gc(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var xa={exports:{}},ho={},Sa={exports:{}},R={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var or=Symbol.for("react.element"),bc=Symbol.for("react.portal"),Yc=Symbol.for("react.fragment"),Xc=Symbol.for("react.strict_mode"),Jc=Symbol.for("react.profiler"),Zc=Symbol.for("react.provider"),ed=Symbol.for("react.context"),td=Symbol.for("react.forward_ref"),nd=Symbol.for("react.suspense"),rd=Symbol.for("react.memo"),od=Symbol.for("react.lazy"),os=Symbol.iterator;function ld(e){return e===null||typeof e!="object"?null:(e=os&&e[os]||e["@@iterator"],typeof e=="function"?e:null)}var Pa={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Ca=Object.assign,Ea={};function pn(e,t,n){this.props=e,this.context=t,this.refs=Ea,this.updater=n||Pa}pn.prototype.isReactComponent={};pn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};pn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Na(){}Na.prototype=pn.prototype;function li(e,t,n){this.props=e,this.context=t,this.refs=Ea,this.updater=n||Pa}var ii=li.prototype=new Na;ii.constructor=li;Ca(ii,pn.prototype);ii.isPureReactComponent=!0;var ls=Array.isArray,Ta=Object.prototype.hasOwnProperty,si={current:null},Ma={key:!0,ref:!0,__self:!0,__source:!0};function za(e,t,n){var r,o={},l=null,i=null;if(t!=null)for(r in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(l=""+t.key),t)Ta.call(t,r)&&!Ma.hasOwnProperty(r)&&(o[r]=t[r]);var s=arguments.length-2;if(s===1)o.children=n;else if(1<s){for(var a=Array(s),u=0;u<s;u++)a[u]=arguments[u+2];o.children=a}if(e&&e.defaultProps)for(r in s=e.defaultProps,s)o[r]===void 0&&(o[r]=s[r]);return{$$typeof:or,type:e,key:l,ref:i,props:o,_owner:si.current}}function id(e,t){return{$$typeof:or,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function ai(e){return typeof e=="object"&&e!==null&&e.$$typeof===or}function sd(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var is=/\/+/g;function Fo(e,t){return typeof e=="object"&&e!==null&&e.key!=null?sd(""+e.key):t.toString(36)}function zr(e,t,n,r,o){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(l){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case or:case bc:i=!0}}if(i)return i=e,o=o(i),e=r===""?"."+Fo(i,0):r,ls(o)?(n="",e!=null&&(n=e.replace(is,"$&/")+"/"),zr(o,t,n,"",function(u){return u})):o!=null&&(ai(o)&&(o=id(o,n+(!o.key||i&&i.key===o.key?"":(""+o.key).replace(is,"$&/")+"/")+e)),t.push(o)),1;if(i=0,r=r===""?".":r+":",ls(e))for(var s=0;s<e.length;s++){l=e[s];var a=r+Fo(l,s);i+=zr(l,t,n,a,o)}else if(a=ld(e),typeof a=="function")for(e=a.call(e),s=0;!(l=e.next()).done;)l=l.value,a=r+Fo(l,s++),i+=zr(l,t,n,a,o);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function pr(e,t,n){if(e==null)return e;var r=[],o=0;return zr(e,r,"","",function(l){return t.call(n,l,o++)}),r}function ad(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var ue={current:null},Lr={transition:null},ud={ReactCurrentDispatcher:ue,ReactCurrentBatchConfig:Lr,ReactCurrentOwner:si};function La(){throw Error("act(...) is not supported in production builds of React.")}R.Children={map:pr,forEach:function(e,t,n){pr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return pr(e,function(){t++}),t},toArray:function(e){return pr(e,function(t){return t})||[]},only:function(e){if(!ai(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};R.Component=pn;R.Fragment=Yc;R.Profiler=Jc;R.PureComponent=li;R.StrictMode=Xc;R.Suspense=nd;R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ud;R.act=La;R.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Ca({},e.props),o=e.key,l=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,i=si.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(a in t)Ta.call(t,a)&&!Ma.hasOwnProperty(a)&&(r[a]=t[a]===void 0&&s!==void 0?s[a]:t[a])}var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){s=Array(a);for(var u=0;u<a;u++)s[u]=arguments[u+2];r.children=s}return{$$typeof:or,type:e.type,key:o,ref:l,props:r,_owner:i}};R.createContext=function(e){return e={$$typeof:ed,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Zc,_context:e},e.Consumer=e};R.createElement=za;R.createFactory=function(e){var t=za.bind(null,e);return t.type=e,t};R.createRef=function(){return{current:null}};R.forwardRef=function(e){return{$$typeof:td,render:e}};R.isValidElement=ai;R.lazy=function(e){return{$$typeof:od,_payload:{_status:-1,_result:e},_init:ad}};R.memo=function(e,t){return{$$typeof:rd,type:e,compare:t===void 0?null:t}};R.startTransition=function(e){var t=Lr.transition;Lr.transition={};try{e()}finally{Lr.transition=t}};R.unstable_act=La;R.useCallback=function(e,t){return ue.current.useCallback(e,t)};R.useContext=function(e){return ue.current.useContext(e)};R.useDebugValue=function(){};R.useDeferredValue=function(e){return ue.current.useDeferredValue(e)};R.useEffect=function(e,t){return ue.current.useEffect(e,t)};R.useId=function(){return ue.current.useId()};R.useImperativeHandle=function(e,t,n){return ue.current.useImperativeHandle(e,t,n)};R.useInsertionEffect=function(e,t){return ue.current.useInsertionEffect(e,t)};R.useLayoutEffect=function(e,t){return ue.current.useLayoutEffect(e,t)};R.useMemo=function(e,t){return ue.current.useMemo(e,t)};R.useReducer=function(e,t,n){return ue.current.useReducer(e,t,n)};R.useRef=function(e){return ue.current.useRef(e)};R.useState=function(e){return ue.current.useState(e)};R.useSyncExternalStore=function(e,t,n){return ue.current.useSyncExternalStore(e,t,n)};R.useTransition=function(){return ue.current.useTransition()};R.version="18.3.1";Sa.exports=R;var w=Sa.exports;const ui=Gc(w),cd=Kc({__proto__:null,default:ui},[w]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var dd=w,fd=Symbol.for("react.element"),pd=Symbol.for("react.fragment"),md=Object.prototype.hasOwnProperty,hd=dd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,vd={key:!0,ref:!0,__self:!0,__source:!0};function ja(e,t,n){var r,o={},l=null,i=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(i=t.ref);for(r in t)md.call(t,r)&&!vd.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)o[r]===void 0&&(o[r]=t[r]);return{$$typeof:fd,type:e,key:l,ref:i,props:o,_owner:hd.current}}ho.Fragment=pd;ho.jsx=ja;ho.jsxs=ja;xa.exports=ho;var m=xa.exports,ul={},Ra={exports:{}},we={},Oa={exports:{}},Ia={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(T,z){var j=T.length;T.push(z);e:for(;0<j;){var H=j-1>>>1,X=T[H];if(0<o(X,z))T[H]=z,T[j]=X,j=H;else break e}}function n(T){return T.length===0?null:T[0]}function r(T){if(T.length===0)return null;var z=T[0],j=T.pop();if(j!==z){T[0]=j;e:for(var H=0,X=T.length,dr=X>>>1;H<dr;){var xt=2*(H+1)-1,Io=T[xt],St=xt+1,fr=T[St];if(0>o(Io,j))St<X&&0>o(fr,Io)?(T[H]=fr,T[St]=j,H=St):(T[H]=Io,T[xt]=j,H=xt);else if(St<X&&0>o(fr,j))T[H]=fr,T[St]=j,H=St;else break e}}return z}function o(T,z){var j=T.sortIndex-z.sortIndex;return j!==0?j:T.id-z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;e.unstable_now=function(){return l.now()}}else{var i=Date,s=i.now();e.unstable_now=function(){return i.now()-s}}var a=[],u=[],h=1,p=null,v=3,y=!1,_=!1,k=!1,P=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,c=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function d(T){for(var z=n(u);z!==null;){if(z.callback===null)r(u);else if(z.startTime<=T)r(u),z.sortIndex=z.expirationTime,t(a,z);else break;z=n(u)}}function g(T){if(k=!1,d(T),!_)if(n(a)!==null)_=!0,Ro(S);else{var z=n(u);z!==null&&Oo(g,z.startTime-T)}}function S(T,z){_=!1,k&&(k=!1,f(M),M=-1),y=!0;var j=v;try{for(d(z),p=n(a);p!==null&&(!(p.expirationTime>z)||T&&!ve());){var H=p.callback;if(typeof H=="function"){p.callback=null,v=p.priorityLevel;var X=H(p.expirationTime<=z);z=e.unstable_now(),typeof X=="function"?p.callback=X:p===n(a)&&r(a),d(z)}else r(a);p=n(a)}if(p!==null)var dr=!0;else{var xt=n(u);xt!==null&&Oo(g,xt.startTime-z),dr=!1}return dr}finally{p=null,v=j,y=!1}}var C=!1,E=null,M=-1,W=5,L=-1;function ve(){return!(e.unstable_now()-L<W)}function vn(){if(E!==null){var T=e.unstable_now();L=T;var z=!0;try{z=E(!0,T)}finally{z?gn():(C=!1,E=null)}}else C=!1}var gn;if(typeof c=="function")gn=function(){c(vn)};else if(typeof MessageChannel<"u"){var rs=new MessageChannel,Qc=rs.port2;rs.port1.onmessage=vn,gn=function(){Qc.postMessage(null)}}else gn=function(){P(vn,0)};function Ro(T){E=T,C||(C=!0,gn())}function Oo(T,z){M=P(function(){T(e.unstable_now())},z)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(T){T.callback=null},e.unstable_continueExecution=function(){_||y||(_=!0,Ro(S))},e.unstable_forceFrameRate=function(T){0>T||125<T?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):W=0<T?Math.floor(1e3/T):5},e.unstable_getCurrentPriorityLevel=function(){return v},e.unstable_getFirstCallbackNode=function(){return n(a)},e.unstable_next=function(T){switch(v){case 1:case 2:case 3:var z=3;break;default:z=v}var j=v;v=z;try{return T()}finally{v=j}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(T,z){switch(T){case 1:case 2:case 3:case 4:case 5:break;default:T=3}var j=v;v=T;try{return z()}finally{v=j}},e.unstable_scheduleCallback=function(T,z,j){var H=e.unstable_now();switch(typeof j=="object"&&j!==null?(j=j.delay,j=typeof j=="number"&&0<j?H+j:H):j=H,T){case 1:var X=-1;break;case 2:X=250;break;case 5:X=1073741823;break;case 4:X=1e4;break;default:X=5e3}return X=j+X,T={id:h++,callback:z,priorityLevel:T,startTime:j,expirationTime:X,sortIndex:-1},j>H?(T.sortIndex=j,t(u,T),n(a)===null&&T===n(u)&&(k?(f(M),M=-1):k=!0,Oo(g,j-H))):(T.sortIndex=X,t(a,T),_||y||(_=!0,Ro(S))),T},e.unstable_shouldYield=ve,e.unstable_wrapCallback=function(T){var z=v;return function(){var j=v;v=z;try{return T.apply(this,arguments)}finally{v=j}}}})(Ia);Oa.exports=Ia;var gd=Oa.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yd=w,ke=gd;function x(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Fa=new Set,An={};function Ft(e,t){ln(e,t),ln(e+"Capture",t)}function ln(e,t){for(An[e]=t,e=0;e<t.length;e++)Fa.add(t[e])}var Ke=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),cl=Object.prototype.hasOwnProperty,_d=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ss={},as={};function kd(e){return cl.call(as,e)?!0:cl.call(ss,e)?!1:_d.test(e)?as[e]=!0:(ss[e]=!0,!1)}function wd(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function xd(e,t,n,r){if(t===null||typeof t>"u"||wd(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ce(e,t,n,r,o,l,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=i}var ne={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ne[e]=new ce(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ne[t]=new ce(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ne[e]=new ce(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ne[e]=new ce(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ne[e]=new ce(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ne[e]=new ce(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ne[e]=new ce(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ne[e]=new ce(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ne[e]=new ce(e,5,!1,e.toLowerCase(),null,!1,!1)});var ci=/[\-:]([a-z])/g;function di(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ci,di);ne[t]=new ce(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ci,di);ne[t]=new ce(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ci,di);ne[t]=new ce(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ne[e]=new ce(e,1,!1,e.toLowerCase(),null,!1,!1)});ne.xlinkHref=new ce("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ne[e]=new ce(e,1,!1,e.toLowerCase(),null,!0,!0)});function fi(e,t,n,r){var o=ne.hasOwnProperty(t)?ne[t]:null;(o!==null?o.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(xd(t,n,o,r)&&(n=null),r||o===null?kd(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=n===null?o.type===3?!1:"":n:(t=o.attributeName,r=o.attributeNamespace,n===null?e.removeAttribute(t):(o=o.type,n=o===3||o===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var Xe=yd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,mr=Symbol.for("react.element"),Bt=Symbol.for("react.portal"),Vt=Symbol.for("react.fragment"),pi=Symbol.for("react.strict_mode"),dl=Symbol.for("react.profiler"),Ua=Symbol.for("react.provider"),Da=Symbol.for("react.context"),mi=Symbol.for("react.forward_ref"),fl=Symbol.for("react.suspense"),pl=Symbol.for("react.suspense_list"),hi=Symbol.for("react.memo"),Ze=Symbol.for("react.lazy"),Aa=Symbol.for("react.offscreen"),us=Symbol.iterator;function yn(e){return e===null||typeof e!="object"?null:(e=us&&e[us]||e["@@iterator"],typeof e=="function"?e:null)}var q=Object.assign,Uo;function En(e){if(Uo===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Uo=t&&t[1]||""}return`
`+Uo+e}var Do=!1;function Ao(e,t){if(!e||Do)return"";Do=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(u){var r=u}Reflect.construct(e,[],t)}else{try{t.call()}catch(u){r=u}e.call(t.prototype)}else{try{throw Error()}catch(u){r=u}e()}}catch(u){if(u&&r&&typeof u.stack=="string"){for(var o=u.stack.split(`
`),l=r.stack.split(`
`),i=o.length-1,s=l.length-1;1<=i&&0<=s&&o[i]!==l[s];)s--;for(;1<=i&&0<=s;i--,s--)if(o[i]!==l[s]){if(i!==1||s!==1)do if(i--,s--,0>s||o[i]!==l[s]){var a=`
`+o[i].replace(" at new "," at ");return e.displayName&&a.includes("<anonymous>")&&(a=a.replace("<anonymous>",e.displayName)),a}while(1<=i&&0<=s);break}}}finally{Do=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?En(e):""}function Sd(e){switch(e.tag){case 5:return En(e.type);case 16:return En("Lazy");case 13:return En("Suspense");case 19:return En("SuspenseList");case 0:case 2:case 15:return e=Ao(e.type,!1),e;case 11:return e=Ao(e.type.render,!1),e;case 1:return e=Ao(e.type,!0),e;default:return""}}function ml(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Vt:return"Fragment";case Bt:return"Portal";case dl:return"Profiler";case pi:return"StrictMode";case fl:return"Suspense";case pl:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Da:return(e.displayName||"Context")+".Consumer";case Ua:return(e._context.displayName||"Context")+".Provider";case mi:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case hi:return t=e.displayName||null,t!==null?t:ml(e.type)||"Memo";case Ze:t=e._payload,e=e._init;try{return ml(e(t))}catch{}}return null}function Pd(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ml(t);case 8:return t===pi?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function vt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Wa(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Cd(e){var t=Wa(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var o=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(i){r=""+i,l.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function hr(e){e._valueTracker||(e._valueTracker=Cd(e))}function Ba(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Wa(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function qr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function hl(e,t){var n=t.checked;return q({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function cs(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=vt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Va(e,t){t=t.checked,t!=null&&fi(e,"checked",t,!1)}function vl(e,t){Va(e,t);var n=vt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?gl(e,t.type,n):t.hasOwnProperty("defaultValue")&&gl(e,t.type,vt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function ds(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function gl(e,t,n){(t!=="number"||qr(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Nn=Array.isArray;function Zt(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+vt(n),t=null,o=0;o<e.length;o++){if(e[o].value===n){e[o].selected=!0,r&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function yl(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(x(91));return q({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function fs(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(x(92));if(Nn(n)){if(1<n.length)throw Error(x(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:vt(n)}}function qa(e,t){var n=vt(t.value),r=vt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function ps(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function $a(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function _l(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?$a(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var vr,Ha=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,o)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(vr=vr||document.createElement("div"),vr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=vr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Wn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var zn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ed=["Webkit","ms","Moz","O"];Object.keys(zn).forEach(function(e){Ed.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),zn[t]=zn[e]})});function Qa(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||zn.hasOwnProperty(e)&&zn[e]?(""+t).trim():t+"px"}function Ka(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,o=Qa(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}var Nd=q({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function kl(e,t){if(t){if(Nd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(x(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(x(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(x(61))}if(t.style!=null&&typeof t.style!="object")throw Error(x(62))}}function wl(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var xl=null;function vi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Sl=null,en=null,tn=null;function ms(e){if(e=sr(e)){if(typeof Sl!="function")throw Error(x(280));var t=e.stateNode;t&&(t=ko(t),Sl(e.stateNode,e.type,t))}}function Ga(e){en?tn?tn.push(e):tn=[e]:en=e}function ba(){if(en){var e=en,t=tn;if(tn=en=null,ms(e),t)for(e=0;e<t.length;e++)ms(t[e])}}function Ya(e,t){return e(t)}function Xa(){}var Wo=!1;function Ja(e,t,n){if(Wo)return e(t,n);Wo=!0;try{return Ya(e,t,n)}finally{Wo=!1,(en!==null||tn!==null)&&(Xa(),ba())}}function Bn(e,t){var n=e.stateNode;if(n===null)return null;var r=ko(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(x(231,t,typeof n));return n}var Pl=!1;if(Ke)try{var _n={};Object.defineProperty(_n,"passive",{get:function(){Pl=!0}}),window.addEventListener("test",_n,_n),window.removeEventListener("test",_n,_n)}catch{Pl=!1}function Td(e,t,n,r,o,l,i,s,a){var u=Array.prototype.slice.call(arguments,3);try{t.apply(n,u)}catch(h){this.onError(h)}}var Ln=!1,$r=null,Hr=!1,Cl=null,Md={onError:function(e){Ln=!0,$r=e}};function zd(e,t,n,r,o,l,i,s,a){Ln=!1,$r=null,Td.apply(Md,arguments)}function Ld(e,t,n,r,o,l,i,s,a){if(zd.apply(this,arguments),Ln){if(Ln){var u=$r;Ln=!1,$r=null}else throw Error(x(198));Hr||(Hr=!0,Cl=u)}}function Ut(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Za(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function hs(e){if(Ut(e)!==e)throw Error(x(188))}function jd(e){var t=e.alternate;if(!t){if(t=Ut(e),t===null)throw Error(x(188));return t!==e?null:e}for(var n=e,r=t;;){var o=n.return;if(o===null)break;var l=o.alternate;if(l===null){if(r=o.return,r!==null){n=r;continue}break}if(o.child===l.child){for(l=o.child;l;){if(l===n)return hs(o),e;if(l===r)return hs(o),t;l=l.sibling}throw Error(x(188))}if(n.return!==r.return)n=o,r=l;else{for(var i=!1,s=o.child;s;){if(s===n){i=!0,n=o,r=l;break}if(s===r){i=!0,r=o,n=l;break}s=s.sibling}if(!i){for(s=l.child;s;){if(s===n){i=!0,n=l,r=o;break}if(s===r){i=!0,r=l,n=o;break}s=s.sibling}if(!i)throw Error(x(189))}}if(n.alternate!==r)throw Error(x(190))}if(n.tag!==3)throw Error(x(188));return n.stateNode.current===n?e:t}function eu(e){return e=jd(e),e!==null?tu(e):null}function tu(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=tu(e);if(t!==null)return t;e=e.sibling}return null}var nu=ke.unstable_scheduleCallback,vs=ke.unstable_cancelCallback,Rd=ke.unstable_shouldYield,Od=ke.unstable_requestPaint,Q=ke.unstable_now,Id=ke.unstable_getCurrentPriorityLevel,gi=ke.unstable_ImmediatePriority,ru=ke.unstable_UserBlockingPriority,Qr=ke.unstable_NormalPriority,Fd=ke.unstable_LowPriority,ou=ke.unstable_IdlePriority,vo=null,Ae=null;function Ud(e){if(Ae&&typeof Ae.onCommitFiberRoot=="function")try{Ae.onCommitFiberRoot(vo,e,void 0,(e.current.flags&128)===128)}catch{}}var Re=Math.clz32?Math.clz32:Wd,Dd=Math.log,Ad=Math.LN2;function Wd(e){return e>>>=0,e===0?32:31-(Dd(e)/Ad|0)|0}var gr=64,yr=4194304;function Tn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Kr(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,o=e.suspendedLanes,l=e.pingedLanes,i=n&268435455;if(i!==0){var s=i&~o;s!==0?r=Tn(s):(l&=i,l!==0&&(r=Tn(l)))}else i=n&~o,i!==0?r=Tn(i):l!==0&&(r=Tn(l));if(r===0)return 0;if(t!==0&&t!==r&&!(t&o)&&(o=r&-r,l=t&-t,o>=l||o===16&&(l&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Re(t),o=1<<n,r|=e[n],t&=~o;return r}function Bd(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Vd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,o=e.expirationTimes,l=e.pendingLanes;0<l;){var i=31-Re(l),s=1<<i,a=o[i];a===-1?(!(s&n)||s&r)&&(o[i]=Bd(s,t)):a<=t&&(e.expiredLanes|=s),l&=~s}}function El(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function lu(){var e=gr;return gr<<=1,!(gr&4194240)&&(gr=64),e}function Bo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function lr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Re(t),e[t]=n}function qd(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var o=31-Re(n),l=1<<o;t[o]=0,r[o]=-1,e[o]=-1,n&=~l}}function yi(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Re(n),o=1<<r;o&t|e[r]&t&&(e[r]|=t),n&=~o}}var I=0;function iu(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var su,_i,au,uu,cu,Nl=!1,_r=[],it=null,st=null,at=null,Vn=new Map,qn=new Map,tt=[],$d="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function gs(e,t){switch(e){case"focusin":case"focusout":it=null;break;case"dragenter":case"dragleave":st=null;break;case"mouseover":case"mouseout":at=null;break;case"pointerover":case"pointerout":Vn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":qn.delete(t.pointerId)}}function kn(e,t,n,r,o,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:l,targetContainers:[o]},t!==null&&(t=sr(t),t!==null&&_i(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Hd(e,t,n,r,o){switch(t){case"focusin":return it=kn(it,e,t,n,r,o),!0;case"dragenter":return st=kn(st,e,t,n,r,o),!0;case"mouseover":return at=kn(at,e,t,n,r,o),!0;case"pointerover":var l=o.pointerId;return Vn.set(l,kn(Vn.get(l)||null,e,t,n,r,o)),!0;case"gotpointercapture":return l=o.pointerId,qn.set(l,kn(qn.get(l)||null,e,t,n,r,o)),!0}return!1}function du(e){var t=Et(e.target);if(t!==null){var n=Ut(t);if(n!==null){if(t=n.tag,t===13){if(t=Za(n),t!==null){e.blockedOn=t,cu(e.priority,function(){au(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function jr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Tl(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);xl=r,n.target.dispatchEvent(r),xl=null}else return t=sr(n),t!==null&&_i(t),e.blockedOn=n,!1;t.shift()}return!0}function ys(e,t,n){jr(e)&&n.delete(t)}function Qd(){Nl=!1,it!==null&&jr(it)&&(it=null),st!==null&&jr(st)&&(st=null),at!==null&&jr(at)&&(at=null),Vn.forEach(ys),qn.forEach(ys)}function wn(e,t){e.blockedOn===t&&(e.blockedOn=null,Nl||(Nl=!0,ke.unstable_scheduleCallback(ke.unstable_NormalPriority,Qd)))}function $n(e){function t(o){return wn(o,e)}if(0<_r.length){wn(_r[0],e);for(var n=1;n<_r.length;n++){var r=_r[n];r.blockedOn===e&&(r.blockedOn=null)}}for(it!==null&&wn(it,e),st!==null&&wn(st,e),at!==null&&wn(at,e),Vn.forEach(t),qn.forEach(t),n=0;n<tt.length;n++)r=tt[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<tt.length&&(n=tt[0],n.blockedOn===null);)du(n),n.blockedOn===null&&tt.shift()}var nn=Xe.ReactCurrentBatchConfig,Gr=!0;function Kd(e,t,n,r){var o=I,l=nn.transition;nn.transition=null;try{I=1,ki(e,t,n,r)}finally{I=o,nn.transition=l}}function Gd(e,t,n,r){var o=I,l=nn.transition;nn.transition=null;try{I=4,ki(e,t,n,r)}finally{I=o,nn.transition=l}}function ki(e,t,n,r){if(Gr){var o=Tl(e,t,n,r);if(o===null)Xo(e,t,r,br,n),gs(e,r);else if(Hd(o,e,t,n,r))r.stopPropagation();else if(gs(e,r),t&4&&-1<$d.indexOf(e)){for(;o!==null;){var l=sr(o);if(l!==null&&su(l),l=Tl(e,t,n,r),l===null&&Xo(e,t,r,br,n),l===o)break;o=l}o!==null&&r.stopPropagation()}else Xo(e,t,r,null,n)}}var br=null;function Tl(e,t,n,r){if(br=null,e=vi(r),e=Et(e),e!==null)if(t=Ut(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Za(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return br=e,null}function fu(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Id()){case gi:return 1;case ru:return 4;case Qr:case Fd:return 16;case ou:return 536870912;default:return 16}default:return 16}}var rt=null,wi=null,Rr=null;function pu(){if(Rr)return Rr;var e,t=wi,n=t.length,r,o="value"in rt?rt.value:rt.textContent,l=o.length;for(e=0;e<n&&t[e]===o[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===o[l-r];r++);return Rr=o.slice(e,1<r?1-r:void 0)}function Or(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function kr(){return!0}function _s(){return!1}function xe(e){function t(n,r,o,l,i){this._reactName=n,this._targetInst=o,this.type=r,this.nativeEvent=l,this.target=i,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(n=e[s],this[s]=n?n(l):l[s]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?kr:_s,this.isPropagationStopped=_s,this}return q(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=kr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=kr)},persist:function(){},isPersistent:kr}),t}var mn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},xi=xe(mn),ir=q({},mn,{view:0,detail:0}),bd=xe(ir),Vo,qo,xn,go=q({},ir,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Si,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==xn&&(xn&&e.type==="mousemove"?(Vo=e.screenX-xn.screenX,qo=e.screenY-xn.screenY):qo=Vo=0,xn=e),Vo)},movementY:function(e){return"movementY"in e?e.movementY:qo}}),ks=xe(go),Yd=q({},go,{dataTransfer:0}),Xd=xe(Yd),Jd=q({},ir,{relatedTarget:0}),$o=xe(Jd),Zd=q({},mn,{animationName:0,elapsedTime:0,pseudoElement:0}),ef=xe(Zd),tf=q({},mn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),nf=xe(tf),rf=q({},mn,{data:0}),ws=xe(rf),of={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},lf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},sf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function af(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=sf[e])?!!t[e]:!1}function Si(){return af}var uf=q({},ir,{key:function(e){if(e.key){var t=of[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Or(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?lf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Si,charCode:function(e){return e.type==="keypress"?Or(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Or(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),cf=xe(uf),df=q({},go,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),xs=xe(df),ff=q({},ir,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Si}),pf=xe(ff),mf=q({},mn,{propertyName:0,elapsedTime:0,pseudoElement:0}),hf=xe(mf),vf=q({},go,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),gf=xe(vf),yf=[9,13,27,32],Pi=Ke&&"CompositionEvent"in window,jn=null;Ke&&"documentMode"in document&&(jn=document.documentMode);var _f=Ke&&"TextEvent"in window&&!jn,mu=Ke&&(!Pi||jn&&8<jn&&11>=jn),Ss=" ",Ps=!1;function hu(e,t){switch(e){case"keyup":return yf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function vu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var qt=!1;function kf(e,t){switch(e){case"compositionend":return vu(t);case"keypress":return t.which!==32?null:(Ps=!0,Ss);case"textInput":return e=t.data,e===Ss&&Ps?null:e;default:return null}}function wf(e,t){if(qt)return e==="compositionend"||!Pi&&hu(e,t)?(e=pu(),Rr=wi=rt=null,qt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return mu&&t.locale!=="ko"?null:t.data;default:return null}}var xf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Cs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!xf[e.type]:t==="textarea"}function gu(e,t,n,r){Ga(r),t=Yr(t,"onChange"),0<t.length&&(n=new xi("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Rn=null,Hn=null;function Sf(e){Tu(e,0)}function yo(e){var t=Qt(e);if(Ba(t))return e}function Pf(e,t){if(e==="change")return t}var yu=!1;if(Ke){var Ho;if(Ke){var Qo="oninput"in document;if(!Qo){var Es=document.createElement("div");Es.setAttribute("oninput","return;"),Qo=typeof Es.oninput=="function"}Ho=Qo}else Ho=!1;yu=Ho&&(!document.documentMode||9<document.documentMode)}function Ns(){Rn&&(Rn.detachEvent("onpropertychange",_u),Hn=Rn=null)}function _u(e){if(e.propertyName==="value"&&yo(Hn)){var t=[];gu(t,Hn,e,vi(e)),Ja(Sf,t)}}function Cf(e,t,n){e==="focusin"?(Ns(),Rn=t,Hn=n,Rn.attachEvent("onpropertychange",_u)):e==="focusout"&&Ns()}function Ef(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return yo(Hn)}function Nf(e,t){if(e==="click")return yo(t)}function Tf(e,t){if(e==="input"||e==="change")return yo(t)}function Mf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ie=typeof Object.is=="function"?Object.is:Mf;function Qn(e,t){if(Ie(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var o=n[r];if(!cl.call(t,o)||!Ie(e[o],t[o]))return!1}return!0}function Ts(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ms(e,t){var n=Ts(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ts(n)}}function ku(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?ku(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function wu(){for(var e=window,t=qr();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=qr(e.document)}return t}function Ci(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function zf(e){var t=wu(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&ku(n.ownerDocument.documentElement,n)){if(r!==null&&Ci(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=n.textContent.length,l=Math.min(r.start,o);r=r.end===void 0?l:Math.min(r.end,o),!e.extend&&l>r&&(o=r,r=l,l=o),o=Ms(n,l);var i=Ms(n,r);o&&i&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),l>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Lf=Ke&&"documentMode"in document&&11>=document.documentMode,$t=null,Ml=null,On=null,zl=!1;function zs(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;zl||$t==null||$t!==qr(r)||(r=$t,"selectionStart"in r&&Ci(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),On&&Qn(On,r)||(On=r,r=Yr(Ml,"onSelect"),0<r.length&&(t=new xi("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=$t)))}function wr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ht={animationend:wr("Animation","AnimationEnd"),animationiteration:wr("Animation","AnimationIteration"),animationstart:wr("Animation","AnimationStart"),transitionend:wr("Transition","TransitionEnd")},Ko={},xu={};Ke&&(xu=document.createElement("div").style,"AnimationEvent"in window||(delete Ht.animationend.animation,delete Ht.animationiteration.animation,delete Ht.animationstart.animation),"TransitionEvent"in window||delete Ht.transitionend.transition);function _o(e){if(Ko[e])return Ko[e];if(!Ht[e])return e;var t=Ht[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in xu)return Ko[e]=t[n];return e}var Su=_o("animationend"),Pu=_o("animationiteration"),Cu=_o("animationstart"),Eu=_o("transitionend"),Nu=new Map,Ls="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function yt(e,t){Nu.set(e,t),Ft(t,[e])}for(var Go=0;Go<Ls.length;Go++){var bo=Ls[Go],jf=bo.toLowerCase(),Rf=bo[0].toUpperCase()+bo.slice(1);yt(jf,"on"+Rf)}yt(Su,"onAnimationEnd");yt(Pu,"onAnimationIteration");yt(Cu,"onAnimationStart");yt("dblclick","onDoubleClick");yt("focusin","onFocus");yt("focusout","onBlur");yt(Eu,"onTransitionEnd");ln("onMouseEnter",["mouseout","mouseover"]);ln("onMouseLeave",["mouseout","mouseover"]);ln("onPointerEnter",["pointerout","pointerover"]);ln("onPointerLeave",["pointerout","pointerover"]);Ft("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ft("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ft("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ft("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ft("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ft("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Mn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Of=new Set("cancel close invalid load scroll toggle".split(" ").concat(Mn));function js(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Ld(r,t,void 0,e),e.currentTarget=null}function Tu(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],o=r.event;r=r.listeners;e:{var l=void 0;if(t)for(var i=r.length-1;0<=i;i--){var s=r[i],a=s.instance,u=s.currentTarget;if(s=s.listener,a!==l&&o.isPropagationStopped())break e;js(o,s,u),l=a}else for(i=0;i<r.length;i++){if(s=r[i],a=s.instance,u=s.currentTarget,s=s.listener,a!==l&&o.isPropagationStopped())break e;js(o,s,u),l=a}}}if(Hr)throw e=Cl,Hr=!1,Cl=null,e}function U(e,t){var n=t[Il];n===void 0&&(n=t[Il]=new Set);var r=e+"__bubble";n.has(r)||(Mu(t,e,2,!1),n.add(r))}function Yo(e,t,n){var r=0;t&&(r|=4),Mu(n,e,r,t)}var xr="_reactListening"+Math.random().toString(36).slice(2);function Kn(e){if(!e[xr]){e[xr]=!0,Fa.forEach(function(n){n!=="selectionchange"&&(Of.has(n)||Yo(n,!1,e),Yo(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[xr]||(t[xr]=!0,Yo("selectionchange",!1,t))}}function Mu(e,t,n,r){switch(fu(t)){case 1:var o=Kd;break;case 4:o=Gd;break;default:o=ki}n=o.bind(null,t,n,e),o=void 0,!Pl||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),r?o!==void 0?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):o!==void 0?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function Xo(e,t,n,r,o){var l=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var s=r.stateNode.containerInfo;if(s===o||s.nodeType===8&&s.parentNode===o)break;if(i===4)for(i=r.return;i!==null;){var a=i.tag;if((a===3||a===4)&&(a=i.stateNode.containerInfo,a===o||a.nodeType===8&&a.parentNode===o))return;i=i.return}for(;s!==null;){if(i=Et(s),i===null)return;if(a=i.tag,a===5||a===6){r=l=i;continue e}s=s.parentNode}}r=r.return}Ja(function(){var u=l,h=vi(n),p=[];e:{var v=Nu.get(e);if(v!==void 0){var y=xi,_=e;switch(e){case"keypress":if(Or(n)===0)break e;case"keydown":case"keyup":y=cf;break;case"focusin":_="focus",y=$o;break;case"focusout":_="blur",y=$o;break;case"beforeblur":case"afterblur":y=$o;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=ks;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=Xd;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=pf;break;case Su:case Pu:case Cu:y=ef;break;case Eu:y=hf;break;case"scroll":y=bd;break;case"wheel":y=gf;break;case"copy":case"cut":case"paste":y=nf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=xs}var k=(t&4)!==0,P=!k&&e==="scroll",f=k?v!==null?v+"Capture":null:v;k=[];for(var c=u,d;c!==null;){d=c;var g=d.stateNode;if(d.tag===5&&g!==null&&(d=g,f!==null&&(g=Bn(c,f),g!=null&&k.push(Gn(c,g,d)))),P)break;c=c.return}0<k.length&&(v=new y(v,_,null,n,h),p.push({event:v,listeners:k}))}}if(!(t&7)){e:{if(v=e==="mouseover"||e==="pointerover",y=e==="mouseout"||e==="pointerout",v&&n!==xl&&(_=n.relatedTarget||n.fromElement)&&(Et(_)||_[Ge]))break e;if((y||v)&&(v=h.window===h?h:(v=h.ownerDocument)?v.defaultView||v.parentWindow:window,y?(_=n.relatedTarget||n.toElement,y=u,_=_?Et(_):null,_!==null&&(P=Ut(_),_!==P||_.tag!==5&&_.tag!==6)&&(_=null)):(y=null,_=u),y!==_)){if(k=ks,g="onMouseLeave",f="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(k=xs,g="onPointerLeave",f="onPointerEnter",c="pointer"),P=y==null?v:Qt(y),d=_==null?v:Qt(_),v=new k(g,c+"leave",y,n,h),v.target=P,v.relatedTarget=d,g=null,Et(h)===u&&(k=new k(f,c+"enter",_,n,h),k.target=d,k.relatedTarget=P,g=k),P=g,y&&_)t:{for(k=y,f=_,c=0,d=k;d;d=Wt(d))c++;for(d=0,g=f;g;g=Wt(g))d++;for(;0<c-d;)k=Wt(k),c--;for(;0<d-c;)f=Wt(f),d--;for(;c--;){if(k===f||f!==null&&k===f.alternate)break t;k=Wt(k),f=Wt(f)}k=null}else k=null;y!==null&&Rs(p,v,y,k,!1),_!==null&&P!==null&&Rs(p,P,_,k,!0)}}e:{if(v=u?Qt(u):window,y=v.nodeName&&v.nodeName.toLowerCase(),y==="select"||y==="input"&&v.type==="file")var S=Pf;else if(Cs(v))if(yu)S=Tf;else{S=Ef;var C=Cf}else(y=v.nodeName)&&y.toLowerCase()==="input"&&(v.type==="checkbox"||v.type==="radio")&&(S=Nf);if(S&&(S=S(e,u))){gu(p,S,n,h);break e}C&&C(e,v,u),e==="focusout"&&(C=v._wrapperState)&&C.controlled&&v.type==="number"&&gl(v,"number",v.value)}switch(C=u?Qt(u):window,e){case"focusin":(Cs(C)||C.contentEditable==="true")&&($t=C,Ml=u,On=null);break;case"focusout":On=Ml=$t=null;break;case"mousedown":zl=!0;break;case"contextmenu":case"mouseup":case"dragend":zl=!1,zs(p,n,h);break;case"selectionchange":if(Lf)break;case"keydown":case"keyup":zs(p,n,h)}var E;if(Pi)e:{switch(e){case"compositionstart":var M="onCompositionStart";break e;case"compositionend":M="onCompositionEnd";break e;case"compositionupdate":M="onCompositionUpdate";break e}M=void 0}else qt?hu(e,n)&&(M="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(M="onCompositionStart");M&&(mu&&n.locale!=="ko"&&(qt||M!=="onCompositionStart"?M==="onCompositionEnd"&&qt&&(E=pu()):(rt=h,wi="value"in rt?rt.value:rt.textContent,qt=!0)),C=Yr(u,M),0<C.length&&(M=new ws(M,e,null,n,h),p.push({event:M,listeners:C}),E?M.data=E:(E=vu(n),E!==null&&(M.data=E)))),(E=_f?kf(e,n):wf(e,n))&&(u=Yr(u,"onBeforeInput"),0<u.length&&(h=new ws("onBeforeInput","beforeinput",null,n,h),p.push({event:h,listeners:u}),h.data=E))}Tu(p,t)})}function Gn(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Yr(e,t){for(var n=t+"Capture",r=[];e!==null;){var o=e,l=o.stateNode;o.tag===5&&l!==null&&(o=l,l=Bn(e,n),l!=null&&r.unshift(Gn(e,l,o)),l=Bn(e,t),l!=null&&r.push(Gn(e,l,o))),e=e.return}return r}function Wt(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Rs(e,t,n,r,o){for(var l=t._reactName,i=[];n!==null&&n!==r;){var s=n,a=s.alternate,u=s.stateNode;if(a!==null&&a===r)break;s.tag===5&&u!==null&&(s=u,o?(a=Bn(n,l),a!=null&&i.unshift(Gn(n,a,s))):o||(a=Bn(n,l),a!=null&&i.push(Gn(n,a,s)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var If=/\r\n?/g,Ff=/\u0000|\uFFFD/g;function Os(e){return(typeof e=="string"?e:""+e).replace(If,`
`).replace(Ff,"")}function Sr(e,t,n){if(t=Os(t),Os(e)!==t&&n)throw Error(x(425))}function Xr(){}var Ll=null,jl=null;function Rl(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ol=typeof setTimeout=="function"?setTimeout:void 0,Uf=typeof clearTimeout=="function"?clearTimeout:void 0,Is=typeof Promise=="function"?Promise:void 0,Df=typeof queueMicrotask=="function"?queueMicrotask:typeof Is<"u"?function(e){return Is.resolve(null).then(e).catch(Af)}:Ol;function Af(e){setTimeout(function(){throw e})}function Jo(e,t){var n=t,r=0;do{var o=n.nextSibling;if(e.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(r===0){e.removeChild(o),$n(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=o}while(n);$n(t)}function ut(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Fs(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var hn=Math.random().toString(36).slice(2),De="__reactFiber$"+hn,bn="__reactProps$"+hn,Ge="__reactContainer$"+hn,Il="__reactEvents$"+hn,Wf="__reactListeners$"+hn,Bf="__reactHandles$"+hn;function Et(e){var t=e[De];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Ge]||n[De]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Fs(e);e!==null;){if(n=e[De])return n;e=Fs(e)}return t}e=n,n=e.parentNode}return null}function sr(e){return e=e[De]||e[Ge],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Qt(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(x(33))}function ko(e){return e[bn]||null}var Fl=[],Kt=-1;function _t(e){return{current:e}}function D(e){0>Kt||(e.current=Fl[Kt],Fl[Kt]=null,Kt--)}function F(e,t){Kt++,Fl[Kt]=e.current,e.current=t}var gt={},ie=_t(gt),pe=_t(!1),Lt=gt;function sn(e,t){var n=e.type.contextTypes;if(!n)return gt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o={},l;for(l in n)o[l]=t[l];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function me(e){return e=e.childContextTypes,e!=null}function Jr(){D(pe),D(ie)}function Us(e,t,n){if(ie.current!==gt)throw Error(x(168));F(ie,t),F(pe,n)}function zu(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var o in r)if(!(o in t))throw Error(x(108,Pd(e)||"Unknown",o));return q({},n,r)}function Zr(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||gt,Lt=ie.current,F(ie,e),F(pe,pe.current),!0}function Ds(e,t,n){var r=e.stateNode;if(!r)throw Error(x(169));n?(e=zu(e,t,Lt),r.__reactInternalMemoizedMergedChildContext=e,D(pe),D(ie),F(ie,e)):D(pe),F(pe,n)}var qe=null,wo=!1,Zo=!1;function Lu(e){qe===null?qe=[e]:qe.push(e)}function Vf(e){wo=!0,Lu(e)}function kt(){if(!Zo&&qe!==null){Zo=!0;var e=0,t=I;try{var n=qe;for(I=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}qe=null,wo=!1}catch(o){throw qe!==null&&(qe=qe.slice(e+1)),nu(gi,kt),o}finally{I=t,Zo=!1}}return null}var Gt=[],bt=0,eo=null,to=0,Se=[],Pe=0,jt=null,$e=1,He="";function Pt(e,t){Gt[bt++]=to,Gt[bt++]=eo,eo=e,to=t}function ju(e,t,n){Se[Pe++]=$e,Se[Pe++]=He,Se[Pe++]=jt,jt=e;var r=$e;e=He;var o=32-Re(r)-1;r&=~(1<<o),n+=1;var l=32-Re(t)+o;if(30<l){var i=o-o%5;l=(r&(1<<i)-1).toString(32),r>>=i,o-=i,$e=1<<32-Re(t)+o|n<<o|r,He=l+e}else $e=1<<l|n<<o|r,He=e}function Ei(e){e.return!==null&&(Pt(e,1),ju(e,1,0))}function Ni(e){for(;e===eo;)eo=Gt[--bt],Gt[bt]=null,to=Gt[--bt],Gt[bt]=null;for(;e===jt;)jt=Se[--Pe],Se[Pe]=null,He=Se[--Pe],Se[Pe]=null,$e=Se[--Pe],Se[Pe]=null}var _e=null,ye=null,A=!1,je=null;function Ru(e,t){var n=Ce(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function As(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,_e=e,ye=ut(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,_e=e,ye=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=jt!==null?{id:$e,overflow:He}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Ce(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,_e=e,ye=null,!0):!1;default:return!1}}function Ul(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Dl(e){if(A){var t=ye;if(t){var n=t;if(!As(e,t)){if(Ul(e))throw Error(x(418));t=ut(n.nextSibling);var r=_e;t&&As(e,t)?Ru(r,n):(e.flags=e.flags&-4097|2,A=!1,_e=e)}}else{if(Ul(e))throw Error(x(418));e.flags=e.flags&-4097|2,A=!1,_e=e}}}function Ws(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;_e=e}function Pr(e){if(e!==_e)return!1;if(!A)return Ws(e),A=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Rl(e.type,e.memoizedProps)),t&&(t=ye)){if(Ul(e))throw Ou(),Error(x(418));for(;t;)Ru(e,t),t=ut(t.nextSibling)}if(Ws(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(x(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ye=ut(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ye=null}}else ye=_e?ut(e.stateNode.nextSibling):null;return!0}function Ou(){for(var e=ye;e;)e=ut(e.nextSibling)}function an(){ye=_e=null,A=!1}function Ti(e){je===null?je=[e]:je.push(e)}var qf=Xe.ReactCurrentBatchConfig;function Sn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(x(309));var r=n.stateNode}if(!r)throw Error(x(147,e));var o=r,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(i){var s=o.refs;i===null?delete s[l]:s[l]=i},t._stringRef=l,t)}if(typeof e!="string")throw Error(x(284));if(!n._owner)throw Error(x(290,e))}return e}function Cr(e,t){throw e=Object.prototype.toString.call(t),Error(x(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Bs(e){var t=e._init;return t(e._payload)}function Iu(e){function t(f,c){if(e){var d=f.deletions;d===null?(f.deletions=[c],f.flags|=16):d.push(c)}}function n(f,c){if(!e)return null;for(;c!==null;)t(f,c),c=c.sibling;return null}function r(f,c){for(f=new Map;c!==null;)c.key!==null?f.set(c.key,c):f.set(c.index,c),c=c.sibling;return f}function o(f,c){return f=pt(f,c),f.index=0,f.sibling=null,f}function l(f,c,d){return f.index=d,e?(d=f.alternate,d!==null?(d=d.index,d<c?(f.flags|=2,c):d):(f.flags|=2,c)):(f.flags|=1048576,c)}function i(f){return e&&f.alternate===null&&(f.flags|=2),f}function s(f,c,d,g){return c===null||c.tag!==6?(c=il(d,f.mode,g),c.return=f,c):(c=o(c,d),c.return=f,c)}function a(f,c,d,g){var S=d.type;return S===Vt?h(f,c,d.props.children,g,d.key):c!==null&&(c.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===Ze&&Bs(S)===c.type)?(g=o(c,d.props),g.ref=Sn(f,c,d),g.return=f,g):(g=Br(d.type,d.key,d.props,null,f.mode,g),g.ref=Sn(f,c,d),g.return=f,g)}function u(f,c,d,g){return c===null||c.tag!==4||c.stateNode.containerInfo!==d.containerInfo||c.stateNode.implementation!==d.implementation?(c=sl(d,f.mode,g),c.return=f,c):(c=o(c,d.children||[]),c.return=f,c)}function h(f,c,d,g,S){return c===null||c.tag!==7?(c=zt(d,f.mode,g,S),c.return=f,c):(c=o(c,d),c.return=f,c)}function p(f,c,d){if(typeof c=="string"&&c!==""||typeof c=="number")return c=il(""+c,f.mode,d),c.return=f,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case mr:return d=Br(c.type,c.key,c.props,null,f.mode,d),d.ref=Sn(f,null,c),d.return=f,d;case Bt:return c=sl(c,f.mode,d),c.return=f,c;case Ze:var g=c._init;return p(f,g(c._payload),d)}if(Nn(c)||yn(c))return c=zt(c,f.mode,d,null),c.return=f,c;Cr(f,c)}return null}function v(f,c,d,g){var S=c!==null?c.key:null;if(typeof d=="string"&&d!==""||typeof d=="number")return S!==null?null:s(f,c,""+d,g);if(typeof d=="object"&&d!==null){switch(d.$$typeof){case mr:return d.key===S?a(f,c,d,g):null;case Bt:return d.key===S?u(f,c,d,g):null;case Ze:return S=d._init,v(f,c,S(d._payload),g)}if(Nn(d)||yn(d))return S!==null?null:h(f,c,d,g,null);Cr(f,d)}return null}function y(f,c,d,g,S){if(typeof g=="string"&&g!==""||typeof g=="number")return f=f.get(d)||null,s(c,f,""+g,S);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case mr:return f=f.get(g.key===null?d:g.key)||null,a(c,f,g,S);case Bt:return f=f.get(g.key===null?d:g.key)||null,u(c,f,g,S);case Ze:var C=g._init;return y(f,c,d,C(g._payload),S)}if(Nn(g)||yn(g))return f=f.get(d)||null,h(c,f,g,S,null);Cr(c,g)}return null}function _(f,c,d,g){for(var S=null,C=null,E=c,M=c=0,W=null;E!==null&&M<d.length;M++){E.index>M?(W=E,E=null):W=E.sibling;var L=v(f,E,d[M],g);if(L===null){E===null&&(E=W);break}e&&E&&L.alternate===null&&t(f,E),c=l(L,c,M),C===null?S=L:C.sibling=L,C=L,E=W}if(M===d.length)return n(f,E),A&&Pt(f,M),S;if(E===null){for(;M<d.length;M++)E=p(f,d[M],g),E!==null&&(c=l(E,c,M),C===null?S=E:C.sibling=E,C=E);return A&&Pt(f,M),S}for(E=r(f,E);M<d.length;M++)W=y(E,f,M,d[M],g),W!==null&&(e&&W.alternate!==null&&E.delete(W.key===null?M:W.key),c=l(W,c,M),C===null?S=W:C.sibling=W,C=W);return e&&E.forEach(function(ve){return t(f,ve)}),A&&Pt(f,M),S}function k(f,c,d,g){var S=yn(d);if(typeof S!="function")throw Error(x(150));if(d=S.call(d),d==null)throw Error(x(151));for(var C=S=null,E=c,M=c=0,W=null,L=d.next();E!==null&&!L.done;M++,L=d.next()){E.index>M?(W=E,E=null):W=E.sibling;var ve=v(f,E,L.value,g);if(ve===null){E===null&&(E=W);break}e&&E&&ve.alternate===null&&t(f,E),c=l(ve,c,M),C===null?S=ve:C.sibling=ve,C=ve,E=W}if(L.done)return n(f,E),A&&Pt(f,M),S;if(E===null){for(;!L.done;M++,L=d.next())L=p(f,L.value,g),L!==null&&(c=l(L,c,M),C===null?S=L:C.sibling=L,C=L);return A&&Pt(f,M),S}for(E=r(f,E);!L.done;M++,L=d.next())L=y(E,f,M,L.value,g),L!==null&&(e&&L.alternate!==null&&E.delete(L.key===null?M:L.key),c=l(L,c,M),C===null?S=L:C.sibling=L,C=L);return e&&E.forEach(function(vn){return t(f,vn)}),A&&Pt(f,M),S}function P(f,c,d,g){if(typeof d=="object"&&d!==null&&d.type===Vt&&d.key===null&&(d=d.props.children),typeof d=="object"&&d!==null){switch(d.$$typeof){case mr:e:{for(var S=d.key,C=c;C!==null;){if(C.key===S){if(S=d.type,S===Vt){if(C.tag===7){n(f,C.sibling),c=o(C,d.props.children),c.return=f,f=c;break e}}else if(C.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===Ze&&Bs(S)===C.type){n(f,C.sibling),c=o(C,d.props),c.ref=Sn(f,C,d),c.return=f,f=c;break e}n(f,C);break}else t(f,C);C=C.sibling}d.type===Vt?(c=zt(d.props.children,f.mode,g,d.key),c.return=f,f=c):(g=Br(d.type,d.key,d.props,null,f.mode,g),g.ref=Sn(f,c,d),g.return=f,f=g)}return i(f);case Bt:e:{for(C=d.key;c!==null;){if(c.key===C)if(c.tag===4&&c.stateNode.containerInfo===d.containerInfo&&c.stateNode.implementation===d.implementation){n(f,c.sibling),c=o(c,d.children||[]),c.return=f,f=c;break e}else{n(f,c);break}else t(f,c);c=c.sibling}c=sl(d,f.mode,g),c.return=f,f=c}return i(f);case Ze:return C=d._init,P(f,c,C(d._payload),g)}if(Nn(d))return _(f,c,d,g);if(yn(d))return k(f,c,d,g);Cr(f,d)}return typeof d=="string"&&d!==""||typeof d=="number"?(d=""+d,c!==null&&c.tag===6?(n(f,c.sibling),c=o(c,d),c.return=f,f=c):(n(f,c),c=il(d,f.mode,g),c.return=f,f=c),i(f)):n(f,c)}return P}var un=Iu(!0),Fu=Iu(!1),no=_t(null),ro=null,Yt=null,Mi=null;function zi(){Mi=Yt=ro=null}function Li(e){var t=no.current;D(no),e._currentValue=t}function Al(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function rn(e,t){ro=e,Mi=Yt=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(fe=!0),e.firstContext=null)}function Ne(e){var t=e._currentValue;if(Mi!==e)if(e={context:e,memoizedValue:t,next:null},Yt===null){if(ro===null)throw Error(x(308));Yt=e,ro.dependencies={lanes:0,firstContext:e}}else Yt=Yt.next=e;return t}var Nt=null;function ji(e){Nt===null?Nt=[e]:Nt.push(e)}function Uu(e,t,n,r){var o=t.interleaved;return o===null?(n.next=n,ji(t)):(n.next=o.next,o.next=n),t.interleaved=n,be(e,r)}function be(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var et=!1;function Ri(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Du(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Qe(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function ct(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,O&2){var o=r.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),r.pending=t,be(e,n)}return o=r.interleaved,o===null?(t.next=t,ji(r)):(t.next=o.next,o.next=t),r.interleaved=t,be(e,n)}function Ir(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,yi(e,n)}}function Vs(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var o=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?o=l=i:l=l.next=i,n=n.next}while(n!==null);l===null?o=l=t:l=l.next=t}else o=l=t;n={baseState:r.baseState,firstBaseUpdate:o,lastBaseUpdate:l,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function oo(e,t,n,r){var o=e.updateQueue;et=!1;var l=o.firstBaseUpdate,i=o.lastBaseUpdate,s=o.shared.pending;if(s!==null){o.shared.pending=null;var a=s,u=a.next;a.next=null,i===null?l=u:i.next=u,i=a;var h=e.alternate;h!==null&&(h=h.updateQueue,s=h.lastBaseUpdate,s!==i&&(s===null?h.firstBaseUpdate=u:s.next=u,h.lastBaseUpdate=a))}if(l!==null){var p=o.baseState;i=0,h=u=a=null,s=l;do{var v=s.lane,y=s.eventTime;if((r&v)===v){h!==null&&(h=h.next={eventTime:y,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var _=e,k=s;switch(v=t,y=n,k.tag){case 1:if(_=k.payload,typeof _=="function"){p=_.call(y,p,v);break e}p=_;break e;case 3:_.flags=_.flags&-65537|128;case 0:if(_=k.payload,v=typeof _=="function"?_.call(y,p,v):_,v==null)break e;p=q({},p,v);break e;case 2:et=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,v=o.effects,v===null?o.effects=[s]:v.push(s))}else y={eventTime:y,lane:v,tag:s.tag,payload:s.payload,callback:s.callback,next:null},h===null?(u=h=y,a=p):h=h.next=y,i|=v;if(s=s.next,s===null){if(s=o.shared.pending,s===null)break;v=s,s=v.next,v.next=null,o.lastBaseUpdate=v,o.shared.pending=null}}while(!0);if(h===null&&(a=p),o.baseState=a,o.firstBaseUpdate=u,o.lastBaseUpdate=h,t=o.shared.interleaved,t!==null){o=t;do i|=o.lane,o=o.next;while(o!==t)}else l===null&&(o.shared.lanes=0);Ot|=i,e.lanes=i,e.memoizedState=p}}function qs(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],o=r.callback;if(o!==null){if(r.callback=null,r=n,typeof o!="function")throw Error(x(191,o));o.call(r)}}}var ar={},We=_t(ar),Yn=_t(ar),Xn=_t(ar);function Tt(e){if(e===ar)throw Error(x(174));return e}function Oi(e,t){switch(F(Xn,t),F(Yn,e),F(We,ar),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:_l(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=_l(t,e)}D(We),F(We,t)}function cn(){D(We),D(Yn),D(Xn)}function Au(e){Tt(Xn.current);var t=Tt(We.current),n=_l(t,e.type);t!==n&&(F(Yn,e),F(We,n))}function Ii(e){Yn.current===e&&(D(We),D(Yn))}var B=_t(0);function lo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var el=[];function Fi(){for(var e=0;e<el.length;e++)el[e]._workInProgressVersionPrimary=null;el.length=0}var Fr=Xe.ReactCurrentDispatcher,tl=Xe.ReactCurrentBatchConfig,Rt=0,V=null,b=null,J=null,io=!1,In=!1,Jn=0,$f=0;function re(){throw Error(x(321))}function Ui(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ie(e[n],t[n]))return!1;return!0}function Di(e,t,n,r,o,l){if(Rt=l,V=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Fr.current=e===null||e.memoizedState===null?Gf:bf,e=n(r,o),In){l=0;do{if(In=!1,Jn=0,25<=l)throw Error(x(301));l+=1,J=b=null,t.updateQueue=null,Fr.current=Yf,e=n(r,o)}while(In)}if(Fr.current=so,t=b!==null&&b.next!==null,Rt=0,J=b=V=null,io=!1,t)throw Error(x(300));return e}function Ai(){var e=Jn!==0;return Jn=0,e}function Ue(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return J===null?V.memoizedState=J=e:J=J.next=e,J}function Te(){if(b===null){var e=V.alternate;e=e!==null?e.memoizedState:null}else e=b.next;var t=J===null?V.memoizedState:J.next;if(t!==null)J=t,b=e;else{if(e===null)throw Error(x(310));b=e,e={memoizedState:b.memoizedState,baseState:b.baseState,baseQueue:b.baseQueue,queue:b.queue,next:null},J===null?V.memoizedState=J=e:J=J.next=e}return J}function Zn(e,t){return typeof t=="function"?t(e):t}function nl(e){var t=Te(),n=t.queue;if(n===null)throw Error(x(311));n.lastRenderedReducer=e;var r=b,o=r.baseQueue,l=n.pending;if(l!==null){if(o!==null){var i=o.next;o.next=l.next,l.next=i}r.baseQueue=o=l,n.pending=null}if(o!==null){l=o.next,r=r.baseState;var s=i=null,a=null,u=l;do{var h=u.lane;if((Rt&h)===h)a!==null&&(a=a.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),r=u.hasEagerState?u.eagerState:e(r,u.action);else{var p={lane:h,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};a===null?(s=a=p,i=r):a=a.next=p,V.lanes|=h,Ot|=h}u=u.next}while(u!==null&&u!==l);a===null?i=r:a.next=s,Ie(r,t.memoizedState)||(fe=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=a,n.lastRenderedState=r}if(e=n.interleaved,e!==null){o=e;do l=o.lane,V.lanes|=l,Ot|=l,o=o.next;while(o!==e)}else o===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function rl(e){var t=Te(),n=t.queue;if(n===null)throw Error(x(311));n.lastRenderedReducer=e;var r=n.dispatch,o=n.pending,l=t.memoizedState;if(o!==null){n.pending=null;var i=o=o.next;do l=e(l,i.action),i=i.next;while(i!==o);Ie(l,t.memoizedState)||(fe=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,r]}function Wu(){}function Bu(e,t){var n=V,r=Te(),o=t(),l=!Ie(r.memoizedState,o);if(l&&(r.memoizedState=o,fe=!0),r=r.queue,Wi($u.bind(null,n,r,e),[e]),r.getSnapshot!==t||l||J!==null&&J.memoizedState.tag&1){if(n.flags|=2048,er(9,qu.bind(null,n,r,o,t),void 0,null),Z===null)throw Error(x(349));Rt&30||Vu(n,t,o)}return o}function Vu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=V.updateQueue,t===null?(t={lastEffect:null,stores:null},V.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function qu(e,t,n,r){t.value=n,t.getSnapshot=r,Hu(t)&&Qu(e)}function $u(e,t,n){return n(function(){Hu(t)&&Qu(e)})}function Hu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ie(e,n)}catch{return!0}}function Qu(e){var t=be(e,1);t!==null&&Oe(t,e,1,-1)}function $s(e){var t=Ue();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Zn,lastRenderedState:e},t.queue=e,e=e.dispatch=Kf.bind(null,V,e),[t.memoizedState,e]}function er(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=V.updateQueue,t===null?(t={lastEffect:null,stores:null},V.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Ku(){return Te().memoizedState}function Ur(e,t,n,r){var o=Ue();V.flags|=e,o.memoizedState=er(1|t,n,void 0,r===void 0?null:r)}function xo(e,t,n,r){var o=Te();r=r===void 0?null:r;var l=void 0;if(b!==null){var i=b.memoizedState;if(l=i.destroy,r!==null&&Ui(r,i.deps)){o.memoizedState=er(t,n,l,r);return}}V.flags|=e,o.memoizedState=er(1|t,n,l,r)}function Hs(e,t){return Ur(8390656,8,e,t)}function Wi(e,t){return xo(2048,8,e,t)}function Gu(e,t){return xo(4,2,e,t)}function bu(e,t){return xo(4,4,e,t)}function Yu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Xu(e,t,n){return n=n!=null?n.concat([e]):null,xo(4,4,Yu.bind(null,t,e),n)}function Bi(){}function Ju(e,t){var n=Te();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ui(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Zu(e,t){var n=Te();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ui(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function ec(e,t,n){return Rt&21?(Ie(n,t)||(n=lu(),V.lanes|=n,Ot|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,fe=!0),e.memoizedState=n)}function Hf(e,t){var n=I;I=n!==0&&4>n?n:4,e(!0);var r=tl.transition;tl.transition={};try{e(!1),t()}finally{I=n,tl.transition=r}}function tc(){return Te().memoizedState}function Qf(e,t,n){var r=ft(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},nc(e))rc(t,n);else if(n=Uu(e,t,n,r),n!==null){var o=ae();Oe(n,e,r,o),oc(n,t,r)}}function Kf(e,t,n){var r=ft(e),o={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(nc(e))rc(t,o);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var i=t.lastRenderedState,s=l(i,n);if(o.hasEagerState=!0,o.eagerState=s,Ie(s,i)){var a=t.interleaved;a===null?(o.next=o,ji(t)):(o.next=a.next,a.next=o),t.interleaved=o;return}}catch{}finally{}n=Uu(e,t,o,r),n!==null&&(o=ae(),Oe(n,e,r,o),oc(n,t,r))}}function nc(e){var t=e.alternate;return e===V||t!==null&&t===V}function rc(e,t){In=io=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function oc(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,yi(e,n)}}var so={readContext:Ne,useCallback:re,useContext:re,useEffect:re,useImperativeHandle:re,useInsertionEffect:re,useLayoutEffect:re,useMemo:re,useReducer:re,useRef:re,useState:re,useDebugValue:re,useDeferredValue:re,useTransition:re,useMutableSource:re,useSyncExternalStore:re,useId:re,unstable_isNewReconciler:!1},Gf={readContext:Ne,useCallback:function(e,t){return Ue().memoizedState=[e,t===void 0?null:t],e},useContext:Ne,useEffect:Hs,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Ur(4194308,4,Yu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Ur(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ur(4,2,e,t)},useMemo:function(e,t){var n=Ue();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ue();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Qf.bind(null,V,e),[r.memoizedState,e]},useRef:function(e){var t=Ue();return e={current:e},t.memoizedState=e},useState:$s,useDebugValue:Bi,useDeferredValue:function(e){return Ue().memoizedState=e},useTransition:function(){var e=$s(!1),t=e[0];return e=Hf.bind(null,e[1]),Ue().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=V,o=Ue();if(A){if(n===void 0)throw Error(x(407));n=n()}else{if(n=t(),Z===null)throw Error(x(349));Rt&30||Vu(r,t,n)}o.memoizedState=n;var l={value:n,getSnapshot:t};return o.queue=l,Hs($u.bind(null,r,l,e),[e]),r.flags|=2048,er(9,qu.bind(null,r,l,n,t),void 0,null),n},useId:function(){var e=Ue(),t=Z.identifierPrefix;if(A){var n=He,r=$e;n=(r&~(1<<32-Re(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Jn++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=$f++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},bf={readContext:Ne,useCallback:Ju,useContext:Ne,useEffect:Wi,useImperativeHandle:Xu,useInsertionEffect:Gu,useLayoutEffect:bu,useMemo:Zu,useReducer:nl,useRef:Ku,useState:function(){return nl(Zn)},useDebugValue:Bi,useDeferredValue:function(e){var t=Te();return ec(t,b.memoizedState,e)},useTransition:function(){var e=nl(Zn)[0],t=Te().memoizedState;return[e,t]},useMutableSource:Wu,useSyncExternalStore:Bu,useId:tc,unstable_isNewReconciler:!1},Yf={readContext:Ne,useCallback:Ju,useContext:Ne,useEffect:Wi,useImperativeHandle:Xu,useInsertionEffect:Gu,useLayoutEffect:bu,useMemo:Zu,useReducer:rl,useRef:Ku,useState:function(){return rl(Zn)},useDebugValue:Bi,useDeferredValue:function(e){var t=Te();return b===null?t.memoizedState=e:ec(t,b.memoizedState,e)},useTransition:function(){var e=rl(Zn)[0],t=Te().memoizedState;return[e,t]},useMutableSource:Wu,useSyncExternalStore:Bu,useId:tc,unstable_isNewReconciler:!1};function ze(e,t){if(e&&e.defaultProps){t=q({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Wl(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:q({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var So={isMounted:function(e){return(e=e._reactInternals)?Ut(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=ae(),o=ft(e),l=Qe(r,o);l.payload=t,n!=null&&(l.callback=n),t=ct(e,l,o),t!==null&&(Oe(t,e,o,r),Ir(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=ae(),o=ft(e),l=Qe(r,o);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=ct(e,l,o),t!==null&&(Oe(t,e,o,r),Ir(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ae(),r=ft(e),o=Qe(n,r);o.tag=2,t!=null&&(o.callback=t),t=ct(e,o,r),t!==null&&(Oe(t,e,r,n),Ir(t,e,r))}};function Qs(e,t,n,r,o,l,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,l,i):t.prototype&&t.prototype.isPureReactComponent?!Qn(n,r)||!Qn(o,l):!0}function lc(e,t,n){var r=!1,o=gt,l=t.contextType;return typeof l=="object"&&l!==null?l=Ne(l):(o=me(t)?Lt:ie.current,r=t.contextTypes,l=(r=r!=null)?sn(e,o):gt),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=So,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=l),t}function Ks(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&So.enqueueReplaceState(t,t.state,null)}function Bl(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs={},Ri(e);var l=t.contextType;typeof l=="object"&&l!==null?o.context=Ne(l):(l=me(t)?Lt:ie.current,o.context=sn(e,l)),o.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(Wl(e,t,l,n),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&So.enqueueReplaceState(o,o.state,null),oo(e,n,o,r),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function dn(e,t){try{var n="",r=t;do n+=Sd(r),r=r.return;while(r);var o=n}catch(l){o=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:o,digest:null}}function ol(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Vl(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Xf=typeof WeakMap=="function"?WeakMap:Map;function ic(e,t,n){n=Qe(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){uo||(uo=!0,Jl=r),Vl(e,t)},n}function sc(e,t,n){n=Qe(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var o=t.value;n.payload=function(){return r(o)},n.callback=function(){Vl(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){Vl(e,t),typeof r!="function"&&(dt===null?dt=new Set([this]):dt.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function Gs(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Xf;var o=new Set;r.set(t,o)}else o=r.get(t),o===void 0&&(o=new Set,r.set(t,o));o.has(n)||(o.add(n),e=dp.bind(null,e,t,n),t.then(e,e))}function bs(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Ys(e,t,n,r,o){return e.mode&1?(e.flags|=65536,e.lanes=o,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Qe(-1,1),t.tag=2,ct(n,t,1))),n.lanes|=1),e)}var Jf=Xe.ReactCurrentOwner,fe=!1;function se(e,t,n,r){t.child=e===null?Fu(t,null,n,r):un(t,e.child,n,r)}function Xs(e,t,n,r,o){n=n.render;var l=t.ref;return rn(t,o),r=Di(e,t,n,r,l,o),n=Ai(),e!==null&&!fe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Ye(e,t,o)):(A&&n&&Ei(t),t.flags|=1,se(e,t,r,o),t.child)}function Js(e,t,n,r,o){if(e===null){var l=n.type;return typeof l=="function"&&!bi(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,ac(e,t,l,r,o)):(e=Br(n.type,null,r,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!(e.lanes&o)){var i=l.memoizedProps;if(n=n.compare,n=n!==null?n:Qn,n(i,r)&&e.ref===t.ref)return Ye(e,t,o)}return t.flags|=1,e=pt(l,r),e.ref=t.ref,e.return=t,t.child=e}function ac(e,t,n,r,o){if(e!==null){var l=e.memoizedProps;if(Qn(l,r)&&e.ref===t.ref)if(fe=!1,t.pendingProps=r=l,(e.lanes&o)!==0)e.flags&131072&&(fe=!0);else return t.lanes=e.lanes,Ye(e,t,o)}return ql(e,t,n,r,o)}function uc(e,t,n){var r=t.pendingProps,o=r.children,l=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},F(Jt,ge),ge|=n;else{if(!(n&1073741824))return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,F(Jt,ge),ge|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=l!==null?l.baseLanes:n,F(Jt,ge),ge|=r}else l!==null?(r=l.baseLanes|n,t.memoizedState=null):r=n,F(Jt,ge),ge|=r;return se(e,t,o,n),t.child}function cc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ql(e,t,n,r,o){var l=me(n)?Lt:ie.current;return l=sn(t,l),rn(t,o),n=Di(e,t,n,r,l,o),r=Ai(),e!==null&&!fe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Ye(e,t,o)):(A&&r&&Ei(t),t.flags|=1,se(e,t,n,o),t.child)}function Zs(e,t,n,r,o){if(me(n)){var l=!0;Zr(t)}else l=!1;if(rn(t,o),t.stateNode===null)Dr(e,t),lc(t,n,r),Bl(t,n,r,o),r=!0;else if(e===null){var i=t.stateNode,s=t.memoizedProps;i.props=s;var a=i.context,u=n.contextType;typeof u=="object"&&u!==null?u=Ne(u):(u=me(n)?Lt:ie.current,u=sn(t,u));var h=n.getDerivedStateFromProps,p=typeof h=="function"||typeof i.getSnapshotBeforeUpdate=="function";p||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(s!==r||a!==u)&&Ks(t,i,r,u),et=!1;var v=t.memoizedState;i.state=v,oo(t,r,i,o),a=t.memoizedState,s!==r||v!==a||pe.current||et?(typeof h=="function"&&(Wl(t,n,h,r),a=t.memoizedState),(s=et||Qs(t,n,s,r,v,a,u))?(p||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=a),i.props=r,i.state=a,i.context=u,r=s):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,Du(e,t),s=t.memoizedProps,u=t.type===t.elementType?s:ze(t.type,s),i.props=u,p=t.pendingProps,v=i.context,a=n.contextType,typeof a=="object"&&a!==null?a=Ne(a):(a=me(n)?Lt:ie.current,a=sn(t,a));var y=n.getDerivedStateFromProps;(h=typeof y=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(s!==p||v!==a)&&Ks(t,i,r,a),et=!1,v=t.memoizedState,i.state=v,oo(t,r,i,o);var _=t.memoizedState;s!==p||v!==_||pe.current||et?(typeof y=="function"&&(Wl(t,n,y,r),_=t.memoizedState),(u=et||Qs(t,n,u,r,v,_,a)||!1)?(h||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,_,a),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,_,a)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||s===e.memoizedProps&&v===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&v===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=_),i.props=r,i.state=_,i.context=a,r=u):(typeof i.componentDidUpdate!="function"||s===e.memoizedProps&&v===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&v===e.memoizedState||(t.flags|=1024),r=!1)}return $l(e,t,n,r,l,o)}function $l(e,t,n,r,o,l){cc(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return o&&Ds(t,n,!1),Ye(e,t,l);r=t.stateNode,Jf.current=t;var s=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=un(t,e.child,null,l),t.child=un(t,null,s,l)):se(e,t,s,l),t.memoizedState=r.state,o&&Ds(t,n,!0),t.child}function dc(e){var t=e.stateNode;t.pendingContext?Us(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Us(e,t.context,!1),Oi(e,t.containerInfo)}function ea(e,t,n,r,o){return an(),Ti(o),t.flags|=256,se(e,t,n,r),t.child}var Hl={dehydrated:null,treeContext:null,retryLane:0};function Ql(e){return{baseLanes:e,cachePool:null,transitions:null}}function fc(e,t,n){var r=t.pendingProps,o=B.current,l=!1,i=(t.flags&128)!==0,s;if((s=i)||(s=e!==null&&e.memoizedState===null?!1:(o&2)!==0),s?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),F(B,o&1),e===null)return Dl(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(i=r.children,e=r.fallback,l?(r=t.mode,l=t.child,i={mode:"hidden",children:i},!(r&1)&&l!==null?(l.childLanes=0,l.pendingProps=i):l=Eo(i,r,0,null),e=zt(e,r,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=Ql(n),t.memoizedState=Hl,e):Vi(t,i));if(o=e.memoizedState,o!==null&&(s=o.dehydrated,s!==null))return Zf(e,t,i,r,s,o,n);if(l){l=r.fallback,i=t.mode,o=e.child,s=o.sibling;var a={mode:"hidden",children:r.children};return!(i&1)&&t.child!==o?(r=t.child,r.childLanes=0,r.pendingProps=a,t.deletions=null):(r=pt(o,a),r.subtreeFlags=o.subtreeFlags&14680064),s!==null?l=pt(s,l):(l=zt(l,i,n,null),l.flags|=2),l.return=t,r.return=t,r.sibling=l,t.child=r,r=l,l=t.child,i=e.child.memoizedState,i=i===null?Ql(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},l.memoizedState=i,l.childLanes=e.childLanes&~n,t.memoizedState=Hl,r}return l=e.child,e=l.sibling,r=pt(l,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Vi(e,t){return t=Eo({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Er(e,t,n,r){return r!==null&&Ti(r),un(t,e.child,null,n),e=Vi(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Zf(e,t,n,r,o,l,i){if(n)return t.flags&256?(t.flags&=-257,r=ol(Error(x(422))),Er(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=r.fallback,o=t.mode,r=Eo({mode:"visible",children:r.children},o,0,null),l=zt(l,o,i,null),l.flags|=2,r.return=t,l.return=t,r.sibling=l,t.child=r,t.mode&1&&un(t,e.child,null,i),t.child.memoizedState=Ql(i),t.memoizedState=Hl,l);if(!(t.mode&1))return Er(e,t,i,null);if(o.data==="$!"){if(r=o.nextSibling&&o.nextSibling.dataset,r)var s=r.dgst;return r=s,l=Error(x(419)),r=ol(l,r,void 0),Er(e,t,i,r)}if(s=(i&e.childLanes)!==0,fe||s){if(r=Z,r!==null){switch(i&-i){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=o&(r.suspendedLanes|i)?0:o,o!==0&&o!==l.retryLane&&(l.retryLane=o,be(e,o),Oe(r,e,o,-1))}return Gi(),r=ol(Error(x(421))),Er(e,t,i,r)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=fp.bind(null,e),o._reactRetry=t,null):(e=l.treeContext,ye=ut(o.nextSibling),_e=t,A=!0,je=null,e!==null&&(Se[Pe++]=$e,Se[Pe++]=He,Se[Pe++]=jt,$e=e.id,He=e.overflow,jt=t),t=Vi(t,r.children),t.flags|=4096,t)}function ta(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Al(e.return,t,n)}function ll(e,t,n,r,o){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:o}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=r,l.tail=n,l.tailMode=o)}function pc(e,t,n){var r=t.pendingProps,o=r.revealOrder,l=r.tail;if(se(e,t,r.children,n),r=B.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ta(e,n,t);else if(e.tag===19)ta(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(F(B,r),!(t.mode&1))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;n!==null;)e=n.alternate,e!==null&&lo(e)===null&&(o=n),n=n.sibling;n=o,n===null?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),ll(t,!1,o,n,l);break;case"backwards":for(n=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&lo(e)===null){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}ll(t,!0,n,null,l);break;case"together":ll(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Dr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Ye(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Ot|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(x(153));if(t.child!==null){for(e=t.child,n=pt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=pt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ep(e,t,n){switch(t.tag){case 3:dc(t),an();break;case 5:Au(t);break;case 1:me(t.type)&&Zr(t);break;case 4:Oi(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,o=t.memoizedProps.value;F(no,r._currentValue),r._currentValue=o;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(F(B,B.current&1),t.flags|=128,null):n&t.child.childLanes?fc(e,t,n):(F(B,B.current&1),e=Ye(e,t,n),e!==null?e.sibling:null);F(B,B.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return pc(e,t,n);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),F(B,B.current),r)break;return null;case 22:case 23:return t.lanes=0,uc(e,t,n)}return Ye(e,t,n)}var mc,Kl,hc,vc;mc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Kl=function(){};hc=function(e,t,n,r){var o=e.memoizedProps;if(o!==r){e=t.stateNode,Tt(We.current);var l=null;switch(n){case"input":o=hl(e,o),r=hl(e,r),l=[];break;case"select":o=q({},o,{value:void 0}),r=q({},r,{value:void 0}),l=[];break;case"textarea":o=yl(e,o),r=yl(e,r),l=[];break;default:typeof o.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Xr)}kl(n,r);var i;n=null;for(u in o)if(!r.hasOwnProperty(u)&&o.hasOwnProperty(u)&&o[u]!=null)if(u==="style"){var s=o[u];for(i in s)s.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(An.hasOwnProperty(u)?l||(l=[]):(l=l||[]).push(u,null));for(u in r){var a=r[u];if(s=o!=null?o[u]:void 0,r.hasOwnProperty(u)&&a!==s&&(a!=null||s!=null))if(u==="style")if(s){for(i in s)!s.hasOwnProperty(i)||a&&a.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in a)a.hasOwnProperty(i)&&s[i]!==a[i]&&(n||(n={}),n[i]=a[i])}else n||(l||(l=[]),l.push(u,n)),n=a;else u==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,s=s?s.__html:void 0,a!=null&&s!==a&&(l=l||[]).push(u,a)):u==="children"?typeof a!="string"&&typeof a!="number"||(l=l||[]).push(u,""+a):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(An.hasOwnProperty(u)?(a!=null&&u==="onScroll"&&U("scroll",e),l||s===a||(l=[])):(l=l||[]).push(u,a))}n&&(l=l||[]).push("style",n);var u=l;(t.updateQueue=u)&&(t.flags|=4)}};vc=function(e,t,n,r){n!==r&&(t.flags|=4)};function Pn(e,t){if(!A)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function oe(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags&14680064,r|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags,r|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function tp(e,t,n){var r=t.pendingProps;switch(Ni(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return oe(t),null;case 1:return me(t.type)&&Jr(),oe(t),null;case 3:return r=t.stateNode,cn(),D(pe),D(ie),Fi(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Pr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,je!==null&&(ti(je),je=null))),Kl(e,t),oe(t),null;case 5:Ii(t);var o=Tt(Xn.current);if(n=t.type,e!==null&&t.stateNode!=null)hc(e,t,n,r,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(x(166));return oe(t),null}if(e=Tt(We.current),Pr(t)){r=t.stateNode,n=t.type;var l=t.memoizedProps;switch(r[De]=t,r[bn]=l,e=(t.mode&1)!==0,n){case"dialog":U("cancel",r),U("close",r);break;case"iframe":case"object":case"embed":U("load",r);break;case"video":case"audio":for(o=0;o<Mn.length;o++)U(Mn[o],r);break;case"source":U("error",r);break;case"img":case"image":case"link":U("error",r),U("load",r);break;case"details":U("toggle",r);break;case"input":cs(r,l),U("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!l.multiple},U("invalid",r);break;case"textarea":fs(r,l),U("invalid",r)}kl(n,l),o=null;for(var i in l)if(l.hasOwnProperty(i)){var s=l[i];i==="children"?typeof s=="string"?r.textContent!==s&&(l.suppressHydrationWarning!==!0&&Sr(r.textContent,s,e),o=["children",s]):typeof s=="number"&&r.textContent!==""+s&&(l.suppressHydrationWarning!==!0&&Sr(r.textContent,s,e),o=["children",""+s]):An.hasOwnProperty(i)&&s!=null&&i==="onScroll"&&U("scroll",r)}switch(n){case"input":hr(r),ds(r,l,!0);break;case"textarea":hr(r),ps(r);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(r.onclick=Xr)}r=o,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=$a(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[De]=t,e[bn]=r,mc(e,t,!1,!1),t.stateNode=e;e:{switch(i=wl(n,r),n){case"dialog":U("cancel",e),U("close",e),o=r;break;case"iframe":case"object":case"embed":U("load",e),o=r;break;case"video":case"audio":for(o=0;o<Mn.length;o++)U(Mn[o],e);o=r;break;case"source":U("error",e),o=r;break;case"img":case"image":case"link":U("error",e),U("load",e),o=r;break;case"details":U("toggle",e),o=r;break;case"input":cs(e,r),o=hl(e,r),U("invalid",e);break;case"option":o=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},o=q({},r,{value:void 0}),U("invalid",e);break;case"textarea":fs(e,r),o=yl(e,r),U("invalid",e);break;default:o=r}kl(n,o),s=o;for(l in s)if(s.hasOwnProperty(l)){var a=s[l];l==="style"?Ka(e,a):l==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,a!=null&&Ha(e,a)):l==="children"?typeof a=="string"?(n!=="textarea"||a!=="")&&Wn(e,a):typeof a=="number"&&Wn(e,""+a):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(An.hasOwnProperty(l)?a!=null&&l==="onScroll"&&U("scroll",e):a!=null&&fi(e,l,a,i))}switch(n){case"input":hr(e),ds(e,r,!1);break;case"textarea":hr(e),ps(e);break;case"option":r.value!=null&&e.setAttribute("value",""+vt(r.value));break;case"select":e.multiple=!!r.multiple,l=r.value,l!=null?Zt(e,!!r.multiple,l,!1):r.defaultValue!=null&&Zt(e,!!r.multiple,r.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=Xr)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return oe(t),null;case 6:if(e&&t.stateNode!=null)vc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(x(166));if(n=Tt(Xn.current),Tt(We.current),Pr(t)){if(r=t.stateNode,n=t.memoizedProps,r[De]=t,(l=r.nodeValue!==n)&&(e=_e,e!==null))switch(e.tag){case 3:Sr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Sr(r.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[De]=t,t.stateNode=r}return oe(t),null;case 13:if(D(B),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(A&&ye!==null&&t.mode&1&&!(t.flags&128))Ou(),an(),t.flags|=98560,l=!1;else if(l=Pr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!l)throw Error(x(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(x(317));l[De]=t}else an(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;oe(t),l=!1}else je!==null&&(ti(je),je=null),l=!0;if(!l)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||B.current&1?Y===0&&(Y=3):Gi())),t.updateQueue!==null&&(t.flags|=4),oe(t),null);case 4:return cn(),Kl(e,t),e===null&&Kn(t.stateNode.containerInfo),oe(t),null;case 10:return Li(t.type._context),oe(t),null;case 17:return me(t.type)&&Jr(),oe(t),null;case 19:if(D(B),l=t.memoizedState,l===null)return oe(t),null;if(r=(t.flags&128)!==0,i=l.rendering,i===null)if(r)Pn(l,!1);else{if(Y!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(i=lo(e),i!==null){for(t.flags|=128,Pn(l,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)l=n,e=r,l.flags&=14680066,i=l.alternate,i===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=i.childLanes,l.lanes=i.lanes,l.child=i.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=i.memoizedProps,l.memoizedState=i.memoizedState,l.updateQueue=i.updateQueue,l.type=i.type,e=i.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return F(B,B.current&1|2),t.child}e=e.sibling}l.tail!==null&&Q()>fn&&(t.flags|=128,r=!0,Pn(l,!1),t.lanes=4194304)}else{if(!r)if(e=lo(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Pn(l,!0),l.tail===null&&l.tailMode==="hidden"&&!i.alternate&&!A)return oe(t),null}else 2*Q()-l.renderingStartTime>fn&&n!==1073741824&&(t.flags|=128,r=!0,Pn(l,!1),t.lanes=4194304);l.isBackwards?(i.sibling=t.child,t.child=i):(n=l.last,n!==null?n.sibling=i:t.child=i,l.last=i)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=Q(),t.sibling=null,n=B.current,F(B,r?n&1|2:n&1),t):(oe(t),null);case 22:case 23:return Ki(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?ge&1073741824&&(oe(t),t.subtreeFlags&6&&(t.flags|=8192)):oe(t),null;case 24:return null;case 25:return null}throw Error(x(156,t.tag))}function np(e,t){switch(Ni(t),t.tag){case 1:return me(t.type)&&Jr(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return cn(),D(pe),D(ie),Fi(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Ii(t),null;case 13:if(D(B),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(x(340));an()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return D(B),null;case 4:return cn(),null;case 10:return Li(t.type._context),null;case 22:case 23:return Ki(),null;case 24:return null;default:return null}}var Nr=!1,le=!1,rp=typeof WeakSet=="function"?WeakSet:Set,N=null;function Xt(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){$(e,t,r)}else n.current=null}function Gl(e,t,n){try{n()}catch(r){$(e,t,r)}}var na=!1;function op(e,t){if(Ll=Gr,e=wu(),Ci(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var o=r.anchorOffset,l=r.focusNode;r=r.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var i=0,s=-1,a=-1,u=0,h=0,p=e,v=null;t:for(;;){for(var y;p!==n||o!==0&&p.nodeType!==3||(s=i+o),p!==l||r!==0&&p.nodeType!==3||(a=i+r),p.nodeType===3&&(i+=p.nodeValue.length),(y=p.firstChild)!==null;)v=p,p=y;for(;;){if(p===e)break t;if(v===n&&++u===o&&(s=i),v===l&&++h===r&&(a=i),(y=p.nextSibling)!==null)break;p=v,v=p.parentNode}p=y}n=s===-1||a===-1?null:{start:s,end:a}}else n=null}n=n||{start:0,end:0}}else n=null;for(jl={focusedElem:e,selectionRange:n},Gr=!1,N=t;N!==null;)if(t=N,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,N=e;else for(;N!==null;){t=N;try{var _=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(_!==null){var k=_.memoizedProps,P=_.memoizedState,f=t.stateNode,c=f.getSnapshotBeforeUpdate(t.elementType===t.type?k:ze(t.type,k),P);f.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var d=t.stateNode.containerInfo;d.nodeType===1?d.textContent="":d.nodeType===9&&d.documentElement&&d.removeChild(d.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(x(163))}}catch(g){$(t,t.return,g)}if(e=t.sibling,e!==null){e.return=t.return,N=e;break}N=t.return}return _=na,na=!1,_}function Fn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var o=r=r.next;do{if((o.tag&e)===e){var l=o.destroy;o.destroy=void 0,l!==void 0&&Gl(t,n,l)}o=o.next}while(o!==r)}}function Po(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function bl(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function gc(e){var t=e.alternate;t!==null&&(e.alternate=null,gc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[De],delete t[bn],delete t[Il],delete t[Wf],delete t[Bf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function yc(e){return e.tag===5||e.tag===3||e.tag===4}function ra(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||yc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Yl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Xr));else if(r!==4&&(e=e.child,e!==null))for(Yl(e,t,n),e=e.sibling;e!==null;)Yl(e,t,n),e=e.sibling}function Xl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Xl(e,t,n),e=e.sibling;e!==null;)Xl(e,t,n),e=e.sibling}var ee=null,Le=!1;function Je(e,t,n){for(n=n.child;n!==null;)_c(e,t,n),n=n.sibling}function _c(e,t,n){if(Ae&&typeof Ae.onCommitFiberUnmount=="function")try{Ae.onCommitFiberUnmount(vo,n)}catch{}switch(n.tag){case 5:le||Xt(n,t);case 6:var r=ee,o=Le;ee=null,Je(e,t,n),ee=r,Le=o,ee!==null&&(Le?(e=ee,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):ee.removeChild(n.stateNode));break;case 18:ee!==null&&(Le?(e=ee,n=n.stateNode,e.nodeType===8?Jo(e.parentNode,n):e.nodeType===1&&Jo(e,n),$n(e)):Jo(ee,n.stateNode));break;case 4:r=ee,o=Le,ee=n.stateNode.containerInfo,Le=!0,Je(e,t,n),ee=r,Le=o;break;case 0:case 11:case 14:case 15:if(!le&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){o=r=r.next;do{var l=o,i=l.destroy;l=l.tag,i!==void 0&&(l&2||l&4)&&Gl(n,t,i),o=o.next}while(o!==r)}Je(e,t,n);break;case 1:if(!le&&(Xt(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(s){$(n,t,s)}Je(e,t,n);break;case 21:Je(e,t,n);break;case 22:n.mode&1?(le=(r=le)||n.memoizedState!==null,Je(e,t,n),le=r):Je(e,t,n);break;default:Je(e,t,n)}}function oa(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new rp),t.forEach(function(r){var o=pp.bind(null,e,r);n.has(r)||(n.add(r),r.then(o,o))})}}function Me(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var o=n[r];try{var l=e,i=t,s=i;e:for(;s!==null;){switch(s.tag){case 5:ee=s.stateNode,Le=!1;break e;case 3:ee=s.stateNode.containerInfo,Le=!0;break e;case 4:ee=s.stateNode.containerInfo,Le=!0;break e}s=s.return}if(ee===null)throw Error(x(160));_c(l,i,o),ee=null,Le=!1;var a=o.alternate;a!==null&&(a.return=null),o.return=null}catch(u){$(o,t,u)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)kc(t,e),t=t.sibling}function kc(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Me(t,e),Fe(e),r&4){try{Fn(3,e,e.return),Po(3,e)}catch(k){$(e,e.return,k)}try{Fn(5,e,e.return)}catch(k){$(e,e.return,k)}}break;case 1:Me(t,e),Fe(e),r&512&&n!==null&&Xt(n,n.return);break;case 5:if(Me(t,e),Fe(e),r&512&&n!==null&&Xt(n,n.return),e.flags&32){var o=e.stateNode;try{Wn(o,"")}catch(k){$(e,e.return,k)}}if(r&4&&(o=e.stateNode,o!=null)){var l=e.memoizedProps,i=n!==null?n.memoizedProps:l,s=e.type,a=e.updateQueue;if(e.updateQueue=null,a!==null)try{s==="input"&&l.type==="radio"&&l.name!=null&&Va(o,l),wl(s,i);var u=wl(s,l);for(i=0;i<a.length;i+=2){var h=a[i],p=a[i+1];h==="style"?Ka(o,p):h==="dangerouslySetInnerHTML"?Ha(o,p):h==="children"?Wn(o,p):fi(o,h,p,u)}switch(s){case"input":vl(o,l);break;case"textarea":qa(o,l);break;case"select":var v=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!l.multiple;var y=l.value;y!=null?Zt(o,!!l.multiple,y,!1):v!==!!l.multiple&&(l.defaultValue!=null?Zt(o,!!l.multiple,l.defaultValue,!0):Zt(o,!!l.multiple,l.multiple?[]:"",!1))}o[bn]=l}catch(k){$(e,e.return,k)}}break;case 6:if(Me(t,e),Fe(e),r&4){if(e.stateNode===null)throw Error(x(162));o=e.stateNode,l=e.memoizedProps;try{o.nodeValue=l}catch(k){$(e,e.return,k)}}break;case 3:if(Me(t,e),Fe(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{$n(t.containerInfo)}catch(k){$(e,e.return,k)}break;case 4:Me(t,e),Fe(e);break;case 13:Me(t,e),Fe(e),o=e.child,o.flags&8192&&(l=o.memoizedState!==null,o.stateNode.isHidden=l,!l||o.alternate!==null&&o.alternate.memoizedState!==null||(Hi=Q())),r&4&&oa(e);break;case 22:if(h=n!==null&&n.memoizedState!==null,e.mode&1?(le=(u=le)||h,Me(t,e),le=u):Me(t,e),Fe(e),r&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!h&&e.mode&1)for(N=e,h=e.child;h!==null;){for(p=N=h;N!==null;){switch(v=N,y=v.child,v.tag){case 0:case 11:case 14:case 15:Fn(4,v,v.return);break;case 1:Xt(v,v.return);var _=v.stateNode;if(typeof _.componentWillUnmount=="function"){r=v,n=v.return;try{t=r,_.props=t.memoizedProps,_.state=t.memoizedState,_.componentWillUnmount()}catch(k){$(r,n,k)}}break;case 5:Xt(v,v.return);break;case 22:if(v.memoizedState!==null){ia(p);continue}}y!==null?(y.return=v,N=y):ia(p)}h=h.sibling}e:for(h=null,p=e;;){if(p.tag===5){if(h===null){h=p;try{o=p.stateNode,u?(l=o.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(s=p.stateNode,a=p.memoizedProps.style,i=a!=null&&a.hasOwnProperty("display")?a.display:null,s.style.display=Qa("display",i))}catch(k){$(e,e.return,k)}}}else if(p.tag===6){if(h===null)try{p.stateNode.nodeValue=u?"":p.memoizedProps}catch(k){$(e,e.return,k)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===e)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===e)break e;for(;p.sibling===null;){if(p.return===null||p.return===e)break e;h===p&&(h=null),p=p.return}h===p&&(h=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Me(t,e),Fe(e),r&4&&oa(e);break;case 21:break;default:Me(t,e),Fe(e)}}function Fe(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(yc(n)){var r=n;break e}n=n.return}throw Error(x(160))}switch(r.tag){case 5:var o=r.stateNode;r.flags&32&&(Wn(o,""),r.flags&=-33);var l=ra(e);Xl(e,l,o);break;case 3:case 4:var i=r.stateNode.containerInfo,s=ra(e);Yl(e,s,i);break;default:throw Error(x(161))}}catch(a){$(e,e.return,a)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function lp(e,t,n){N=e,wc(e)}function wc(e,t,n){for(var r=(e.mode&1)!==0;N!==null;){var o=N,l=o.child;if(o.tag===22&&r){var i=o.memoizedState!==null||Nr;if(!i){var s=o.alternate,a=s!==null&&s.memoizedState!==null||le;s=Nr;var u=le;if(Nr=i,(le=a)&&!u)for(N=o;N!==null;)i=N,a=i.child,i.tag===22&&i.memoizedState!==null?sa(o):a!==null?(a.return=i,N=a):sa(o);for(;l!==null;)N=l,wc(l),l=l.sibling;N=o,Nr=s,le=u}la(e)}else o.subtreeFlags&8772&&l!==null?(l.return=o,N=l):la(e)}}function la(e){for(;N!==null;){var t=N;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:le||Po(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!le)if(n===null)r.componentDidMount();else{var o=t.elementType===t.type?n.memoizedProps:ze(t.type,n.memoizedProps);r.componentDidUpdate(o,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&qs(t,l,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}qs(t,i,n)}break;case 5:var s=t.stateNode;if(n===null&&t.flags&4){n=s;var a=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":a.autoFocus&&n.focus();break;case"img":a.src&&(n.src=a.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var h=u.memoizedState;if(h!==null){var p=h.dehydrated;p!==null&&$n(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(x(163))}le||t.flags&512&&bl(t)}catch(v){$(t,t.return,v)}}if(t===e){N=null;break}if(n=t.sibling,n!==null){n.return=t.return,N=n;break}N=t.return}}function ia(e){for(;N!==null;){var t=N;if(t===e){N=null;break}var n=t.sibling;if(n!==null){n.return=t.return,N=n;break}N=t.return}}function sa(e){for(;N!==null;){var t=N;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Po(4,t)}catch(a){$(t,n,a)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var o=t.return;try{r.componentDidMount()}catch(a){$(t,o,a)}}var l=t.return;try{bl(t)}catch(a){$(t,l,a)}break;case 5:var i=t.return;try{bl(t)}catch(a){$(t,i,a)}}}catch(a){$(t,t.return,a)}if(t===e){N=null;break}var s=t.sibling;if(s!==null){s.return=t.return,N=s;break}N=t.return}}var ip=Math.ceil,ao=Xe.ReactCurrentDispatcher,qi=Xe.ReactCurrentOwner,Ee=Xe.ReactCurrentBatchConfig,O=0,Z=null,K=null,te=0,ge=0,Jt=_t(0),Y=0,tr=null,Ot=0,Co=0,$i=0,Un=null,de=null,Hi=0,fn=1/0,Ve=null,uo=!1,Jl=null,dt=null,Tr=!1,ot=null,co=0,Dn=0,Zl=null,Ar=-1,Wr=0;function ae(){return O&6?Q():Ar!==-1?Ar:Ar=Q()}function ft(e){return e.mode&1?O&2&&te!==0?te&-te:qf.transition!==null?(Wr===0&&(Wr=lu()),Wr):(e=I,e!==0||(e=window.event,e=e===void 0?16:fu(e.type)),e):1}function Oe(e,t,n,r){if(50<Dn)throw Dn=0,Zl=null,Error(x(185));lr(e,n,r),(!(O&2)||e!==Z)&&(e===Z&&(!(O&2)&&(Co|=n),Y===4&&nt(e,te)),he(e,r),n===1&&O===0&&!(t.mode&1)&&(fn=Q()+500,wo&&kt()))}function he(e,t){var n=e.callbackNode;Vd(e,t);var r=Kr(e,e===Z?te:0);if(r===0)n!==null&&vs(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&vs(n),t===1)e.tag===0?Vf(aa.bind(null,e)):Lu(aa.bind(null,e)),Df(function(){!(O&6)&&kt()}),n=null;else{switch(iu(r)){case 1:n=gi;break;case 4:n=ru;break;case 16:n=Qr;break;case 536870912:n=ou;break;default:n=Qr}n=Mc(n,xc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function xc(e,t){if(Ar=-1,Wr=0,O&6)throw Error(x(327));var n=e.callbackNode;if(on()&&e.callbackNode!==n)return null;var r=Kr(e,e===Z?te:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=fo(e,r);else{t=r;var o=O;O|=2;var l=Pc();(Z!==e||te!==t)&&(Ve=null,fn=Q()+500,Mt(e,t));do try{up();break}catch(s){Sc(e,s)}while(!0);zi(),ao.current=l,O=o,K!==null?t=0:(Z=null,te=0,t=Y)}if(t!==0){if(t===2&&(o=El(e),o!==0&&(r=o,t=ei(e,o))),t===1)throw n=tr,Mt(e,0),nt(e,r),he(e,Q()),n;if(t===6)nt(e,r);else{if(o=e.current.alternate,!(r&30)&&!sp(o)&&(t=fo(e,r),t===2&&(l=El(e),l!==0&&(r=l,t=ei(e,l))),t===1))throw n=tr,Mt(e,0),nt(e,r),he(e,Q()),n;switch(e.finishedWork=o,e.finishedLanes=r,t){case 0:case 1:throw Error(x(345));case 2:Ct(e,de,Ve);break;case 3:if(nt(e,r),(r&130023424)===r&&(t=Hi+500-Q(),10<t)){if(Kr(e,0)!==0)break;if(o=e.suspendedLanes,(o&r)!==r){ae(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Ol(Ct.bind(null,e,de,Ve),t);break}Ct(e,de,Ve);break;case 4:if(nt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,o=-1;0<r;){var i=31-Re(r);l=1<<i,i=t[i],i>o&&(o=i),r&=~l}if(r=o,r=Q()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*ip(r/1960))-r,10<r){e.timeoutHandle=Ol(Ct.bind(null,e,de,Ve),r);break}Ct(e,de,Ve);break;case 5:Ct(e,de,Ve);break;default:throw Error(x(329))}}}return he(e,Q()),e.callbackNode===n?xc.bind(null,e):null}function ei(e,t){var n=Un;return e.current.memoizedState.isDehydrated&&(Mt(e,t).flags|=256),e=fo(e,t),e!==2&&(t=de,de=n,t!==null&&ti(t)),e}function ti(e){de===null?de=e:de.push.apply(de,e)}function sp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var o=n[r],l=o.getSnapshot;o=o.value;try{if(!Ie(l(),o))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function nt(e,t){for(t&=~$i,t&=~Co,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Re(t),r=1<<n;e[n]=-1,t&=~r}}function aa(e){if(O&6)throw Error(x(327));on();var t=Kr(e,0);if(!(t&1))return he(e,Q()),null;var n=fo(e,t);if(e.tag!==0&&n===2){var r=El(e);r!==0&&(t=r,n=ei(e,r))}if(n===1)throw n=tr,Mt(e,0),nt(e,t),he(e,Q()),n;if(n===6)throw Error(x(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Ct(e,de,Ve),he(e,Q()),null}function Qi(e,t){var n=O;O|=1;try{return e(t)}finally{O=n,O===0&&(fn=Q()+500,wo&&kt())}}function It(e){ot!==null&&ot.tag===0&&!(O&6)&&on();var t=O;O|=1;var n=Ee.transition,r=I;try{if(Ee.transition=null,I=1,e)return e()}finally{I=r,Ee.transition=n,O=t,!(O&6)&&kt()}}function Ki(){ge=Jt.current,D(Jt)}function Mt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Uf(n)),K!==null)for(n=K.return;n!==null;){var r=n;switch(Ni(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Jr();break;case 3:cn(),D(pe),D(ie),Fi();break;case 5:Ii(r);break;case 4:cn();break;case 13:D(B);break;case 19:D(B);break;case 10:Li(r.type._context);break;case 22:case 23:Ki()}n=n.return}if(Z=e,K=e=pt(e.current,null),te=ge=t,Y=0,tr=null,$i=Co=Ot=0,de=Un=null,Nt!==null){for(t=0;t<Nt.length;t++)if(n=Nt[t],r=n.interleaved,r!==null){n.interleaved=null;var o=r.next,l=n.pending;if(l!==null){var i=l.next;l.next=o,r.next=i}n.pending=r}Nt=null}return e}function Sc(e,t){do{var n=K;try{if(zi(),Fr.current=so,io){for(var r=V.memoizedState;r!==null;){var o=r.queue;o!==null&&(o.pending=null),r=r.next}io=!1}if(Rt=0,J=b=V=null,In=!1,Jn=0,qi.current=null,n===null||n.return===null){Y=1,tr=t,K=null;break}e:{var l=e,i=n.return,s=n,a=t;if(t=te,s.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){var u=a,h=s,p=h.tag;if(!(h.mode&1)&&(p===0||p===11||p===15)){var v=h.alternate;v?(h.updateQueue=v.updateQueue,h.memoizedState=v.memoizedState,h.lanes=v.lanes):(h.updateQueue=null,h.memoizedState=null)}var y=bs(i);if(y!==null){y.flags&=-257,Ys(y,i,s,l,t),y.mode&1&&Gs(l,u,t),t=y,a=u;var _=t.updateQueue;if(_===null){var k=new Set;k.add(a),t.updateQueue=k}else _.add(a);break e}else{if(!(t&1)){Gs(l,u,t),Gi();break e}a=Error(x(426))}}else if(A&&s.mode&1){var P=bs(i);if(P!==null){!(P.flags&65536)&&(P.flags|=256),Ys(P,i,s,l,t),Ti(dn(a,s));break e}}l=a=dn(a,s),Y!==4&&(Y=2),Un===null?Un=[l]:Un.push(l),l=i;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var f=ic(l,a,t);Vs(l,f);break e;case 1:s=a;var c=l.type,d=l.stateNode;if(!(l.flags&128)&&(typeof c.getDerivedStateFromError=="function"||d!==null&&typeof d.componentDidCatch=="function"&&(dt===null||!dt.has(d)))){l.flags|=65536,t&=-t,l.lanes|=t;var g=sc(l,s,t);Vs(l,g);break e}}l=l.return}while(l!==null)}Ec(n)}catch(S){t=S,K===n&&n!==null&&(K=n=n.return);continue}break}while(!0)}function Pc(){var e=ao.current;return ao.current=so,e===null?so:e}function Gi(){(Y===0||Y===3||Y===2)&&(Y=4),Z===null||!(Ot&268435455)&&!(Co&268435455)||nt(Z,te)}function fo(e,t){var n=O;O|=2;var r=Pc();(Z!==e||te!==t)&&(Ve=null,Mt(e,t));do try{ap();break}catch(o){Sc(e,o)}while(!0);if(zi(),O=n,ao.current=r,K!==null)throw Error(x(261));return Z=null,te=0,Y}function ap(){for(;K!==null;)Cc(K)}function up(){for(;K!==null&&!Rd();)Cc(K)}function Cc(e){var t=Tc(e.alternate,e,ge);e.memoizedProps=e.pendingProps,t===null?Ec(e):K=t,qi.current=null}function Ec(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=np(n,t),n!==null){n.flags&=32767,K=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Y=6,K=null;return}}else if(n=tp(n,t,ge),n!==null){K=n;return}if(t=t.sibling,t!==null){K=t;return}K=t=e}while(t!==null);Y===0&&(Y=5)}function Ct(e,t,n){var r=I,o=Ee.transition;try{Ee.transition=null,I=1,cp(e,t,n,r)}finally{Ee.transition=o,I=r}return null}function cp(e,t,n,r){do on();while(ot!==null);if(O&6)throw Error(x(327));n=e.finishedWork;var o=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(x(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if(qd(e,l),e===Z&&(K=Z=null,te=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Tr||(Tr=!0,Mc(Qr,function(){return on(),null})),l=(n.flags&15990)!==0,n.subtreeFlags&15990||l){l=Ee.transition,Ee.transition=null;var i=I;I=1;var s=O;O|=4,qi.current=null,op(e,n),kc(n,e),zf(jl),Gr=!!Ll,jl=Ll=null,e.current=n,lp(n),Od(),O=s,I=i,Ee.transition=l}else e.current=n;if(Tr&&(Tr=!1,ot=e,co=o),l=e.pendingLanes,l===0&&(dt=null),Ud(n.stateNode),he(e,Q()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)o=t[n],r(o.value,{componentStack:o.stack,digest:o.digest});if(uo)throw uo=!1,e=Jl,Jl=null,e;return co&1&&e.tag!==0&&on(),l=e.pendingLanes,l&1?e===Zl?Dn++:(Dn=0,Zl=e):Dn=0,kt(),null}function on(){if(ot!==null){var e=iu(co),t=Ee.transition,n=I;try{if(Ee.transition=null,I=16>e?16:e,ot===null)var r=!1;else{if(e=ot,ot=null,co=0,O&6)throw Error(x(331));var o=O;for(O|=4,N=e.current;N!==null;){var l=N,i=l.child;if(N.flags&16){var s=l.deletions;if(s!==null){for(var a=0;a<s.length;a++){var u=s[a];for(N=u;N!==null;){var h=N;switch(h.tag){case 0:case 11:case 15:Fn(8,h,l)}var p=h.child;if(p!==null)p.return=h,N=p;else for(;N!==null;){h=N;var v=h.sibling,y=h.return;if(gc(h),h===u){N=null;break}if(v!==null){v.return=y,N=v;break}N=y}}}var _=l.alternate;if(_!==null){var k=_.child;if(k!==null){_.child=null;do{var P=k.sibling;k.sibling=null,k=P}while(k!==null)}}N=l}}if(l.subtreeFlags&2064&&i!==null)i.return=l,N=i;else e:for(;N!==null;){if(l=N,l.flags&2048)switch(l.tag){case 0:case 11:case 15:Fn(9,l,l.return)}var f=l.sibling;if(f!==null){f.return=l.return,N=f;break e}N=l.return}}var c=e.current;for(N=c;N!==null;){i=N;var d=i.child;if(i.subtreeFlags&2064&&d!==null)d.return=i,N=d;else e:for(i=c;N!==null;){if(s=N,s.flags&2048)try{switch(s.tag){case 0:case 11:case 15:Po(9,s)}}catch(S){$(s,s.return,S)}if(s===i){N=null;break e}var g=s.sibling;if(g!==null){g.return=s.return,N=g;break e}N=s.return}}if(O=o,kt(),Ae&&typeof Ae.onPostCommitFiberRoot=="function")try{Ae.onPostCommitFiberRoot(vo,e)}catch{}r=!0}return r}finally{I=n,Ee.transition=t}}return!1}function ua(e,t,n){t=dn(n,t),t=ic(e,t,1),e=ct(e,t,1),t=ae(),e!==null&&(lr(e,1,t),he(e,t))}function $(e,t,n){if(e.tag===3)ua(e,e,n);else for(;t!==null;){if(t.tag===3){ua(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(dt===null||!dt.has(r))){e=dn(n,e),e=sc(t,e,1),t=ct(t,e,1),e=ae(),t!==null&&(lr(t,1,e),he(t,e));break}}t=t.return}}function dp(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=ae(),e.pingedLanes|=e.suspendedLanes&n,Z===e&&(te&n)===n&&(Y===4||Y===3&&(te&130023424)===te&&500>Q()-Hi?Mt(e,0):$i|=n),he(e,t)}function Nc(e,t){t===0&&(e.mode&1?(t=yr,yr<<=1,!(yr&130023424)&&(yr=4194304)):t=1);var n=ae();e=be(e,t),e!==null&&(lr(e,t,n),he(e,n))}function fp(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Nc(e,n)}function pp(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,o=e.memoizedState;o!==null&&(n=o.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(x(314))}r!==null&&r.delete(t),Nc(e,n)}var Tc;Tc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||pe.current)fe=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return fe=!1,ep(e,t,n);fe=!!(e.flags&131072)}else fe=!1,A&&t.flags&1048576&&ju(t,to,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Dr(e,t),e=t.pendingProps;var o=sn(t,ie.current);rn(t,n),o=Di(null,t,r,e,o,n);var l=Ai();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,me(r)?(l=!0,Zr(t)):l=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,Ri(t),o.updater=So,t.stateNode=o,o._reactInternals=t,Bl(t,r,e,n),t=$l(null,t,r,!0,l,n)):(t.tag=0,A&&l&&Ei(t),se(null,t,o,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Dr(e,t),e=t.pendingProps,o=r._init,r=o(r._payload),t.type=r,o=t.tag=hp(r),e=ze(r,e),o){case 0:t=ql(null,t,r,e,n);break e;case 1:t=Zs(null,t,r,e,n);break e;case 11:t=Xs(null,t,r,e,n);break e;case 14:t=Js(null,t,r,ze(r.type,e),n);break e}throw Error(x(306,r,""))}return t;case 0:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:ze(r,o),ql(e,t,r,o,n);case 1:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:ze(r,o),Zs(e,t,r,o,n);case 3:e:{if(dc(t),e===null)throw Error(x(387));r=t.pendingProps,l=t.memoizedState,o=l.element,Du(e,t),oo(t,r,null,n);var i=t.memoizedState;if(r=i.element,l.isDehydrated)if(l={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){o=dn(Error(x(423)),t),t=ea(e,t,r,n,o);break e}else if(r!==o){o=dn(Error(x(424)),t),t=ea(e,t,r,n,o);break e}else for(ye=ut(t.stateNode.containerInfo.firstChild),_e=t,A=!0,je=null,n=Fu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(an(),r===o){t=Ye(e,t,n);break e}se(e,t,r,n)}t=t.child}return t;case 5:return Au(t),e===null&&Dl(t),r=t.type,o=t.pendingProps,l=e!==null?e.memoizedProps:null,i=o.children,Rl(r,o)?i=null:l!==null&&Rl(r,l)&&(t.flags|=32),cc(e,t),se(e,t,i,n),t.child;case 6:return e===null&&Dl(t),null;case 13:return fc(e,t,n);case 4:return Oi(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=un(t,null,r,n):se(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:ze(r,o),Xs(e,t,r,o,n);case 7:return se(e,t,t.pendingProps,n),t.child;case 8:return se(e,t,t.pendingProps.children,n),t.child;case 12:return se(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,o=t.pendingProps,l=t.memoizedProps,i=o.value,F(no,r._currentValue),r._currentValue=i,l!==null)if(Ie(l.value,i)){if(l.children===o.children&&!pe.current){t=Ye(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var s=l.dependencies;if(s!==null){i=l.child;for(var a=s.firstContext;a!==null;){if(a.context===r){if(l.tag===1){a=Qe(-1,n&-n),a.tag=2;var u=l.updateQueue;if(u!==null){u=u.shared;var h=u.pending;h===null?a.next=a:(a.next=h.next,h.next=a),u.pending=a}}l.lanes|=n,a=l.alternate,a!==null&&(a.lanes|=n),Al(l.return,n,t),s.lanes|=n;break}a=a.next}}else if(l.tag===10)i=l.type===t.type?null:l.child;else if(l.tag===18){if(i=l.return,i===null)throw Error(x(341));i.lanes|=n,s=i.alternate,s!==null&&(s.lanes|=n),Al(i,n,t),i=l.sibling}else i=l.child;if(i!==null)i.return=l;else for(i=l;i!==null;){if(i===t){i=null;break}if(l=i.sibling,l!==null){l.return=i.return,i=l;break}i=i.return}l=i}se(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=t.pendingProps.children,rn(t,n),o=Ne(o),r=r(o),t.flags|=1,se(e,t,r,n),t.child;case 14:return r=t.type,o=ze(r,t.pendingProps),o=ze(r.type,o),Js(e,t,r,o,n);case 15:return ac(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:ze(r,o),Dr(e,t),t.tag=1,me(r)?(e=!0,Zr(t)):e=!1,rn(t,n),lc(t,r,o),Bl(t,r,o,n),$l(null,t,r,!0,e,n);case 19:return pc(e,t,n);case 22:return uc(e,t,n)}throw Error(x(156,t.tag))};function Mc(e,t){return nu(e,t)}function mp(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ce(e,t,n,r){return new mp(e,t,n,r)}function bi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function hp(e){if(typeof e=="function")return bi(e)?1:0;if(e!=null){if(e=e.$$typeof,e===mi)return 11;if(e===hi)return 14}return 2}function pt(e,t){var n=e.alternate;return n===null?(n=Ce(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Br(e,t,n,r,o,l){var i=2;if(r=e,typeof e=="function")bi(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case Vt:return zt(n.children,o,l,t);case pi:i=8,o|=8;break;case dl:return e=Ce(12,n,t,o|2),e.elementType=dl,e.lanes=l,e;case fl:return e=Ce(13,n,t,o),e.elementType=fl,e.lanes=l,e;case pl:return e=Ce(19,n,t,o),e.elementType=pl,e.lanes=l,e;case Aa:return Eo(n,o,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Ua:i=10;break e;case Da:i=9;break e;case mi:i=11;break e;case hi:i=14;break e;case Ze:i=16,r=null;break e}throw Error(x(130,e==null?e:typeof e,""))}return t=Ce(i,n,t,o),t.elementType=e,t.type=r,t.lanes=l,t}function zt(e,t,n,r){return e=Ce(7,e,r,t),e.lanes=n,e}function Eo(e,t,n,r){return e=Ce(22,e,r,t),e.elementType=Aa,e.lanes=n,e.stateNode={isHidden:!1},e}function il(e,t,n){return e=Ce(6,e,null,t),e.lanes=n,e}function sl(e,t,n){return t=Ce(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function vp(e,t,n,r,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Bo(0),this.expirationTimes=Bo(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Bo(0),this.identifierPrefix=r,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function Yi(e,t,n,r,o,l,i,s,a){return e=new vp(e,t,n,s,a),t===1?(t=1,l===!0&&(t|=8)):t=0,l=Ce(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ri(l),e}function gp(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Bt,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function zc(e){if(!e)return gt;e=e._reactInternals;e:{if(Ut(e)!==e||e.tag!==1)throw Error(x(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(me(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(x(171))}if(e.tag===1){var n=e.type;if(me(n))return zu(e,n,t)}return t}function Lc(e,t,n,r,o,l,i,s,a){return e=Yi(n,r,!0,e,o,l,i,s,a),e.context=zc(null),n=e.current,r=ae(),o=ft(n),l=Qe(r,o),l.callback=t??null,ct(n,l,o),e.current.lanes=o,lr(e,o,r),he(e,r),e}function No(e,t,n,r){var o=t.current,l=ae(),i=ft(o);return n=zc(n),t.context===null?t.context=n:t.pendingContext=n,t=Qe(l,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=ct(o,t,i),e!==null&&(Oe(e,o,i,l),Ir(e,o,i)),i}function po(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function ca(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Xi(e,t){ca(e,t),(e=e.alternate)&&ca(e,t)}function yp(){return null}var jc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ji(e){this._internalRoot=e}To.prototype.render=Ji.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(x(409));No(e,t,null,null)};To.prototype.unmount=Ji.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;It(function(){No(null,e,null,null)}),t[Ge]=null}};function To(e){this._internalRoot=e}To.prototype.unstable_scheduleHydration=function(e){if(e){var t=uu();e={blockedOn:null,target:e,priority:t};for(var n=0;n<tt.length&&t!==0&&t<tt[n].priority;n++);tt.splice(n,0,e),n===0&&du(e)}};function Zi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Mo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function da(){}function _p(e,t,n,r,o){if(o){if(typeof r=="function"){var l=r;r=function(){var u=po(i);l.call(u)}}var i=Lc(t,r,e,0,null,!1,!1,"",da);return e._reactRootContainer=i,e[Ge]=i.current,Kn(e.nodeType===8?e.parentNode:e),It(),i}for(;o=e.lastChild;)e.removeChild(o);if(typeof r=="function"){var s=r;r=function(){var u=po(a);s.call(u)}}var a=Yi(e,0,!1,null,null,!1,!1,"",da);return e._reactRootContainer=a,e[Ge]=a.current,Kn(e.nodeType===8?e.parentNode:e),It(function(){No(t,a,n,r)}),a}function zo(e,t,n,r,o){var l=n._reactRootContainer;if(l){var i=l;if(typeof o=="function"){var s=o;o=function(){var a=po(i);s.call(a)}}No(t,i,e,o)}else i=_p(n,t,e,o,r);return po(i)}su=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Tn(t.pendingLanes);n!==0&&(yi(t,n|1),he(t,Q()),!(O&6)&&(fn=Q()+500,kt()))}break;case 13:It(function(){var r=be(e,1);if(r!==null){var o=ae();Oe(r,e,1,o)}}),Xi(e,1)}};_i=function(e){if(e.tag===13){var t=be(e,134217728);if(t!==null){var n=ae();Oe(t,e,134217728,n)}Xi(e,134217728)}};au=function(e){if(e.tag===13){var t=ft(e),n=be(e,t);if(n!==null){var r=ae();Oe(n,e,t,r)}Xi(e,t)}};uu=function(){return I};cu=function(e,t){var n=I;try{return I=e,t()}finally{I=n}};Sl=function(e,t,n){switch(t){case"input":if(vl(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=ko(r);if(!o)throw Error(x(90));Ba(r),vl(r,o)}}}break;case"textarea":qa(e,n);break;case"select":t=n.value,t!=null&&Zt(e,!!n.multiple,t,!1)}};Ya=Qi;Xa=It;var kp={usingClientEntryPoint:!1,Events:[sr,Qt,ko,Ga,ba,Qi]},Cn={findFiberByHostInstance:Et,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},wp={bundleType:Cn.bundleType,version:Cn.version,rendererPackageName:Cn.rendererPackageName,rendererConfig:Cn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Xe.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=eu(e),e===null?null:e.stateNode},findFiberByHostInstance:Cn.findFiberByHostInstance||yp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Mr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Mr.isDisabled&&Mr.supportsFiber)try{vo=Mr.inject(wp),Ae=Mr}catch{}}we.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=kp;we.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Zi(t))throw Error(x(200));return gp(e,t,null,n)};we.createRoot=function(e,t){if(!Zi(e))throw Error(x(299));var n=!1,r="",o=jc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=Yi(e,1,!1,null,null,n,!1,r,o),e[Ge]=t.current,Kn(e.nodeType===8?e.parentNode:e),new Ji(t)};we.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(x(188)):(e=Object.keys(e).join(","),Error(x(268,e)));return e=eu(t),e=e===null?null:e.stateNode,e};we.flushSync=function(e){return It(e)};we.hydrate=function(e,t,n){if(!Mo(t))throw Error(x(200));return zo(null,e,t,!0,n)};we.hydrateRoot=function(e,t,n){if(!Zi(e))throw Error(x(405));var r=n!=null&&n.hydratedSources||null,o=!1,l="",i=jc;if(n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=Lc(t,null,e,1,n??null,o,!1,l,i),e[Ge]=t.current,Kn(e),r)for(e=0;e<r.length;e++)n=r[e],o=n._getVersion,o=o(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,o]:t.mutableSourceEagerHydrationData.push(n,o);return new To(t)};we.render=function(e,t,n){if(!Mo(t))throw Error(x(200));return zo(null,e,t,!1,n)};we.unmountComponentAtNode=function(e){if(!Mo(e))throw Error(x(40));return e._reactRootContainer?(It(function(){zo(null,null,e,!1,function(){e._reactRootContainer=null,e[Ge]=null})}),!0):!1};we.unstable_batchedUpdates=Qi;we.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Mo(n))throw Error(x(200));if(e==null||e._reactInternals===void 0)throw Error(x(38));return zo(e,t,n,!1,r)};we.version="18.3.1-next-f1338f8080-20240426";function Rc(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Rc)}catch(e){console.error(e)}}Rc(),Ra.exports=we;var xp=Ra.exports,fa=xp;ul.createRoot=fa.createRoot,ul.hydrateRoot=fa.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function nr(){return nr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},nr.apply(this,arguments)}var lt;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(lt||(lt={}));const pa="popstate";function Sp(e){e===void 0&&(e={});function t(o,l){let{pathname:i="/",search:s="",hash:a=""}=Dt(o.location.hash.substr(1));return!i.startsWith("/")&&!i.startsWith(".")&&(i="/"+i),ni("",{pathname:i,search:s,hash:a},l.state&&l.state.usr||null,l.state&&l.state.key||"default")}function n(o,l){let i=o.document.querySelector("base"),s="";if(i&&i.getAttribute("href")){let a=o.location.href,u=a.indexOf("#");s=u===-1?a:a.slice(0,u)}return s+"#"+(typeof l=="string"?l:mo(l))}function r(o,l){Lo(o.pathname.charAt(0)==="/","relative pathnames are not supported in hash history.push("+JSON.stringify(l)+")")}return Cp(t,n,r,e)}function G(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function Lo(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function Pp(){return Math.random().toString(36).substr(2,8)}function ma(e,t){return{usr:e.state,key:e.key,idx:t}}function ni(e,t,n,r){return n===void 0&&(n=null),nr({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?Dt(t):t,{state:n,key:t&&t.key||r||Pp()})}function mo(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(t+=r.charAt(0)==="#"?r:"#"+r),t}function Dt(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}function Cp(e,t,n,r){r===void 0&&(r={});let{window:o=document.defaultView,v5Compat:l=!1}=r,i=o.history,s=lt.Pop,a=null,u=h();u==null&&(u=0,i.replaceState(nr({},i.state,{idx:u}),""));function h(){return(i.state||{idx:null}).idx}function p(){s=lt.Pop;let P=h(),f=P==null?null:P-u;u=P,a&&a({action:s,location:k.location,delta:f})}function v(P,f){s=lt.Push;let c=ni(k.location,P,f);n&&n(c,P),u=h()+1;let d=ma(c,u),g=k.createHref(c);try{i.pushState(d,"",g)}catch(S){if(S instanceof DOMException&&S.name==="DataCloneError")throw S;o.location.assign(g)}l&&a&&a({action:s,location:k.location,delta:1})}function y(P,f){s=lt.Replace;let c=ni(k.location,P,f);n&&n(c,P),u=h();let d=ma(c,u),g=k.createHref(c);i.replaceState(d,"",g),l&&a&&a({action:s,location:k.location,delta:0})}function _(P){let f=o.location.origin!=="null"?o.location.origin:o.location.href,c=typeof P=="string"?P:mo(P);return c=c.replace(/ $/,"%20"),G(f,"No window.location.(origin|href) available to create URL for href: "+c),new URL(c,f)}let k={get action(){return s},get location(){return e(o,i)},listen(P){if(a)throw new Error("A history only accepts one active listener");return o.addEventListener(pa,p),a=P,()=>{o.removeEventListener(pa,p),a=null}},createHref(P){return t(o,P)},createURL:_,encodeLocation(P){let f=_(P);return{pathname:f.pathname,search:f.search,hash:f.hash}},push:v,replace:y,go(P){return i.go(P)}};return k}var ha;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(ha||(ha={}));function Ep(e,t,n){return n===void 0&&(n="/"),Np(e,t,n)}function Np(e,t,n,r){let o=typeof t=="string"?Dt(t):t,l=es(o.pathname||"/",n);if(l==null)return null;let i=Oc(e);Tp(i);let s=null;for(let a=0;s==null&&a<i.length;++a){let u=Wp(l);s=Up(i[a],u)}return s}function Oc(e,t,n,r){t===void 0&&(t=[]),n===void 0&&(n=[]),r===void 0&&(r="");let o=(l,i,s)=>{let a={relativePath:s===void 0?l.path||"":s,caseSensitive:l.caseSensitive===!0,childrenIndex:i,route:l};a.relativePath.startsWith("/")&&(G(a.relativePath.startsWith(r),'Absolute route path "'+a.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),a.relativePath=a.relativePath.slice(r.length));let u=mt([r,a.relativePath]),h=n.concat(a);l.children&&l.children.length>0&&(G(l.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+u+'".')),Oc(l.children,t,h,u)),!(l.path==null&&!l.index)&&t.push({path:u,score:Ip(u,l.index),routesMeta:h})};return e.forEach((l,i)=>{var s;if(l.path===""||!((s=l.path)!=null&&s.includes("?")))o(l,i);else for(let a of Ic(l.path))o(l,i,a)}),t}function Ic(e){let t=e.split("/");if(t.length===0)return[];let[n,...r]=t,o=n.endsWith("?"),l=n.replace(/\?$/,"");if(r.length===0)return o?[l,""]:[l];let i=Ic(r.join("/")),s=[];return s.push(...i.map(a=>a===""?l:[l,a].join("/"))),o&&s.push(...i),s.map(a=>e.startsWith("/")&&a===""?"/":a)}function Tp(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Fp(t.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const Mp=/^:[\w-]+$/,zp=3,Lp=2,jp=1,Rp=10,Op=-2,va=e=>e==="*";function Ip(e,t){let n=e.split("/"),r=n.length;return n.some(va)&&(r+=Op),t&&(r+=Lp),n.filter(o=>!va(o)).reduce((o,l)=>o+(Mp.test(l)?zp:l===""?jp:Rp),r)}function Fp(e,t){return e.length===t.length&&e.slice(0,-1).every((r,o)=>r===t[o])?e[e.length-1]-t[t.length-1]:0}function Up(e,t,n){let{routesMeta:r}=e,o={},l="/",i=[];for(let s=0;s<r.length;++s){let a=r[s],u=s===r.length-1,h=l==="/"?t:t.slice(l.length)||"/",p=Dp({path:a.relativePath,caseSensitive:a.caseSensitive,end:u},h),v=a.route;if(!p)return null;Object.assign(o,p.params),i.push({params:o,pathname:mt([l,p.pathname]),pathnameBase:Hp(mt([l,p.pathnameBase])),route:v}),p.pathnameBase!=="/"&&(l=mt([l,p.pathnameBase]))}return i}function Dp(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=Ap(e.path,e.caseSensitive,e.end),o=t.match(n);if(!o)return null;let l=o[0],i=l.replace(/(.)\/+$/,"$1"),s=o.slice(1);return{params:r.reduce((u,h,p)=>{let{paramName:v,isOptional:y}=h;if(v==="*"){let k=s[p]||"";i=l.slice(0,l.length-k.length).replace(/(.)\/+$/,"$1")}const _=s[p];return y&&!_?u[v]=void 0:u[v]=(_||"").replace(/%2F/g,"/"),u},{}),pathname:l,pathnameBase:i,pattern:e}}function Ap(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),Lo(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let r=[],o="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(i,s,a)=>(r.push({paramName:s,isOptional:a!=null}),a?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(r.push({paramName:"*"}),o+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?o+="\\/*$":e!==""&&e!=="/"&&(o+="(?:(?=\\/|$))"),[new RegExp(o,t?void 0:"i"),r]}function Wp(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return Lo(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function es(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&r!=="/"?null:e.slice(n)||"/"}const Bp=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Vp=e=>Bp.test(e);function qp(e,t){t===void 0&&(t="/");let{pathname:n,search:r="",hash:o=""}=typeof e=="string"?Dt(e):e,l;if(n)if(Vp(n))l=n;else{if(n.includes("//")){let i=n;n=n.replace(/\/\/+/g,"/"),Lo(!1,"Pathnames cannot have embedded double slashes - normalizing "+(i+" -> "+n))}n.startsWith("/")?l=ga(n.substring(1),"/"):l=ga(n,t)}else l=t;return{pathname:l,search:Qp(r),hash:Kp(o)}}function ga(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(o=>{o===".."?n.length>1&&n.pop():o!=="."&&n.push(o)}),n.length>1?n.join("/"):"/"}function al(e,t,n,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function $p(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function Fc(e,t){let n=$p(e);return t?n.map((r,o)=>o===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function Uc(e,t,n,r){r===void 0&&(r=!1);let o;typeof e=="string"?o=Dt(e):(o=nr({},e),G(!o.pathname||!o.pathname.includes("?"),al("?","pathname","search",o)),G(!o.pathname||!o.pathname.includes("#"),al("#","pathname","hash",o)),G(!o.search||!o.search.includes("#"),al("#","search","hash",o)));let l=e===""||o.pathname==="",i=l?"/":o.pathname,s;if(i==null)s=n;else{let p=t.length-1;if(!r&&i.startsWith("..")){let v=i.split("/");for(;v[0]==="..";)v.shift(),p-=1;o.pathname=v.join("/")}s=p>=0?t[p]:"/"}let a=qp(o,s),u=i&&i!=="/"&&i.endsWith("/"),h=(l||i===".")&&n.endsWith("/");return!a.pathname.endsWith("/")&&(u||h)&&(a.pathname+="/"),a}const mt=e=>e.join("/").replace(/\/\/+/g,"/"),Hp=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Qp=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Kp=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Gp(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const Dc=["post","put","patch","delete"];new Set(Dc);const bp=["get",...Dc];new Set(bp);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function rr(){return rr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},rr.apply(this,arguments)}const ts=w.createContext(null),Yp=w.createContext(null),At=w.createContext(null),jo=w.createContext(null),wt=w.createContext({outlet:null,matches:[],isDataRoute:!1}),Ac=w.createContext(null);function Xp(e,t){let{relative:n}=t===void 0?{}:t;ur()||G(!1);let{basename:r,navigator:o}=w.useContext(At),{hash:l,pathname:i,search:s}=Bc(e,{relative:n}),a=i;return r!=="/"&&(a=i==="/"?r:mt([r,i])),o.createHref({pathname:a,search:s,hash:l})}function ur(){return w.useContext(jo)!=null}function cr(){return ur()||G(!1),w.useContext(jo).location}function Wc(e){w.useContext(At).static||w.useLayoutEffect(e)}function ns(){let{isDataRoute:e}=w.useContext(wt);return e?dm():Jp()}function Jp(){ur()||G(!1);let e=w.useContext(ts),{basename:t,future:n,navigator:r}=w.useContext(At),{matches:o}=w.useContext(wt),{pathname:l}=cr(),i=JSON.stringify(Fc(o,n.v7_relativeSplatPath)),s=w.useRef(!1);return Wc(()=>{s.current=!0}),w.useCallback(function(u,h){if(h===void 0&&(h={}),!s.current)return;if(typeof u=="number"){r.go(u);return}let p=Uc(u,JSON.parse(i),l,h.relative==="path");e==null&&t!=="/"&&(p.pathname=p.pathname==="/"?t:mt([t,p.pathname])),(h.replace?r.replace:r.push)(p,h.state,h)},[t,r,i,l,e])}function Zp(){let{matches:e}=w.useContext(wt),t=e[e.length-1];return t?t.params:{}}function Bc(e,t){let{relative:n}=t===void 0?{}:t,{future:r}=w.useContext(At),{matches:o}=w.useContext(wt),{pathname:l}=cr(),i=JSON.stringify(Fc(o,r.v7_relativeSplatPath));return w.useMemo(()=>Uc(e,JSON.parse(i),l,n==="path"),[e,i,l,n])}function em(e,t){return tm(e,t)}function tm(e,t,n,r){ur()||G(!1);let{navigator:o}=w.useContext(At),{matches:l}=w.useContext(wt),i=l[l.length-1],s=i?i.params:{};i&&i.pathname;let a=i?i.pathnameBase:"/";i&&i.route;let u=cr(),h;if(t){var p;let P=typeof t=="string"?Dt(t):t;a==="/"||(p=P.pathname)!=null&&p.startsWith(a)||G(!1),h=P}else h=u;let v=h.pathname||"/",y=v;if(a!=="/"){let P=a.replace(/^\//,"").split("/");y="/"+v.replace(/^\//,"").split("/").slice(P.length).join("/")}let _=Ep(e,{pathname:y}),k=im(_&&_.map(P=>Object.assign({},P,{params:Object.assign({},s,P.params),pathname:mt([a,o.encodeLocation?o.encodeLocation(P.pathname).pathname:P.pathname]),pathnameBase:P.pathnameBase==="/"?a:mt([a,o.encodeLocation?o.encodeLocation(P.pathnameBase).pathname:P.pathnameBase])})),l,n,r);return t&&k?w.createElement(jo.Provider,{value:{location:rr({pathname:"/",search:"",hash:"",state:null,key:"default"},h),navigationType:lt.Pop}},k):k}function nm(){let e=cm(),t=Gp(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,o={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return w.createElement(w.Fragment,null,w.createElement("h2",null,"Unexpected Application Error!"),w.createElement("h3",{style:{fontStyle:"italic"}},t),n?w.createElement("pre",{style:o},n):null,null)}const rm=w.createElement(nm,null);class om extends w.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?w.createElement(wt.Provider,{value:this.props.routeContext},w.createElement(Ac.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function lm(e){let{routeContext:t,match:n,children:r}=e,o=w.useContext(ts);return o&&o.static&&o.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(o.staticContext._deepestRenderedBoundaryId=n.route.id),w.createElement(wt.Provider,{value:t},r)}function im(e,t,n,r){var o;if(t===void 0&&(t=[]),n===void 0&&(n=null),r===void 0&&(r=null),e==null){var l;if(!n)return null;if(n.errors)e=n.matches;else if((l=r)!=null&&l.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let i=e,s=(o=n)==null?void 0:o.errors;if(s!=null){let h=i.findIndex(p=>p.route.id&&(s==null?void 0:s[p.route.id])!==void 0);h>=0||G(!1),i=i.slice(0,Math.min(i.length,h+1))}let a=!1,u=-1;if(n&&r&&r.v7_partialHydration)for(let h=0;h<i.length;h++){let p=i[h];if((p.route.HydrateFallback||p.route.hydrateFallbackElement)&&(u=h),p.route.id){let{loaderData:v,errors:y}=n,_=p.route.loader&&v[p.route.id]===void 0&&(!y||y[p.route.id]===void 0);if(p.route.lazy||_){a=!0,u>=0?i=i.slice(0,u+1):i=[i[0]];break}}}return i.reduceRight((h,p,v)=>{let y,_=!1,k=null,P=null;n&&(y=s&&p.route.id?s[p.route.id]:void 0,k=p.route.errorElement||rm,a&&(u<0&&v===0?(fm("route-fallback"),_=!0,P=null):u===v&&(_=!0,P=p.route.hydrateFallbackElement||null)));let f=t.concat(i.slice(0,v+1)),c=()=>{let d;return y?d=k:_?d=P:p.route.Component?d=w.createElement(p.route.Component,null):p.route.element?d=p.route.element:d=h,w.createElement(lm,{match:p,routeContext:{outlet:h,matches:f,isDataRoute:n!=null},children:d})};return n&&(p.route.ErrorBoundary||p.route.errorElement||v===0)?w.createElement(om,{location:n.location,revalidation:n.revalidation,component:k,error:y,children:c(),routeContext:{outlet:null,matches:f,isDataRoute:!0}}):c()},null)}var Vc=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(Vc||{}),qc=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(qc||{});function sm(e){let t=w.useContext(ts);return t||G(!1),t}function am(e){let t=w.useContext(Yp);return t||G(!1),t}function um(e){let t=w.useContext(wt);return t||G(!1),t}function $c(e){let t=um(),n=t.matches[t.matches.length-1];return n.route.id||G(!1),n.route.id}function cm(){var e;let t=w.useContext(Ac),n=am(),r=$c();return t!==void 0?t:(e=n.errors)==null?void 0:e[r]}function dm(){let{router:e}=sm(Vc.UseNavigateStable),t=$c(qc.UseNavigateStable),n=w.useRef(!1);return Wc(()=>{n.current=!0}),w.useCallback(function(o,l){l===void 0&&(l={}),n.current&&(typeof o=="number"?e.navigate(o):e.navigate(o,rr({fromRouteId:t},l)))},[e,t])}const ya={};function fm(e,t,n){ya[e]||(ya[e]=!0)}function pm(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function Vr(e){G(!1)}function mm(e){let{basename:t="/",children:n=null,location:r,navigationType:o=lt.Pop,navigator:l,static:i=!1,future:s}=e;ur()&&G(!1);let a=t.replace(/^\/*/,"/"),u=w.useMemo(()=>({basename:a,navigator:l,static:i,future:rr({v7_relativeSplatPath:!1},s)}),[a,s,l,i]);typeof r=="string"&&(r=Dt(r));let{pathname:h="/",search:p="",hash:v="",state:y=null,key:_="default"}=r,k=w.useMemo(()=>{let P=es(h,a);return P==null?null:{location:{pathname:P,search:p,hash:v,state:y,key:_},navigationType:o}},[a,h,p,v,y,_,o]);return k==null?null:w.createElement(At.Provider,{value:u},w.createElement(jo.Provider,{children:n,value:k}))}function hm(e){let{children:t,location:n}=e;return em(ri(t),n)}new Promise(()=>{});function ri(e,t){t===void 0&&(t=[]);let n=[];return w.Children.forEach(e,(r,o)=>{if(!w.isValidElement(r))return;let l=[...t,o];if(r.type===w.Fragment){n.push.apply(n,ri(r.props.children,l));return}r.type!==Vr&&G(!1),!r.props.index||!r.props.children||G(!1);let i={id:r.props.id||l.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(i.children=ri(r.props.children,l)),n.push(i)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function oi(){return oi=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},oi.apply(this,arguments)}function vm(e,t){if(e==null)return{};var n={},r=Object.keys(e),o,l;for(l=0;l<r.length;l++)o=r[l],!(t.indexOf(o)>=0)&&(n[o]=e[o]);return n}function gm(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function ym(e,t){return e.button===0&&(!t||t==="_self")&&!gm(e)}const _m=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],km="6";try{window.__reactRouterVersion=km}catch{}const wm="startTransition",_a=cd[wm];function xm(e){let{basename:t,children:n,future:r,window:o}=e,l=w.useRef();l.current==null&&(l.current=Sp({window:o,v5Compat:!0}));let i=l.current,[s,a]=w.useState({action:i.action,location:i.location}),{v7_startTransition:u}=r||{},h=w.useCallback(p=>{u&&_a?_a(()=>a(p)):a(p)},[a,u]);return w.useLayoutEffect(()=>i.listen(h),[i,h]),w.useEffect(()=>pm(r),[r]),w.createElement(mm,{basename:t,children:n,location:s.location,navigationType:s.action,navigator:i,future:r})}const Sm=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",Pm=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,ht=w.forwardRef(function(t,n){let{onClick:r,relative:o,reloadDocument:l,replace:i,state:s,target:a,to:u,preventScrollReset:h,viewTransition:p}=t,v=vm(t,_m),{basename:y}=w.useContext(At),_,k=!1;if(typeof u=="string"&&Pm.test(u)&&(_=u,Sm))try{let d=new URL(window.location.href),g=u.startsWith("//")?new URL(d.protocol+u):new URL(u),S=es(g.pathname,y);g.origin===d.origin&&S!=null?u=S+g.search+g.hash:k=!0}catch{}let P=Xp(u,{relative:o}),f=Cm(u,{replace:i,state:s,target:a,preventScrollReset:h,relative:o,viewTransition:p});function c(d){r&&r(d),d.defaultPrevented||f(d)}return w.createElement("a",oi({},v,{href:_||P,onClick:k||l?r:c,ref:n,target:a}))});var ka;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(ka||(ka={}));var wa;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(wa||(wa={}));function Cm(e,t){let{target:n,replace:r,state:o,preventScrollReset:l,relative:i,viewTransition:s}=t===void 0?{}:t,a=ns(),u=cr(),h=Bc(e,{relative:i});return w.useCallback(p=>{if(ym(p,n)){p.preventDefault();let v=r!==void 0?r:mo(u)===mo(h);a(e,{replace:v,state:o,preventScrollReset:l,relative:i,viewTransition:s})}},[u,a,h,r,o,n,e,l,i,s])}const Be=[{id:"tensors-basics",title:"1. Tensors & PyTorch Basics",description:"Tensors, operations, GPU/MPS devices, autograd fundamentals",sections:[{title:"What is a Tensor?",content:`A tensor is the fundamental data structure in PyTorch — a multi-dimensional array optimized for numerical computation and automatic differentiation.

Think of it as a generalization:
- **Scalar** → 0D tensor (a single number)
- **Vector** → 1D tensor
- **Matrix** → 2D tensor
- **3D+ arrays** → higher-dimensional tensors

Every neural network operation in PyTorch operates on tensors.`,code:`import torch

# Creating tensors
scalar = torch.tensor(3.14)          # 0D
vector = torch.tensor([1, 2, 3])     # 1D
matrix = torch.tensor([[1, 2], [3, 4]])  # 2D
cube = torch.randn(2, 3, 4)         # 3D random

print(f"Scalar shape: {scalar.shape}")   # torch.Size([])
print(f"Vector shape: {vector.shape}")   # torch.Size([3])
print(f"Matrix shape: {matrix.shape}")   # torch.Size([2, 2])
print(f"Cube shape: {cube.shape}")       # torch.Size([2, 3, 4])

# Key attributes
print(f"dtype: {matrix.dtype}")    # torch.int64
print(f"device: {matrix.device}")  # cpu
print(f"requires_grad: {matrix.requires_grad}")  # False`},{title:"Device Management & MPS",content:`PyTorch supports three device types: CPU, CUDA (NVIDIA GPUs), and **MPS** (Apple Metal Performance Shaders).

MPS uses Apple's Metal framework to accelerate tensor operations on M-series chips. It's not feature-complete compared to CUDA, but covers the most common operations.

**Key things to know about MPS:**
- Available on macOS 12.3+ with M1/M2/M3/M4 chips
- Some ops fall back to CPU silently — watch for this
- Use \`PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0\` to debug memory issues
- Not all dtypes are supported (e.g., float64 ops may fail)`,code:`import torch

# Check MPS availability
print(f"MPS available: {torch.backends.mps.is_available()}")
print(f"MPS built: {torch.backends.mps.is_built()}")

# Device selection pattern
def get_device():
    if torch.backends.mps.is_available():
        return torch.device("mps")
    elif torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")

device = get_device()
print(f"Using device: {device}")

# Moving tensors to MPS
x = torch.randn(3, 3)
x_mps = x.to(device)
print(f"Tensor device: {x_mps.device}")  # mps:0

# Operations on MPS
y_mps = torch.randn(3, 3, device=device)
z = x_mps @ y_mps  # matrix multiply on MPS
print(f"Result device: {z.device}")  # mps:0

# Gotcha: some ops need CPU fallback
# If you get "not implemented for MPS", move to CPU:
# result = some_op(tensor.cpu()).to(device)`},{title:"Autograd: Automatic Differentiation",content:"Autograd is PyTorch's engine for computing gradients automatically. When you set `requires_grad=True` on a tensor, PyTorch tracks every operation on it, building a **computational graph**. When you call `.backward()`, it computes gradients via the chain rule.\n\nThis is the foundation of all neural network training — without autograd, you'd need to derive and code every gradient by hand.\n\n**How the computation graph works:**\n1. Forward pass: operations are recorded\n2. Each tensor has a `.grad_fn` pointing to the operation that created it\n3. `.backward()` traverses this graph in reverse\n4. Gradients accumulate in `.grad` attributes",code:`import torch

# Simple gradient computation
x = torch.tensor(3.0, requires_grad=True)
y = x ** 2 + 2 * x + 1  # y = x² + 2x + 1

y.backward()  # dy/dx = 2x + 2 = 8 at x=3
print(f"dy/dx at x=3: {x.grad}")  # tensor(8.)

# Computation graph inspection
a = torch.tensor(2.0, requires_grad=True)
b = torch.tensor(3.0, requires_grad=True)
c = a * b        # c = a*b
d = c + a        # d = a*b + a
d.backward()

print(f"dd/da: {a.grad}")  # b + 1 = 4.0
print(f"dd/db: {b.grad}")  # a = 2.0
print(f"c.grad_fn: {c.grad_fn}")  # MulBackward0

# IMPORTANT: gradients accumulate!
x = torch.tensor(1.0, requires_grad=True)
for i in range(3):
    y = x * 2
    y.backward()
    print(f"Step {i}: grad = {x.grad}")  # 2, 4, 6 (accumulating!)

# Always zero gradients before new computation:
x.grad.zero_()
y = x * 2
y.backward()
print(f"After zero: {x.grad}")  # 2.0`}],quiz:[{question:"What does `requires_grad=True` do on a tensor?",options:["Makes the tensor immutable","Tells PyTorch to track operations for automatic differentiation","Moves the tensor to GPU","Enables batch processing"],correct:1,explanation:"Setting requires_grad=True tells autograd to record operations on this tensor so gradients can be computed via .backward()."},{question:"What happens if you call .backward() multiple times without zeroing gradients?",options:["The gradients are overwritten each time","An error is thrown","Gradients accumulate (are added together)","Only the last gradient is kept"],correct:2,explanation:"PyTorch accumulates gradients by default. This is actually useful for certain algorithms, but usually you want optimizer.zero_grad() before each training step."},{question:"Which device string do you use for Apple Silicon GPU acceleration in PyTorch?",options:['"cuda"','"metal"','"mps"','"apple-gpu"'],correct:2,explanation:'MPS stands for Metal Performance Shaders. Use torch.device("mps") to leverage Apple Silicon GPUs.'},{question:"What is a common gotcha with MPS in PyTorch?",options:["It requires NVIDIA drivers","Some operations are not implemented and need CPU fallback","It only works with integer tensors","It cannot do matrix multiplication"],correct:1,explanation:`MPS doesn't support all PyTorch operations yet. When you hit "not implemented for MPS", you need to move the tensor to CPU for that op, then back.`}],exercise:{title:"Tensor Operations on MPS",description:`Write a function that:
1. Creates two random 4x4 matrices on the best available device (MPS > CUDA > CPU)
2. Performs matrix multiplication
3. Computes the mean of the result
4. Returns the gradient of the mean with respect to one of the input matrices

Hint: you'll need requires_grad=True on at least one input.`,starterCode:`import torch

def tensor_exercise():
    # Step 1: Get the best available device
    device = ???

    # Step 2: Create two 4x4 random tensors on that device
    # Make 'a' track gradients
    a = ???
    b = ???

    # Step 3: Matrix multiply and compute mean
    result = ???
    mean_val = ???

    # Step 4: Compute gradients
    ???

    return {
        'device': str(device),
        'result_shape': result.shape,
        'mean': mean_val.item(),
        'grad_shape': a.grad.shape,
        'grad': a.grad
    }`,solution:`import torch

def tensor_exercise():
    # Step 1: Get the best available device
    if torch.backends.mps.is_available():
        device = torch.device("mps")
    elif torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")

    # Step 2: Create tensors with grad tracking
    a = torch.randn(4, 4, device=device, requires_grad=True)
    b = torch.randn(4, 4, device=device)

    # Step 3: Matrix multiply and mean
    result = a @ b
    mean_val = result.mean()

    # Step 4: Backprop
    mean_val.backward()

    return {
        'device': str(device),
        'result_shape': result.shape,
        'mean': mean_val.item(),
        'grad_shape': a.grad.shape,
        'grad': a.grad
    }`}},{id:"forward-backward",title:"2. Forward & Backward Pass",description:"Neural network training loop, loss functions, backpropagation in depth",sections:[{title:"The Forward Pass",content:`The **forward pass** is when data flows through the network from input to output. Each layer applies a transformation: linear projection, activation function, normalization, etc.

In PyTorch, you define the forward pass by implementing the \`forward()\` method in your \`nn.Module\`. When you call the model like a function, PyTorch calls \`forward()\` internally.

**What happens during forward:**
1. Input tensor enters the first layer
2. Each layer computes: output = activation(weight @ input + bias)
3. PyTorch records every operation in the computation graph
4. The final output is compared to the target using a loss function`,code:`import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.layer1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        # Each step is recorded in the computation graph
        h = self.layer1(x)    # Linear: W₁x + b₁
        h = self.relu(h)      # Non-linearity
        out = self.layer2(h)  # Linear: W₂h + b₂
        return out

# Forward pass in action
model = SimpleNet(10, 32, 1)
x = torch.randn(4, 10)  # batch of 4, 10 features each

output = model(x)  # This calls model.forward(x)
print(f"Output shape: {output.shape}")  # [4, 1]

# Inspect the computation graph
print(f"output.grad_fn: {output.grad_fn}")
# AddmmBackward0 — the last linear layer's matmul+add`},{title:"The Backward Pass (Backpropagation)",content:`The **backward pass** computes gradients of the loss with respect to every parameter. This is backpropagation — applying the chain rule from the loss back through every layer.

**Chain rule recap:**
If loss = f(g(h(x))), then:
d(loss)/dx = f'(g(h(x))) · g'(h(x)) · h'(x)

PyTorch does this automatically by traversing the computation graph in reverse.

**What happens during backward:**
1. \`loss.backward()\` is called
2. Gradient flows from loss → last layer → ... → first layer
3. Each parameter's \`.grad\` is populated
4. The optimizer then uses these gradients to update weights`,code:`import torch
import torch.nn as nn

model = SimpleNet(10, 32, 1)
criterion = nn.MSELoss()

# Sample data
x = torch.randn(4, 10)
target = torch.randn(4, 1)

# --- Forward pass ---
output = model(x)
loss = criterion(output, target)
print(f"Loss: {loss.item():.4f}")

# Check: no gradients yet
print(f"layer1.weight.grad before backward: {model.layer1.weight.grad}")
# None

# --- Backward pass ---
loss.backward()

# Now gradients exist
print(f"layer1.weight.grad shape: {model.layer1.weight.grad.shape}")
# [32, 10] — same shape as the weight matrix
print(f"layer1.bias.grad shape: {model.layer1.bias.grad.shape}")
# [32]
print(f"layer2.weight.grad shape: {model.layer2.weight.grad.shape}")
# [1, 32]

# The gradient tells us: if we nudge this weight slightly,
# how much does the loss change?
print(f"Max gradient magnitude: {model.layer1.weight.grad.abs().max():.4f}")`},{title:"The Full Training Loop",content:`Now let's put it together into a complete training loop. This is the pattern you'll use for everything from simple regression to training LLMs.

**The training loop pattern:**
1. Zero gradients (\`optimizer.zero_grad()\`)
2. Forward pass (compute predictions)
3. Compute loss
4. Backward pass (\`loss.backward()\`)
5. Update weights (\`optimizer.step()\`)
6. Repeat

**Why zero gradients first?** Because PyTorch accumulates gradients. Without zeroing, gradients from the previous step add to the current ones.`,code:`import torch
import torch.nn as nn
import torch.optim as optim

# Setup
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
model = SimpleNet(10, 32, 1).to(device)
optimizer = optim.Adam(model.parameters(), lr=0.001)
criterion = nn.MSELoss()

# Fake dataset
X = torch.randn(100, 10, device=device)
Y = torch.randn(100, 1, device=device)

# Training loop
for epoch in range(100):
    # 1. Zero gradients
    optimizer.zero_grad()

    # 2. Forward pass
    predictions = model(X)

    # 3. Compute loss
    loss = criterion(predictions, Y)

    # 4. Backward pass
    loss.backward()

    # 5. Update weights
    optimizer.step()

    if epoch % 20 == 0:
        print(f"Epoch {epoch:3d} | Loss: {loss.item():.4f}")

# After training, inspect what changed
print(f"\\nFinal loss: {loss.item():.4f}")
for name, param in model.named_parameters():
    print(f"{name}: mean={param.data.mean():.4f}, grad_mean={param.grad.mean():.4f}")`}],quiz:[{question:"In what order do the training loop steps happen?",options:["backward → forward → zero_grad → step","forward → backward → step → zero_grad","zero_grad → forward → loss → backward → step","forward → zero_grad → backward → step"],correct:2,explanation:"You zero gradients first (to clear accumulated grads), then forward pass to get predictions, compute loss, backward to get gradients, then optimizer.step() to update weights."},{question:"What does optimizer.step() do?",options:["Computes the gradients","Runs the forward pass","Updates model parameters using the computed gradients","Zeros out the gradients"],correct:2,explanation:"optimizer.step() updates each parameter based on its .grad and the optimizer's algorithm (SGD, Adam, etc.)."},{question:"Why does calling loss.backward() populate gradients on model parameters?",options:["The loss function stores the parameters directly","The computation graph connects the loss back to all parameters via the chain rule","PyTorch iterates over model.parameters() separately","The optimizer tells backward which parameters to compute gradients for"],correct:1,explanation:"The computation graph (built during forward pass) links the loss to every operation and parameter. backward() traverses this graph applying the chain rule."}],exercise:{title:"Train a Model on Synthetic Data",description:`Create a network that learns the function y = 2x₁ - 3x₂ + 1 (2 inputs, 1 output).

1. Generate 200 training samples from this function (add small noise)
2. Define a model with one hidden layer (2 → 16 → 1)
3. Train for 500 epochs on MPS/CPU
4. Print the learned weights — they should approximate [2, -3] and bias ≈ 1`,starterCode:`import torch
import torch.nn as nn
import torch.optim as optim

# Generate synthetic data: y = 2*x1 - 3*x2 + 1
torch.manual_seed(42)
X = torch.randn(200, 2)
Y = ???  # compute true Y with small noise

# Define model
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        ???

    def forward(self, x):
        ???

# Setup training
device = ???
model = ???
optimizer = ???
criterion = ???

# Train
for epoch in range(500):
    ???

# Check learned function
print("Learned approximation of y = 2*x1 - 3*x2 + 1")`,solution:`import torch
import torch.nn as nn
import torch.optim as optim

# Generate synthetic data: y = 2*x1 - 3*x2 + 1
torch.manual_seed(42)
X = torch.randn(200, 2)
Y = 2 * X[:, 0:1] - 3 * X[:, 1:2] + 1 + 0.1 * torch.randn(200, 1)

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(2, 16),
            nn.ReLU(),
            nn.Linear(16, 1)
        )

    def forward(self, x):
        return self.net(x)

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
model = Net().to(device)
X_d, Y_d = X.to(device), Y.to(device)
optimizer = optim.Adam(model.parameters(), lr=0.01)
criterion = nn.MSELoss()

for epoch in range(500):
    optimizer.zero_grad()
    pred = model(X_d)
    loss = criterion(pred, Y_d)
    loss.backward()
    optimizer.step()

    if epoch % 100 == 0:
        print(f"Epoch {epoch}: loss = {loss.item():.6f}")

print(f"\\nFinal loss: {loss.item():.6f}")
print("Model should approximate y = 2*x1 - 3*x2 + 1")`}},{id:"attention-transformers",title:"3. Attention & Transformer Architecture",description:"Self-attention, multi-head attention, the full transformer block",sections:[{title:"Self-Attention from Scratch",content:`**Self-attention** is the core mechanism of transformers. It allows each token in a sequence to "look at" every other token and decide how much to attend to each one.

**The Q, K, V pattern:**
- **Query (Q):** "What am I looking for?"
- **Key (K):** "What do I contain?"
- **Value (V):** "What information do I provide?"

Attention(Q, K, V) = softmax(QKᵀ / √d_k) · V

The division by √d_k prevents the dot products from getting too large (which would make softmax output near-one-hot vectors, killing gradients).`,code:`import torch
import torch.nn.functional as F
import math

def self_attention(x, d_model):
    """
    x: (batch, seq_len, d_model)
    Returns: (batch, seq_len, d_model)
    """
    batch, seq_len, _ = x.shape

    # Project to Q, K, V
    W_q = torch.randn(d_model, d_model) * 0.02
    W_k = torch.randn(d_model, d_model) * 0.02
    W_v = torch.randn(d_model, d_model) * 0.02

    Q = x @ W_q  # (batch, seq_len, d_model)
    K = x @ W_k
    V = x @ W_v

    # Compute attention scores
    scores = Q @ K.transpose(-2, -1)  # (batch, seq_len, seq_len)
    scores = scores / math.sqrt(d_model)

    # Softmax to get attention weights
    attn_weights = F.softmax(scores, dim=-1)
    # attn_weights[i][j] = how much token i attends to token j

    # Weighted sum of values
    output = attn_weights @ V  # (batch, seq_len, d_model)

    return output, attn_weights

# Demo
x = torch.randn(1, 4, 8)  # 1 batch, 4 tokens, 8-dim embeddings
out, weights = self_attention(x, 8)
print(f"Output shape: {out.shape}")      # [1, 4, 8]
print(f"Attention weights shape: {weights.shape}")  # [1, 4, 4]
print(f"Attention weights (token 0 attending to all):")
print(weights[0, 0])  # Sums to 1.0`},{title:"Multi-Head Attention",content:`**Multi-head attention** runs several attention computations in parallel, each with its own learned projections. This lets the model attend to information from different representation subspaces at different positions.

Instead of one attention with d_model dimensions, we use h heads, each with d_k = d_model/h dimensions. The outputs are concatenated and projected.

MultiHead(Q, K, V) = Concat(head₁, ..., headₕ) · W_O

This is what PyTorch's \`nn.MultiheadAttention\` implements, but understanding the internals is crucial for LLM work.`,code:`import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        assert d_model % n_heads == 0
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads

        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        batch, seq_len, _ = x.shape

        # Project and reshape to (batch, n_heads, seq_len, d_k)
        Q = self.W_q(x).view(batch, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(x).view(batch, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(batch, seq_len, self.n_heads, self.d_k).transpose(1, 2)

        # Scaled dot-product attention
        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.d_k)

        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))

        attn = torch.softmax(scores, dim=-1)
        context = attn @ V  # (batch, n_heads, seq_len, d_k)

        # Concat heads and project
        context = context.transpose(1, 2).contiguous().view(batch, seq_len, self.d_model)
        output = self.W_o(context)
        return output

# Usage
mha = MultiHeadAttention(d_model=64, n_heads=8)
x = torch.randn(2, 10, 64)  # batch=2, seq=10, dim=64
out = mha(x)
print(f"Output shape: {out.shape}")  # [2, 10, 64]`},{title:"The Transformer Block",content:`A **transformer block** combines multi-head attention with a feed-forward network, using residual connections and layer normalization.

The pattern is:
1. LayerNorm → Multi-Head Attention → Residual Add
2. LayerNorm → Feed-Forward Network → Residual Add

Modern LLMs (GPT, Llama) use **Pre-Norm** (LayerNorm before attention/FFN) rather than Post-Norm (the original paper's approach). Pre-Norm is more stable for training deep models.

The feed-forward network is usually: Linear → GELU/SiLU → Linear, expanding the dimension by 4x then projecting back.`,code:`import torch
import torch.nn as nn

class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, d_ff=None, dropout=0.1):
        super().__init__()
        d_ff = d_ff or 4 * d_model

        # Pre-norm attention
        self.norm1 = nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, n_heads)
        self.dropout1 = nn.Dropout(dropout)

        # Pre-norm feed-forward
        self.norm2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout)
        )

    def forward(self, x, mask=None):
        # Attention with residual
        normed = self.norm1(x)
        attn_out = self.attn(normed, mask)
        x = x + self.dropout1(attn_out)

        # FFN with residual
        normed = self.norm2(x)
        ffn_out = self.ffn(normed)
        x = x + ffn_out

        return x

# Stack multiple blocks = a transformer
class MiniTransformer(nn.Module):
    def __init__(self, d_model, n_heads, n_layers, vocab_size, max_seq_len):
        super().__init__()
        self.token_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(max_seq_len, d_model)
        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, n_heads)
            for _ in range(n_layers)
        ])
        self.norm = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size)

    def forward(self, tokens):
        batch, seq_len = tokens.shape
        positions = torch.arange(seq_len, device=tokens.device)

        x = self.token_emb(tokens) + self.pos_emb(positions)
        for block in self.blocks:
            x = block(x)
        x = self.norm(x)
        logits = self.head(x)  # (batch, seq_len, vocab_size)
        return logits

# Create a small model
model = MiniTransformer(
    d_model=64, n_heads=4, n_layers=2,
    vocab_size=1000, max_seq_len=128
)
tokens = torch.randint(0, 1000, (2, 20))
logits = model(tokens)
print(f"Logits shape: {logits.shape}")  # [2, 20, 1000]
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")`}],quiz:[{question:"Why divide attention scores by √d_k?",options:["To make the model faster","To reduce memory usage","To prevent dot products from being too large, which would make softmax near-one-hot","It's just a convention with no real effect"],correct:2,explanation:"When d_k is large, dot products can be very large, pushing softmax to extreme values. This kills gradients. Dividing by √d_k keeps the variance at 1."},{question:"What is the purpose of the residual connection (x + attn_out)?",options:["It makes the model bigger","It allows gradients to flow directly through, preventing vanishing gradients in deep networks","It doubles the output dimension","It's needed for MPS compatibility"],correct:1,explanation:'Residual connections give gradients a "highway" to flow back through during backprop, making it possible to train very deep networks.'},{question:"In multi-head attention with d_model=512 and 8 heads, what is d_k per head?",options:["512","64","8","4096"],correct:1,explanation:"d_k = d_model / n_heads = 512 / 8 = 64. Each head operates on a 64-dimensional subspace."}],exercise:{title:"Implement Causal (Masked) Self-Attention",description:`For language modeling (predicting next token), we need **causal masking** — token i can only attend to tokens 0..i, not future tokens.

Implement causal self-attention by creating a triangular mask and applying it before softmax. Fill masked positions with -inf so softmax gives them 0 weight.`,starterCode:`import torch
import torch.nn.functional as F
import math

def causal_self_attention(x, W_q, W_k, W_v):
    """
    x: (batch, seq_len, d_model)
    Returns output and attention weights
    """
    batch, seq_len, d_model = x.shape

    Q = x @ W_q
    K = x @ W_k
    V = x @ W_v

    scores = Q @ K.transpose(-2, -1) / math.sqrt(d_model)

    # TODO: Create a causal mask (lower triangular)
    # and apply it to scores before softmax
    mask = ???
    scores = ???

    attn = F.softmax(scores, dim=-1)
    output = attn @ V

    return output, attn`,solution:`import torch
import torch.nn.functional as F
import math

def causal_self_attention(x, W_q, W_k, W_v):
    batch, seq_len, d_model = x.shape

    Q = x @ W_q
    K = x @ W_k
    V = x @ W_v

    scores = Q @ K.transpose(-2, -1) / math.sqrt(d_model)

    # Causal mask: lower triangular = 1, upper = 0
    mask = torch.tril(torch.ones(seq_len, seq_len, device=x.device))
    # Fill masked positions with -inf
    scores = scores.masked_fill(mask == 0, float('-inf'))

    attn = F.softmax(scores, dim=-1)
    output = attn @ V

    return output, attn`}},{id:"llm-architecture",title:"4. LLM Architecture Deep Dive",description:"GPT architecture, tokenization, positional encoding, KV cache",sections:[{title:"GPT Architecture Overview",content:`A GPT (Generative Pre-trained Transformer) is a **decoder-only** transformer. Unlike the original encoder-decoder transformer, GPT uses only the decoder stack with causal masking.

**Key components:**
1. **Token Embedding:** Maps token IDs to dense vectors
2. **Positional Encoding:** Adds position information (learned or RoPE)
3. **N Transformer Blocks:** Each with causal attention + FFN
4. **Final LayerNorm + Linear Head:** Projects to vocabulary logits

Modern LLMs like Llama add improvements:
- **RoPE** (Rotary Position Embedding) instead of learned positions
- **SwiGLU** activation instead of GELU in FFN
- **RMSNorm** instead of LayerNorm (faster, no centering)
- **Grouped Query Attention** (GQA) to reduce KV cache memory`,code:`import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class RMSNorm(nn.Module):
    """Root Mean Square Layer Normalization (used in Llama)"""
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x):
        rms = torch.sqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)
        return x / rms * self.weight

class SwiGLU(nn.Module):
    """SwiGLU activation (used in Llama, PaLM)"""
    def __init__(self, d_model, d_ff):
        super().__init__()
        self.w1 = nn.Linear(d_model, d_ff, bias=False)
        self.w2 = nn.Linear(d_ff, d_model, bias=False)
        self.w3 = nn.Linear(d_model, d_ff, bias=False)

    def forward(self, x):
        return self.w2(F.silu(self.w1(x)) * self.w3(x))

# Compare parameter counts
d = 512
print(f"Standard FFN params: {2 * d * 4*d:,}")
print(f"SwiGLU FFN params:   {3 * d * 4*d:,}")
# SwiGLU has 50% more params but performs better`},{title:"Tokenization",content:`Before text enters the model, it must be converted to token IDs. Modern LLMs use **subword tokenization** — breaking words into frequently-occurring pieces.

**BPE (Byte Pair Encoding):**
1. Start with individual characters
2. Find the most frequent pair, merge it into a new token
3. Repeat until vocabulary size is reached

This means common words like "the" are one token, while rare words like "defenestration" might be ["def", "en", "est", "ration"].

**Why it matters for LLMs:**
- Vocabulary size directly affects embedding table size
- Token count affects memory and compute (attention is O(n²))
- Tokenization affects what the model can "see" — it thinks in tokens, not characters`,code:`# Using tiktoken (OpenAI's tokenizer) as an example
# pip install tiktoken
# import tiktoken
# enc = tiktoken.get_encoding("cl100k_base")

# Simple BPE-like tokenizer from scratch
class SimpleBPE:
    def __init__(self, vocab_size=256 + 50):
        self.vocab_size = vocab_size
        self.merges = {}
        self.vocab = {i: bytes([i]) for i in range(256)}

    def train(self, text, num_merges=50):
        """Train BPE on text"""
        tokens = list(text.encode('utf-8'))

        for i in range(num_merges):
            # Count pairs
            pairs = {}
            for j in range(len(tokens) - 1):
                pair = (tokens[j], tokens[j+1])
                pairs[pair] = pairs.get(pair, 0) + 1

            if not pairs:
                break

            # Merge most frequent pair
            best = max(pairs, key=pairs.get)
            new_token = 256 + i
            self.merges[best] = new_token
            self.vocab[new_token] = self.vocab[best[0]] + self.vocab[best[1]]

            # Replace in tokens
            new_tokens = []
            j = 0
            while j < len(tokens):
                if j < len(tokens) - 1 and (tokens[j], tokens[j+1]) == best:
                    new_tokens.append(new_token)
                    j += 2
                else:
                    new_tokens.append(tokens[j])
                    j += 1
            tokens = new_tokens

            print(f"Merge {i}: {best} -> {new_token} "
                  f"({self.vocab[new_token]!r}), tokens: {len(tokens)}")

        return tokens

bpe = SimpleBPE()
text = "the cat sat on the mat the cat"
tokens = bpe.train(text, num_merges=10)
print(f"\\nOriginal length: {len(text.encode('utf-8'))}")
print(f"After BPE: {len(tokens)} tokens")`},{title:"KV Cache and Inference",content:`During **inference** (text generation), the model generates one token at a time. Without optimization, generating token N requires recomputing attention for all N tokens — O(N²) per token, O(N³) total.

The **KV cache** eliminates this redundancy. Since previous tokens' K and V values don't change (causal masking means they can't see future tokens), we cache them and only compute Q for the new token.

**Without KV cache:** Each new token recomputes all Q, K, V
**With KV cache:** Each new token computes 1 Q, appends 1 K and 1 V to cache

This brings per-token cost from O(N·d²) to O(d²), a massive speedup.

**The tradeoff:** KV cache uses memory proportional to batch_size × n_layers × 2 × seq_len × d_model. For long sequences, this dominates memory usage.`,code:`import torch
import torch.nn as nn
import math

class CachedAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        self.W_q = nn.Linear(d_model, d_model, bias=False)
        self.W_k = nn.Linear(d_model, d_model, bias=False)
        self.W_v = nn.Linear(d_model, d_model, bias=False)
        self.W_o = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x, kv_cache=None):
        """
        x: (batch, seq_len, d_model) — during prefill
           (batch, 1, d_model)       — during generation
        kv_cache: tuple of (cached_k, cached_v) or None
        """
        batch, seq_len, _ = x.shape

        Q = self.W_q(x).view(batch, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(x).view(batch, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(batch, seq_len, self.n_heads, self.d_k).transpose(1, 2)

        # Append to KV cache
        if kv_cache is not None:
            K = torch.cat([kv_cache[0], K], dim=2)
            V = torch.cat([kv_cache[1], V], dim=2)

        new_cache = (K, V)

        # Attention (Q might be 1 token, K/V are full sequence)
        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.d_k)

        # Causal mask
        total_len = K.shape[2]
        mask = torch.tril(torch.ones(seq_len, total_len, device=x.device))
        # Offset mask for cached positions
        if kv_cache is not None:
            mask = torch.ones(seq_len, total_len, device=x.device)
            mask = torch.tril(mask, diagonal=total_len - seq_len)
        scores = scores.masked_fill(mask.unsqueeze(0).unsqueeze(0) == 0, float('-inf'))

        attn = torch.softmax(scores, dim=-1)
        out = (attn @ V).transpose(1, 2).contiguous().view(batch, seq_len, -1)
        return self.W_o(out), new_cache

# Demo: generation with KV cache
attn = CachedAttention(64, 4)
prompt = torch.randn(1, 5, 64)  # 5-token prompt

# Prefill: process entire prompt
out, cache = attn(prompt)
print(f"Prefill output: {out.shape}")  # [1, 5, 64]
print(f"Cache K shape: {cache[0].shape}")  # [1, 4, 5, 16]

# Generate: one token at a time
new_token = torch.randn(1, 1, 64)
out, cache = attn(new_token, kv_cache=cache)
print(f"Gen step output: {out.shape}")   # [1, 1, 64]
print(f"Cache K shape: {cache[0].shape}")  # [1, 4, 6, 16] — grew by 1`}],quiz:[{question:"What is the main benefit of the KV cache during inference?",options:["Reduces model size","Avoids recomputing K and V for previously generated tokens","Improves training speed","Allows larger batch sizes"],correct:1,explanation:"Since previous tokens' K and V don't change (causal masking), we cache them. Each new token only needs to compute its own Q, K, V and attend to the full cached sequence."},{question:"Why do modern LLMs use RMSNorm instead of LayerNorm?",options:["RMSNorm is more accurate","RMSNorm skips the mean-centering step, making it faster with similar performance","RMSNorm uses less memory","LayerNorm doesn't work on MPS"],correct:1,explanation:"RMSNorm only normalizes by the root mean square, skipping the mean subtraction of LayerNorm. This is faster and works equally well in practice."},{question:"In BPE tokenization, how are rare/unknown words handled?",options:["They are replaced with [UNK]","They are skipped entirely","They are broken into smaller known subword pieces","They are mapped to the nearest common word"],correct:2,explanation:"BPE breaks words into subword units. Even a completely new word can be represented as a sequence of character-level or common subword tokens."}],exercise:{title:"Build a Complete GPT-style Model",description:`Combine everything you've learned to build a complete GPT-style language model:
1. Token + positional embeddings
2. N transformer blocks with causal attention
3. RMSNorm + linear head
4. A generate() method with KV cache

Make it small enough to run on MPS (d_model=128, 4 heads, 4 layers, vocab=500).`,starterCode:`import torch
import torch.nn as nn

class MiniGPT(nn.Module):
    def __init__(self, vocab_size=500, d_model=128, n_heads=4,
                 n_layers=4, max_seq_len=256):
        super().__init__()
        # TODO: Define all components
        ???

    def forward(self, tokens):
        # TODO: Full forward pass
        ???

    @torch.no_grad()
    def generate(self, prompt_tokens, max_new_tokens=20):
        # TODO: Autoregressive generation
        # (KV cache is bonus — start without it)
        ???

# Test
model = MiniGPT()
tokens = torch.randint(0, 500, (1, 10))
logits = model(tokens)
print(f"Logits: {logits.shape}")  # [1, 10, 500]

generated = model.generate(tokens, max_new_tokens=15)
print(f"Generated: {generated.shape}")  # [1, 25]`,solution:`import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class RMSNorm(nn.Module):
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x):
        rms = torch.sqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)
        return x / rms * self.weight

class CausalAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model, bias=False)
        self.out = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x):
        B, T, C = x.shape
        qkv = self.qkv(x).view(B, T, 3, self.n_heads, self.d_k)
        q, k, v = qkv.unbind(2)
        q = q.transpose(1, 2)
        k = k.transpose(1, 2)
        v = v.transpose(1, 2)

        scores = q @ k.transpose(-2, -1) / math.sqrt(self.d_k)
        mask = torch.tril(torch.ones(T, T, device=x.device))
        scores = scores.masked_fill(mask == 0, float('-inf'))
        attn = F.softmax(scores, dim=-1)
        out = (attn @ v).transpose(1, 2).contiguous().view(B, T, C)
        return self.out(out)

class Block(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.norm1 = RMSNorm(d_model)
        self.attn = CausalAttention(d_model, n_heads)
        self.norm2 = RMSNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, 4 * d_model),
            nn.GELU(),
            nn.Linear(4 * d_model, d_model)
        )

    def forward(self, x):
        x = x + self.attn(self.norm1(x))
        x = x + self.ffn(self.norm2(x))
        return x

class MiniGPT(nn.Module):
    def __init__(self, vocab_size=500, d_model=128, n_heads=4,
                 n_layers=4, max_seq_len=256):
        super().__init__()
        self.tok_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(max_seq_len, d_model)
        self.blocks = nn.ModuleList([Block(d_model, n_heads) for _ in range(n_layers)])
        self.norm = RMSNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size, bias=False)
        self.max_seq_len = max_seq_len

    def forward(self, tokens):
        B, T = tokens.shape
        x = self.tok_emb(tokens) + self.pos_emb(torch.arange(T, device=tokens.device))
        for block in self.blocks:
            x = block(x)
        return self.head(self.norm(x))

    @torch.no_grad()
    def generate(self, tokens, max_new_tokens=20, temperature=0.8):
        for _ in range(max_new_tokens):
            ctx = tokens[:, -self.max_seq_len:]
            logits = self(ctx)[:, -1, :] / temperature
            probs = F.softmax(logits, dim=-1)
            next_tok = torch.multinomial(probs, 1)
            tokens = torch.cat([tokens, next_tok], dim=1)
        return tokens

model = MiniGPT()
tokens = torch.randint(0, 500, (1, 10))
logits = model(tokens)
print(f"Logits: {logits.shape}")
generated = model.generate(tokens, max_new_tokens=15)
print(f"Generated: {generated.shape}")
print(f"Params: {sum(p.numel() for p in model.parameters()):,}")`}},{id:"mps-deep-dive",title:"5. Apple MPS Backend Deep Dive",description:"MPS internals, performance tuning, debugging, limitations",sections:[{title:"MPS Architecture & How It Works",content:`The **Metal Performance Shaders (MPS)** backend translates PyTorch operations into Metal GPU commands on Apple Silicon.

**How it works under the hood:**
1. PyTorch dispatches an operation (e.g., matmul)
2. The MPS backend maps it to a Metal compute kernel
3. The kernel is submitted to the Metal command queue
4. Results are stored in Metal buffers (unified memory!)

**Unified Memory Advantage:** Apple Silicon shares memory between CPU and GPU. This means no explicit CPU↔GPU data transfer — the same memory is accessible to both. However, synchronization still matters.

**Key files in PyTorch source (for PR review context):**
- \`aten/src/ATen/native/mps/\` — MPS operation implementations
- \`aten/src/ATen/mps/\` — MPS runtime, allocator, stream management
- \`torch/backends/mps/\` — Python-level MPS backend interface`,code:`import torch
import time

# MPS setup
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
print(f"Device: {device}")

# Benchmark: MPS vs CPU
sizes = [512, 1024, 2048]

for n in sizes:
    a_cpu = torch.randn(n, n)
    b_cpu = torch.randn(n, n)
    a_mps = a_cpu.to(device)
    b_mps = b_cpu.to(device)

    # Warmup
    _ = a_mps @ b_mps
    if device.type == 'mps':
        torch.mps.synchronize()  # Important for accurate timing!

    # CPU timing
    start = time.perf_counter()
    for _ in range(10):
        _ = a_cpu @ b_cpu
    cpu_time = (time.perf_counter() - start) / 10

    # MPS timing
    start = time.perf_counter()
    for _ in range(10):
        _ = a_mps @ b_mps
        if device.type == 'mps':
            torch.mps.synchronize()
    mps_time = (time.perf_counter() - start) / 10

    print(f"{n}x{n} matmul: CPU={cpu_time*1000:.1f}ms, MPS={mps_time*1000:.1f}ms, "
          f"speedup={cpu_time/mps_time:.1f}x")`},{title:"MPS Debugging & Common Issues",content:`MPS is still evolving. Here are the most common issues and how to debug them:

**1. "Not implemented for MPS"**
Some operations don't have MPS kernels yet. The fix is to move tensors to CPU for that op.

**2. Numerical differences**
MPS uses float32 Metal shaders. You may see small numerical differences vs CPU, especially with reductions (sum, mean) due to different accumulation order.

**3. Memory issues**
Even though memory is unified, MPS has a memory allocator with a high watermark. Set \`PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0\` to let PyTorch use all available memory.

**4. Synchronization bugs**
MPS operations are asynchronous. If you time operations or print results without \`torch.mps.synchronize()\`, you'll get wrong timings or stale data.

**5. Profiling**
Use \`torch.mps.profiler\` or Instruments.app to profile Metal GPU usage.`,code:`import torch
import os

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

# --- Debug pattern: CPU fallback wrapper ---
def mps_safe(fn, *args, **kwargs):
    """Try on MPS, fall back to CPU if not implemented"""
    try:
        return fn(*args, **kwargs)
    except RuntimeError as e:
        if "not implemented for 'MPS'" in str(e) or "not currently supported" in str(e):
            print(f"MPS fallback to CPU for {fn.__name__ if hasattr(fn, '__name__') else fn}")
            cpu_args = [a.cpu() if isinstance(a, torch.Tensor) else a for a in args]
            cpu_kwargs = {k: v.cpu() if isinstance(v, torch.Tensor) else v for k, v in kwargs.items()}
            result = fn(*cpu_args, **cpu_kwargs)
            if isinstance(result, torch.Tensor):
                return result.to(device)
            return result
        raise

# --- Memory monitoring ---
if device.type == 'mps':
    # Check memory allocation
    print(f"Current allocated: {torch.mps.current_allocated_memory() / 1e6:.1f} MB")

    # Allocate some tensors
    tensors = [torch.randn(1000, 1000, device=device) for _ in range(10)]
    print(f"After allocation: {torch.mps.current_allocated_memory() / 1e6:.1f} MB")

    # Free memory
    del tensors
    torch.mps.empty_cache()
    print(f"After cleanup: {torch.mps.current_allocated_memory() / 1e6:.1f} MB")

# --- Synchronization for timing ---
def timed_op(fn, *args, sync=True):
    if sync and device.type == 'mps':
        torch.mps.synchronize()
    import time
    start = time.perf_counter()
    result = fn(*args)
    if sync and device.type == 'mps':
        torch.mps.synchronize()
    elapsed = time.perf_counter() - start
    return result, elapsed

x = torch.randn(2048, 2048, device=device)
_, t = timed_op(torch.mm, x, x)
print(f"\\n2048x2048 matmul: {t*1000:.2f}ms")`},{title:"MPS Performance Optimization",content:`To get the most out of MPS:

**Use float32, not float64.** MPS natively supports float32 and float16. Float64 operations either fail or fall back to CPU.

**Batch your operations.** Small tensor operations have high dispatch overhead on MPS. Batch them together for better GPU utilization.

**Use torch.compile with MPS.** Starting in PyTorch 2.1+, \`torch.compile\` has experimental MPS support. It can fuse operations and reduce kernel launches.

**Avoid frequent CPU↔MPS transfers.** Even though memory is unified, there's synchronization overhead. Keep your tensors on one device throughout the computation.

**Use MPS-optimized operations.** Matrix multiplication, convolutions, and most common NN operations are well-optimized. Custom operations may not be.`,code:`import torch
import torch.nn as nn

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

# --- Tip 1: Use float32 ---
# BAD: float64 on MPS
# x = torch.randn(100, 100, dtype=torch.float64, device=device)  # May fail!

# GOOD: float32
x = torch.randn(100, 100, dtype=torch.float32, device=device)

# --- Tip 2: Batch operations ---
import time

# BAD: many small operations
def many_small_ops(n=1000):
    result = torch.zeros(10, 10, device=device)
    for i in range(n):
        result += torch.randn(10, 10, device=device) * 0.001
    return result

# GOOD: one batched operation
def one_batched_op(n=1000):
    batch = torch.randn(n, 10, 10, device=device) * 0.001
    return batch.sum(dim=0)

if device.type == 'mps':
    torch.mps.synchronize()

    start = time.perf_counter()
    many_small_ops()
    torch.mps.synchronize()
    t1 = time.perf_counter() - start

    start = time.perf_counter()
    one_batched_op()
    torch.mps.synchronize()
    t2 = time.perf_counter() - start

    print(f"Many small ops: {t1*1000:.1f}ms")
    print(f"One batched op: {t2*1000:.1f}ms")
    print(f"Speedup: {t1/t2:.1f}x")

# --- Tip 3: torch.compile (experimental) ---
model = nn.Sequential(
    nn.Linear(256, 512),
    nn.ReLU(),
    nn.Linear(512, 256),
).to(device)

# compiled_model = torch.compile(model, backend="aot_eager")
# Note: MPS compile support varies by PyTorch version
# Check: torch.__version__ and test before relying on it

# --- Tip 4: Keep tensors on device ---
# BAD
def bad_pattern(x):
    x = x.cpu()       # unnecessary transfer
    x = x * 2
    x = x.to(device)  # back to MPS
    return x

# GOOD
def good_pattern(x):
    return x * 2  # stays on MPS throughout`}],quiz:[{question:"Why is torch.mps.synchronize() important for benchmarking?",options:["It frees GPU memory","MPS operations are asynchronous — without sync, timing includes only dispatch, not actual computation","It enables MPS mode","It moves tensors to CPU"],correct:1,explanation:"MPS dispatches operations asynchronously. synchronize() blocks until all queued operations complete, giving you accurate timing."},{question:"What is the advantage of Apple Silicon's unified memory for PyTorch?",options:["It's faster than NVIDIA HBM","CPU and GPU share the same memory, avoiding explicit data transfers","It supports float64 natively","It provides more total memory"],correct:1,explanation:"Unified memory means no PCIe data transfers between CPU and GPU. The data lives in one place and both processors can access it directly."}],exercise:{title:"MPS Benchmark Suite",description:`Build a benchmark that compares CPU vs MPS performance for common neural network operations:
1. Matrix multiplication (various sizes)
2. Conv2d forward pass
3. A small transformer block forward + backward

Report timings and speedup ratios.`,starterCode:`import torch
import torch.nn as nn
import time

def benchmark(name, fn, warmup=3, runs=10):
    """Time a function, handling MPS sync"""
    device = next(iter(fn.__code__.co_consts), None)  # ignore
    # Warmup
    for _ in range(warmup):
        fn()
    # TODO: Add MPS synchronize if needed
    ???

    times = []
    for _ in range(runs):
        start = time.perf_counter()
        fn()
        # TODO: sync
        ???
        times.append(time.perf_counter() - start)

    avg = sum(times) / len(times)
    print(f"{name}: {avg*1000:.2f}ms")
    return avg

# TODO: Benchmark matmul, conv2d, transformer block
# on both CPU and MPS, print speedup`,solution:`import torch
import torch.nn as nn
import time

def benchmark(name, fn, device, warmup=3, runs=10):
    for _ in range(warmup):
        fn()
    if device.type == 'mps':
        torch.mps.synchronize()

    times = []
    for _ in range(runs):
        start = time.perf_counter()
        fn()
        if device.type == 'mps':
            torch.mps.synchronize()
        times.append(time.perf_counter() - start)

    avg = sum(times) / len(times)
    print(f"  {name}: {avg*1000:.2f}ms")
    return avg

mps = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
cpu = torch.device("cpu")

for size in [512, 1024, 2048]:
    print(f"\\nMatmul {size}x{size}:")
    a_c, b_c = torch.randn(size, size), torch.randn(size, size)
    a_m, b_m = a_c.to(mps), b_c.to(mps)
    tc = benchmark("CPU", lambda: a_c @ b_c, cpu)
    tm = benchmark("MPS", lambda: a_m @ b_m, mps)
    print(f"  Speedup: {tc/tm:.1f}x")

print("\\nConv2d (batch=16, 3->64, 224x224):")
conv_c = nn.Conv2d(3, 64, 3, padding=1)
conv_m = nn.Conv2d(3, 64, 3, padding=1).to(mps)
x_c = torch.randn(16, 3, 224, 224)
x_m = x_c.to(mps)
tc = benchmark("CPU", lambda: conv_c(x_c), cpu)
tm = benchmark("MPS", lambda: conv_m(x_m), mps)
print(f"  Speedup: {tc/tm:.1f}x")`}},{id:"build-train-llm",title:"6. Build & Train a Small LLM",description:"End-to-end: build, tokenize, train, and generate with your own LLM on MPS",sections:[{title:"Putting It All Together",content:`In this final module, you'll build a complete character-level language model, train it on a text corpus, and generate text — all on MPS.

We'll use character-level tokenization (each character = one token) to keep it simple, but the architecture is exactly the same as GPT — just with a smaller vocabulary.

**The plan:**
1. Prepare dataset: encode text as character tokens
2. Create data loader with batching
3. Build GPT model (reusing everything from Module 4)
4. Train on MPS
5. Generate text

This is the same process used to train real LLMs, just at a smaller scale.`,code:`import torch

# Step 1: Prepare a simple dataset
text = """
To be, or not to be, that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles,
And by opposing end them. To die: to sleep;
No more; and by a sleep to say we end
The heart-ache and the thousand natural shocks
That flesh is heir to, 'tis a consummation
Devoutly to be wished. To die, to sleep;
To sleep: perchance to dream: ay, there's the rub.
""".strip()

# Character-level tokenization
chars = sorted(list(set(text)))
vocab_size = len(chars)
char_to_idx = {c: i for i, c in enumerate(chars)}
idx_to_char = {i: c for c, i in char_to_idx.items()}

# Encode entire text
data = torch.tensor([char_to_idx[c] for c in text], dtype=torch.long)
print(f"Vocab size: {vocab_size}")
print(f"Dataset size: {len(data)} tokens")
print(f"Sample: '{text[:50]}' -> {data[:50].tolist()}")

# Create training batches
def get_batch(data, batch_size, seq_len, device):
    """Get random batch of sequences"""
    ix = torch.randint(len(data) - seq_len - 1, (batch_size,))
    x = torch.stack([data[i:i+seq_len] for i in ix]).to(device)
    y = torch.stack([data[i+1:i+seq_len+1] for i in ix]).to(device)
    return x, y

# Test
x, y = get_batch(data, batch_size=4, seq_len=16, device='cpu')
print(f"\\nBatch x shape: {x.shape}")  # [4, 16]
print(f"Batch y shape: {y.shape}")  # [4, 16]
# y is x shifted right by 1 — the prediction target`},{title:"Training the Model",content:`Now we train our mini GPT on the Shakespeare-like text. The training loop is the same pattern you learned in Module 2, but applied to language modeling.

**Language modeling loss:** Cross-entropy between predicted next-token logits and actual next tokens. We reshape logits from (batch, seq_len, vocab_size) to (batch*seq_len, vocab_size) for PyTorch's cross_entropy.

**What to watch:**
- Loss should decrease from ~4.0 (random, since log(vocab_size)) to <1.5
- Generated text will start as gibberish and gradually become more text-like
- On MPS, this tiny model trains in seconds`,code:`import torch
import torch.nn as nn
import torch.nn.functional as F
import math

# Using the MiniGPT from Module 4 (simplified here)
class CharGPT(nn.Module):
    def __init__(self, vocab_size, d_model=64, n_heads=4, n_layers=3, max_len=128):
        super().__init__()
        self.max_len = max_len
        self.tok_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(max_len, d_model)

        self.blocks = nn.ModuleList()
        for _ in range(n_layers):
            self.blocks.append(nn.ModuleDict({
                'norm1': nn.LayerNorm(d_model),
                'attn_qkv': nn.Linear(d_model, 3 * d_model, bias=False),
                'attn_out': nn.Linear(d_model, d_model, bias=False),
                'norm2': nn.LayerNorm(d_model),
                'ffn': nn.Sequential(
                    nn.Linear(d_model, 4 * d_model),
                    nn.GELU(),
                    nn.Linear(4 * d_model, d_model)
                )
            }))

        self.norm_f = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size, bias=False)
        self.n_heads = n_heads
        self.d_k = d_model // n_heads

    def _attn(self, x, block):
        B, T, C = x.shape
        qkv = block['attn_qkv'](x).view(B, T, 3, self.n_heads, self.d_k)
        q, k, v = qkv.unbind(2)
        q, k, v = [t.transpose(1, 2) for t in (q, k, v)]
        scores = q @ k.transpose(-2, -1) / math.sqrt(self.d_k)
        mask = torch.tril(torch.ones(T, T, device=x.device)).unsqueeze(0).unsqueeze(0)
        scores = scores.masked_fill(mask == 0, float('-inf'))
        out = F.softmax(scores, dim=-1) @ v
        return block['attn_out'](out.transpose(1, 2).contiguous().view(B, T, C))

    def forward(self, tokens):
        B, T = tokens.shape
        x = self.tok_emb(tokens) + self.pos_emb(torch.arange(T, device=tokens.device))
        for block in self.blocks:
            x = x + self._attn(block['norm1'](x), block)
            x = x + block['ffn'](block['norm2'](x))
        return self.head(self.norm_f(x))

    @torch.no_grad()
    def generate(self, tokens, max_new=100, temp=0.8):
        for _ in range(max_new):
            ctx = tokens[:, -self.max_len:]
            logits = self(ctx)[:, -1, :] / temp
            tokens = torch.cat([tokens, torch.multinomial(F.softmax(logits, -1), 1)], 1)
        return tokens

# --- Training ---
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
model = CharGPT(vocab_size).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-3)
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")

for step in range(1000):
    x, y = get_batch(data, batch_size=32, seq_len=64, device=device)
    logits = model(x)
    loss = F.cross_entropy(logits.view(-1, vocab_size), y.view(-1))

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if step % 100 == 0:
        print(f"Step {step:4d} | Loss: {loss.item():.4f}")
        if step > 0:
            prompt = torch.tensor([[char_to_idx['T']]], device=device)
            gen = model.generate(prompt, max_new=60)
            print(f"  Generated: {''.join(idx_to_char[i.item()] for i in gen[0])}")
            print()`}],quiz:[{question:"Why do we reshape logits from (batch, seq_len, vocab) to (batch*seq_len, vocab) for cross_entropy?",options:["To reduce memory usage","PyTorch's cross_entropy expects (N, C) shaped input where N is the number of predictions","It improves numerical stability","It's required for MPS compatibility"],correct:1,explanation:"F.cross_entropy expects shape (N, num_classes). We flatten the batch and sequence dimensions so each position is treated as an independent prediction."},{question:"In character-level language modeling, what is each token?",options:["A word","A sentence","A single character","A subword piece"],correct:2,explanation:"Character-level models treat each character as a token. The vocabulary is small (all unique characters in the text) but sequences are longer."}],exercise:{title:"Train on Your Own Text",description:`Take the CharGPT model and:
1. Load a text file of your choosing (a book, code, song lyrics, etc.)
2. Train the model with at least 2000 steps
3. Experiment with model size (try d_model=128, n_layers=6)
4. Compare generation quality at different temperatures (0.5, 0.8, 1.2)
5. Bonus: Add a learning rate scheduler (cosine decay)

This is your playground — experiment and see what happens!`,starterCode:`# Use the CharGPT class from above
# Load your own text file:

with open('your_text.txt', 'r') as f:
    text = f.read()

# Experiment with:
# - Model size (d_model, n_heads, n_layers)
# - Learning rate and scheduler
# - Batch size and sequence length
# - Temperature during generation
# - Training steps

# TODO: Build and train your model!`,solution:`# This is open-ended! Here's a template with enhancements:
import torch
import torch.nn.functional as F

# Use the CharGPT class from above
# For this example, we'll use a longer built-in text

text = "..." # Load your text here

chars = sorted(set(text))
vocab_size = len(chars)
c2i = {c: i for i, c in enumerate(chars)}
i2c = {i: c for c, i in c2i.items()}
data = torch.tensor([c2i[c] for c in text])

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

# Bigger model
model = CharGPT(vocab_size, d_model=128, n_heads=4, n_layers=6, max_len=256).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

# Cosine scheduler
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=3000)

for step in range(3000):
    x, y = get_batch(data, 32, 128, device)
    loss = F.cross_entropy(model(x).view(-1, vocab_size), y.view(-1))
    optimizer.zero_grad()
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
    scheduler.step()

    if step % 200 == 0:
        print(f"Step {step} | Loss: {loss.item():.4f} | LR: {scheduler.get_last_lr()[0]:.6f}")
        for temp in [0.5, 0.8, 1.2]:
            prompt = torch.tensor([[c2i[text[0]]]], device=device)
            gen = model.generate(prompt, max_new=80, temp=temp)
            print(f"  T={temp}: {''.join(i2c[i.item()] for i in gen[0][:80])}")
        print()`}}],Em=[{number:77344,title:"Add MPS support for torch.linalg operations",description:"Adds Metal Performance Shaders kernels for core linear algebra operations. Good example of how MPS ops are implemented by wrapping Metal compute shaders.",tags:["mps","linalg","kernel"],learningPoints:["How MPS kernels are registered in PyTorch's dispatch system","The pattern for implementing new MPS operations","Testing strategy for MPS ops (comparison with CPU results)"]},{number:98495,title:"Improve MPS memory allocator efficiency",description:"Optimizes the Metal buffer allocation strategy to reduce memory fragmentation and improve reuse of allocated buffers.",tags:["mps","memory","performance"],learningPoints:["How PyTorch manages GPU memory on MPS","Buffer pooling and caching strategies","Unified memory considerations on Apple Silicon"]},{number:105372,title:"Enable torch.compile for MPS backend",description:"Adds initial torch.compile support for MPS, allowing graph-level optimizations for Metal GPU operations.",tags:["mps","compile","optimization"],learningPoints:["How torch.compile interacts with different backends","Graph capture and optimization on MPS","Limitations of current MPS compile support"]},{number:89231,title:"MPS: Add support for custom Metal shaders",description:"Enables users to write custom Metal Shading Language kernels and integrate them with PyTorch's MPS backend.",tags:["mps","custom-ops","metal"],learningPoints:["Metal Shading Language basics","PyTorch custom op registration for MPS","Performance comparison: custom vs built-in kernels"]},{number:112456,title:"Implement Flash Attention for MPS",description:"Ports the Flash Attention algorithm to Metal, significantly improving attention performance and memory usage on Apple Silicon.",tags:["mps","attention","performance"],learningPoints:["Flash Attention algorithm and tiling strategy","Metal threadgroup memory management","Benchmark methodology for attention implementations"]}];function Nm({questions:e,moduleId:t,onScore:n}){const[r,o]=w.useState(0),[l,i]=w.useState(null),[s,a]=w.useState(!1),[u,h]=w.useState(0),[p,v]=w.useState(!1),y=e[r],_=["A","B","C","D"],k=c=>{s||(i(c),a(!0),c===y.correct&&h(u+1))},P=()=>{var c;r<e.length-1?(o(r+1),i(null),a(!1)):(v(!0),u+(l===((c=e[r])==null?void 0:c.correct),0),n==null||n(u,e.length))},f=()=>{o(0),i(null),a(!1),h(0),v(!1)};if(p){const c=Math.round(u/e.length*100);return m.jsxs("div",{className:"quiz-section",children:[m.jsx("h3",{children:"Quiz Complete"}),m.jsxs("p",{style:{fontSize:"18px",marginBottom:"8px"},children:["Score: ",m.jsxs("strong",{style:{color:c>=70?"var(--green)":"var(--orange)"},children:[u,"/",e.length," (",c,"%)"]})]}),m.jsx("p",{style:{color:"var(--text-muted)",marginBottom:"16px"},children:c>=70?"Great job! You're ready to move on.":"Review the material and try again."}),m.jsx("button",{className:"btn btn-secondary",onClick:f,children:"Retake Quiz"})]})}return m.jsxs("div",{className:"quiz-section",children:[m.jsx("h3",{children:"📝 Knowledge Check"}),m.jsxs("div",{className:"quiz-question",children:[m.jsxs("div",{className:"quiz-counter",children:["Question ",r+1," of ",e.length]}),m.jsx("p",{children:y.question}),m.jsx("div",{className:"quiz-options",children:y.options.map((c,d)=>{let g="quiz-option";return s&&d===y.correct?g+=" correct":s&&d===l&&d!==y.correct?g+=" incorrect":!s&&d===l&&(g+=" selected"),m.jsxs("div",{className:g,onClick:()=>k(d),children:[m.jsx("span",{className:"option-letter",children:_[d]}),m.jsx("span",{children:c})]},d)})}),s&&m.jsxs("div",{className:"quiz-explanation",children:[l===y.correct?"✓ Correct! ":"✗ Incorrect. ",y.explanation]})]}),m.jsxs("div",{className:"quiz-nav",children:[m.jsxs("span",{className:"quiz-score",children:["Score: ",u,"/",r+(s?1:0)]}),s&&m.jsx("button",{className:"btn btn-primary",onClick:P,children:r<e.length-1?"Next Question →":"See Results"})]})]})}function Hc({code:e,language:t="python"}){const[n,r]=w.useState(!1),o=async()=>{try{await navigator.clipboard.writeText(e),r(!0),setTimeout(()=>r(!1),2e3)}catch{const l=document.createElement("textarea");l.value=e,document.body.appendChild(l),l.select(),document.execCommand("copy"),document.body.removeChild(l),r(!0),setTimeout(()=>r(!1),2e3)}};return m.jsxs("div",{className:"code-block",children:[m.jsxs("div",{className:"code-header",children:[m.jsx("span",{children:t}),m.jsx("button",{className:"copy-btn",onClick:o,children:n?"✓ Copied":"Copy"})]}),m.jsx("pre",{children:m.jsx("code",{children:e})})]})}function Tm({exercise:e}){const[t,n]=w.useState(e.starterCode),[r,o]=w.useState(!1),[l,i]=w.useState(!1),s=()=>{n(e.starterCode),o(!1)},a=u=>{if(u.key==="Tab"){u.preventDefault();const h=u.target.selectionStart,p=u.target.selectionEnd,v=u.target.value;n(v.substring(0,h)+"    "+v.substring(p)),setTimeout(()=>{u.target.selectionStart=u.target.selectionEnd=h+4},0)}};return m.jsxs("div",{className:"exercise-section",children:[m.jsxs("h3",{children:["🔨 Exercise: ",e.title]}),m.jsx("div",{className:"exercise-desc",children:e.description.split(`
`).map((u,h)=>m.jsxs(ui.Fragment,{children:[u,m.jsx("br",{})]},h))}),m.jsx("div",{className:"exercise-editor",children:m.jsx("textarea",{value:t,onChange:u=>n(u.target.value),onKeyDown:a,spellCheck:!1})}),m.jsxs("div",{className:"exercise-actions",children:[m.jsx("button",{className:"btn btn-secondary",onClick:()=>{const u=new Blob([t],{type:"text/plain"}),h=URL.createObjectURL(u),p=document.createElement("a");p.href=h,p.download=`exercise_${e.title.toLowerCase().replace(/\s+/g,"_")}.py`,p.click(),URL.revokeObjectURL(h)},children:"Download .py"}),m.jsx("button",{className:"btn btn-secondary",onClick:s,children:"Reset"}),m.jsx("button",{className:"btn btn-primary",onClick:()=>o(!r),children:r?"Hide Solution":"Show Solution"})]}),r&&m.jsxs("div",{style:{marginTop:"20px"},children:[m.jsx("h4",{style:{fontSize:"16px",marginBottom:"8px",color:"var(--green)"},children:"Solution"}),m.jsx(Hc,{code:e.solution})]})]})}function Mm({modules:e,completed:t,onComplete:n,onQuizScore:r,onSectionChange:o}){const{id:l}=Zp();ns();const i=e.find(h=>h.id===l),s=e.findIndex(h=>h.id===l);if(w.useEffect(()=>{window.scrollTo(0,0)},[l]),w.useEffect(()=>{var v;if(!i)return;const h=document.querySelectorAll(".section h3");if(!h.length)return;const p=new IntersectionObserver(y=>{for(const _ of y)_.isIntersecting&&o&&o(_.target.textContent)},{rootMargin:"-20% 0px -60% 0px"});return h.forEach(y=>p.observe(y)),o&&((v=i.sections)!=null&&v[0])&&o(i.sections[0].title),()=>p.disconnect()},[l,i]),!i)return m.jsx("div",{className:"content",children:m.jsx("p",{children:"Module not found."})});const a=s>0?e[s-1]:null,u=s<e.length-1?e[s+1]:null;return m.jsxs("div",{className:"content",children:[m.jsxs("div",{className:"module-header",children:[m.jsx("h2",{children:i.title}),m.jsx("p",{children:i.description})]}),i.sections.map((h,p)=>m.jsxs("div",{className:"section",children:[m.jsx("h3",{children:h.title}),m.jsx("div",{className:"section-content",children:h.content.split(`

`).map((v,y)=>m.jsx("p",{dangerouslySetInnerHTML:{__html:v.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\\`/g,"`").replace(/\n- /g,"<br/>• ").replace(/\n(\d+)\. /g,"<br/>$1. ")}},y))}),h.code&&m.jsx(Hc,{code:h.code})]},p)),i.quiz&&m.jsx(Nm,{questions:i.quiz,moduleId:i.id,onScore:(h,p)=>r==null?void 0:r(i.id,h,p)}),i.exercise&&m.jsx(Tm,{exercise:i.exercise}),m.jsxs("div",{className:"module-nav",children:[a?m.jsxs(ht,{to:`/module/${a.id}`,className:"btn btn-secondary",children:["← ",a.title]}):m.jsx("div",{}),t.includes(i.id)?m.jsx("span",{className:"btn btn-success",style:{cursor:"default"},children:"✓ Completed"}):m.jsx("button",{className:"btn btn-primary",onClick:()=>n(i.id),children:"Mark as Complete"}),u?m.jsxs(ht,{to:`/module/${u.id}`,className:"btn btn-secondary",children:[u.title," →"]}):m.jsx(ht,{to:"/prs",className:"btn btn-secondary",children:"PR Review →"})]})]})}function zm(){var c;const[e,t]=w.useState("curated"),[n,r]=w.useState([]),[o,l]=w.useState(!1),[i,s]=w.useState("mps"),[a,u]=w.useState(null),[h,p]=w.useState(null),[v,y]=w.useState(!1),_=async d=>{l(!0);try{const S=await(await fetch(`/api/prs?search=${encodeURIComponent(d||"mps")}`)).json();r(S.items||[])}catch(g){console.error("Failed to fetch PRs:",g),r([])}finally{l(!1)}},k=async d=>{y(!0);try{const S=await(await fetch(`/api/prs/${d}`)).json();p(S)}catch(g){console.error("Failed to fetch PR detail:",g)}finally{y(!1)}};w.useEffect(()=>{e==="live"&&_(i)},[e]);const P=d=>{d.preventDefault(),_(i)},f=d=>{u(d),k(d.number)};return a&&e==="live"?m.jsxs("div",{className:"content",children:[m.jsx("button",{className:"btn btn-secondary",onClick:()=>{u(null),p(null)},style:{marginBottom:"20px"},children:"← Back to PR list"}),m.jsxs("div",{className:"pr-detail",children:[m.jsxs("h3",{children:["#",a.number,": ",a.title]}),m.jsxs("div",{className:"pr-meta",style:{marginBottom:"16px",color:"var(--text-muted)"},children:["by ",(c=a.user)==null?void 0:c.login," · ",a.state," · updated ",new Date(a.updated_at).toLocaleDateString()]}),a.body&&m.jsxs("div",{style:{padding:"16px",background:"var(--bg-tertiary)",borderRadius:"8px",marginBottom:"20px",fontSize:"14px",lineHeight:"1.7",maxHeight:"300px",overflow:"auto"},children:[a.body.slice(0,2e3),a.body.length>2e3&&"..."]}),m.jsx("a",{href:a.html_url,target:"_blank",rel:"noopener noreferrer",className:"btn btn-primary",style:{display:"inline-block",marginBottom:"24px",textDecoration:"none"},children:"View on GitHub →"}),v&&m.jsxs("div",{className:"loading",children:[m.jsx("div",{className:"spinner"})," Loading files..."]}),(h==null?void 0:h.files)&&m.jsxs(m.Fragment,{children:[m.jsxs("h4",{style:{marginBottom:"12px"},children:["Changed Files (",h.files.length,")"]}),h.files.slice(0,15).map((d,g)=>m.jsxs("div",{className:"pr-file",children:[m.jsxs("div",{className:"pr-file-header",children:[m.jsx("span",{children:d.filename}),m.jsxs("span",{style:{color:"var(--green)"},children:["+",d.additions]})," ",m.jsxs("span",{style:{color:"var(--red)"},children:["-",d.deletions]})]}),d.patch&&m.jsxs("div",{className:"pr-file-diff",children:[d.patch.split(`
`).slice(0,50).map((S,C)=>m.jsx("div",{className:`line ${S.startsWith("+")?"add":S.startsWith("-")?"del":""}`,children:S},C)),d.patch.split(`
`).length>50&&m.jsxs("div",{className:"line",style:{color:"var(--text-muted)",padding:"8px 16px"},children:["... ",d.patch.split(`
`).length-50," more lines (view on GitHub)"]})]})]},g))]})]})]}):m.jsxs("div",{className:"content",children:[m.jsxs("div",{className:"module-header",children:[m.jsx("h2",{children:"PyTorch MPS PR Review"}),m.jsx("p",{children:"Learn from real PyTorch pull requests related to the MPS backend"})]}),m.jsxs("div",{className:"tab-bar",children:[m.jsx("button",{className:`tab ${e==="curated"?"active":""}`,onClick:()=>t("curated"),children:"Curated & Annotated"}),m.jsx("button",{className:`tab ${e==="live"?"active":""}`,onClick:()=>t("live"),children:"Live from GitHub"})]}),e==="curated"&&m.jsx("div",{className:"pr-list",children:Em.map(d=>m.jsxs("div",{className:"pr-card",onClick:()=>{u(d),t("live"),k(d.number)},children:[m.jsxs("h4",{children:["#",d.number,": ",d.title]}),m.jsx("p",{className:"pr-meta",children:d.description}),m.jsx("div",{className:"pr-tags",children:d.tags.map(g=>m.jsx("span",{className:"pr-tag",children:g},g))}),m.jsxs("div",{className:"pr-learning-points",children:[m.jsx("h4",{children:"What you'll learn:"}),m.jsx("ul",{children:d.learningPoints.map((g,S)=>m.jsx("li",{children:g},S))})]})]},d.number))}),e==="live"&&m.jsxs(m.Fragment,{children:[m.jsxs("form",{onSubmit:P,className:"search-bar",children:[m.jsx("input",{className:"search-input",value:i,onChange:d=>s(d.target.value),placeholder:"Search PyTorch PRs (e.g., mps, metal, apple silicon)"}),m.jsx("button",{type:"submit",className:"btn btn-primary",children:"Search"})]}),o?m.jsxs("div",{className:"loading",children:[m.jsx("div",{className:"spinner"})," Fetching PRs..."]}):m.jsxs("div",{className:"pr-list",children:[n.length===0&&m.jsx("p",{style:{color:"var(--text-muted)"},children:'No PRs found. Try searching for "mps", "metal", or "apple".'}),n.map(d=>{var g,S;return m.jsxs("div",{className:"pr-card",onClick:()=>f(d),children:[m.jsxs("h4",{children:["#",d.number,": ",d.title]}),m.jsxs("p",{className:"pr-meta",children:["by ",(g=d.user)==null?void 0:g.login," · ",d.state," · updated ",new Date(d.updated_at).toLocaleDateString()]}),m.jsx("div",{className:"pr-tags",children:(S=d.labels)==null?void 0:S.slice(0,5).map(C=>m.jsx("span",{className:"pr-tag",children:C.name},C.id))})]},d.number)})]})]})]})}function Lm({isOpen:e,onClose:t,appContext:n}){const[r,o]=w.useState(()=>{try{const c=JSON.parse(localStorage.getItem("chat_history")||"[]");return c.length>0?c:[]}catch{return[]}}),[l,i]=w.useState(""),[s,a]=w.useState(!1),[u,h]=w.useState(()=>localStorage.getItem("chat_model")||"sonnet"),p=w.useRef(null),v=w.useRef(null);w.useEffect(()=>{localStorage.setItem("chat_history",JSON.stringify(r))},[r]),w.useEffect(()=>{localStorage.setItem("chat_model",u)},[u]),w.useEffect(()=>{var c;(c=p.current)==null||c.scrollIntoView({behavior:"smooth"})},[r]),w.useEffect(()=>{e&&setTimeout(()=>{var c;return(c=v.current)==null?void 0:c.focus()},300)},[e]);const y=async()=>{const c=l.trim();if(!c||s)return;const d={role:"user",content:c},g=[...r,d];o(g),i(""),a(!0);try{const S=g.filter(M=>M.role!=="system"),C=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:c,appContext:n,history:S.slice(-20),model:u})});if(!C.ok){const M=await C.json();throw new Error(M.error||"Request failed")}const E=await C.json();o(M=>[...M,{role:"assistant",content:E.response}])}catch(S){o(C=>[...C,{role:"system",content:`Error: ${S.message}`}])}finally{a(!1)}},_=c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),y())},k=()=>{o([]),localStorage.removeItem("chat_history")},P=c=>c.split(/(```[\s\S]*?```)/g).map((g,S)=>{if(g.startsWith("```")){const E=g.replace(/```\w*\n?/,"").replace(/```$/,"");return m.jsx("pre",{children:m.jsx("code",{children:E})},S)}const C=g.split(/(\*\*[^*]+\*\*)/g).map((E,M)=>{if(E.startsWith("**")&&E.endsWith("**"))return m.jsx("strong",{children:E.slice(2,-2)},M);const W=E.split(/(`[^`]+`)/g).map((L,ve)=>L.startsWith("`")&&L.endsWith("`")?m.jsx("code",{style:{background:"var(--bg)",padding:"1px 5px",borderRadius:"3px",fontSize:"12px"},children:L.slice(1,-1)},ve):L);return m.jsx("span",{children:W},M)});return m.jsx("span",{children:C},S)}),f=(n==null?void 0:n.currentPage)==="module"&&(n!=null&&n.currentModule)?n.currentModule.title:(n==null?void 0:n.currentPage)==="prs"?"PR Review":"Home";return m.jsxs("div",{className:`chat-panel ${e?"open":""}`,children:[m.jsxs("div",{className:"chat-header",children:[m.jsxs("h3",{children:[m.jsx("span",{style:{fontSize:"18px"},children:"🤖"}),"Ask Claude"]}),m.jsx("button",{className:"chat-close",onClick:t,children:"✕"})]}),m.jsxs("div",{style:{padding:"8px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",fontSize:"12px"},children:[m.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[m.jsx("span",{style:{color:"var(--text-muted)"},children:"Model:"}),m.jsxs("div",{style:{display:"flex",background:"var(--bg-tertiary)",borderRadius:"6px",overflow:"hidden",border:"1px solid var(--border)"},children:[m.jsx("button",{onClick:()=>h("sonnet"),style:{padding:"4px 10px",background:u==="sonnet"?"var(--accent-dark)":"transparent",color:u==="sonnet"?"white":"var(--text-muted)",border:"none",cursor:"pointer",fontSize:"12px",fontFamily:"inherit",fontWeight:u==="sonnet"?600:400},children:"Sonnet"}),m.jsx("button",{onClick:()=>h("opus"),style:{padding:"4px 10px",background:u==="opus"?"var(--accent-dark)":"transparent",color:u==="opus"?"white":"var(--text-muted)",border:"none",cursor:"pointer",fontSize:"12px",fontFamily:"inherit",fontWeight:u==="opus"?600:400},children:"Opus"})]})]}),m.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[m.jsxs("span",{style:{color:"var(--text-muted)",display:"flex",alignItems:"center",gap:"4px"},children:[m.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",background:"var(--green)",display:"inline-block"}}),f]}),r.length>0&&m.jsx("button",{onClick:k,style:{background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer",fontSize:"12px",padding:"2px 4px"},title:"Clear chat history",children:"Clear"})]})]}),m.jsxs("div",{className:"chat-messages",children:[r.length===0&&m.jsx("div",{className:"chat-msg system",children:"Ask me anything about PyTorch, LLM architecture, or MPS. I know which module you're on and adapt my answers."}),r.map((c,d)=>m.jsx("div",{className:`chat-msg ${c.role}`,children:c.role==="assistant"?P(c.content):c.content},d)),s&&m.jsx("div",{className:"chat-msg assistant",children:m.jsxs("div",{className:"loading",style:{padding:"4px 0"},children:[m.jsx("div",{className:"spinner"})," Thinking (",u,")..."]})}),m.jsx("div",{ref:p})]}),m.jsx("div",{className:"chat-input-area",children:m.jsxs("div",{className:"chat-input-row",children:[m.jsx("textarea",{ref:v,className:"chat-input",placeholder:`Ask about ${f.toLowerCase()}...`,value:l,onChange:c=>i(c.target.value),onKeyDown:_,rows:2}),m.jsx("button",{className:"chat-send",onClick:y,disabled:s||!l.trim(),children:"Send"})]})})]})}function jm(){const e=cr();ns();const[t,n]=w.useState(()=>{try{return JSON.parse(localStorage.getItem("completed")||"[]")}catch{return[]}}),[r,o]=w.useState(!1),[l,i]=w.useState(()=>{try{return JSON.parse(localStorage.getItem("quiz_scores")||"{}")}catch{return{}}}),[s,a]=w.useState(null),u=w.useMemo(()=>{var _;const v=e.pathname,y=v.match(/^\/module\/(.+)$/);if(y){const k=Be.find(P=>P.id===y[1]);return{currentPage:"module",currentModule:k?{title:k.title,description:k.description,sections:(_=k.sections)==null?void 0:_.map(P=>({title:P.title}))}:null,currentSection:s,completedModules:t,quizScores:l,totalModules:Be.length}}else if(v.startsWith("/prs"))return{currentPage:"prs",completedModules:t,quizScores:l,totalModules:Be.length};return{currentPage:"home",completedModules:t,quizScores:l,totalModules:Be.length}},[e.pathname,t,l,s]);w.useEffect(()=>{localStorage.setItem("completed",JSON.stringify(t))},[t]);const h=v=>{t.includes(v)||n([...t,v])},p=Math.round(t.length/Be.length*100);return m.jsxs("div",{className:"app",children:[m.jsxs("nav",{className:"sidebar",children:[m.jsxs("div",{className:"sidebar-header",children:[m.jsx("h1",{children:"PyTorch & LLMs"}),m.jsx("p",{children:"Learning on Apple Silicon"})]}),m.jsxs("div",{className:"sidebar-nav",children:[m.jsx("div",{className:"nav-section",children:"Course"}),m.jsxs(ht,{to:"/",className:`nav-item ${e.pathname==="/"?"active":""}`,children:[m.jsx("span",{className:"nav-dot"}),m.jsx("span",{children:"Home"})]}),Be.map(v=>m.jsxs(ht,{to:`/module/${v.id}`,className:`nav-item ${e.pathname===`/module/${v.id}`?"active":""} ${t.includes(v.id)?"completed":""}`,children:[m.jsx("span",{className:"nav-dot"}),m.jsx("span",{children:v.title})]},v.id)),m.jsx("div",{className:"nav-section",children:"Tools"}),m.jsxs(ht,{to:"/prs",className:`nav-item ${e.pathname.startsWith("/prs")?"active":""}`,children:[m.jsx("span",{className:"nav-dot"}),m.jsx("span",{children:"PR Review"})]})]}),m.jsxs("div",{className:"sidebar-footer",children:[m.jsx("div",{className:"progress-bar",children:m.jsx("div",{className:"progress-fill",style:{width:`${p}%`}})}),m.jsxs("div",{className:"progress-text",children:[t.length,"/",Be.length," modules — ",p,"%"]})]})]}),m.jsx("main",{className:"main",children:m.jsxs(hm,{children:[m.jsx(Vr,{path:"/",element:m.jsx(Rm,{modules:Be,completed:t})}),m.jsx(Vr,{path:"/module/:id",element:m.jsx(Mm,{modules:Be,completed:t,onComplete:h,onQuizScore:(v,y,_)=>{const k={...l,[v]:{score:y,total:_}};i(k),localStorage.setItem("quiz_scores",JSON.stringify(k))},onSectionChange:a})}),m.jsx(Vr,{path:"/prs",element:m.jsx(zm,{})})]})}),m.jsx(Lm,{isOpen:r,onClose:()=>o(!1),appContext:u}),m.jsx("button",{className:"chat-toggle",onClick:()=>o(!r),title:"Ask Claude",children:"💬"})]})}function Rm({modules:e,completed:t}){return m.jsxs("div",{className:"home",children:[m.jsx("h2",{children:"Learn PyTorch & LLM Architecture"}),m.jsx("p",{className:"subtitle",children:"Hands-on course covering tensors, backprop, transformers, MPS acceleration, and building your own language model — all on Apple Silicon."}),m.jsxs("div",{className:"module-cards",children:[e.map((n,r)=>m.jsxs(ht,{to:`/module/${n.id}`,className:`module-card ${t.includes(n.id)?"completed":""}`,children:[m.jsx("div",{className:"module-num",children:t.includes(n.id)?"✓":r+1}),m.jsxs("div",{className:"module-card-text",children:[m.jsx("h4",{children:n.title}),m.jsx("p",{children:n.description})]})]},n.id)),m.jsxs(ht,{to:"/prs",className:"module-card",children:[m.jsx("div",{className:"module-num",style:{color:"#bc8cff"},children:"PR"}),m.jsxs("div",{className:"module-card-text",children:[m.jsx("h4",{children:"PyTorch MPS PR Review"}),m.jsx("p",{children:"Browse and study real PyTorch PRs related to MPS backend"})]})]})]})]})}ul.createRoot(document.getElementById("root")).render(m.jsx(ui.StrictMode,{children:m.jsx(xm,{children:m.jsx(jm,{})})}));
