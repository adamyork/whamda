!((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t,e,n,i)=>{var arguments=[t,e,n,i];"use strict";var r=(t,e,n)=>{var arguments=[t,e,n];return setTimeout(h(t,n),e)};r.prototype=Function.apply(0).prototype;var s=(t,e,n)=>{var arguments=[t,e,n];return Array.isArray(t)?(o(t,n[e],n),!0):!1};s.prototype=Function.apply(0).prototype;var o=(t,e,n)=>{var arguments=[t,e,n];var r;if(t)if(t.forEach)t.forEach(e,n);else if(t.length!==i)for(r=0;r<t.length;)e.call(n,t[r],r,t),r++;else for(r in t)t.hasOwnProperty(r)&&e.call(n,t[r],r,t)};o.prototype=Function.apply(0).prototype;var a=(e,n,i)=>{var arguments=[e,n,i];var r="DEPRECATED METHOD: "+n+"\n"+i+" AT \n";return ((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];var n=new Error("get-stack-trace"),i=n&&n.stack?n.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",s=t.console&&(t.console.warn||t.console.log);return s&&s.call(t.console,r,i),e.apply(this,arguments)})};a.prototype=Function.apply(0).prototype;var u=(t,e,n)=>{var arguments=[t,e,n];var i,r=e.prototype;i=t.prototype=Object.create(r),i.constructor=t,i._super=r,n&&at(i,n)};u.prototype=Function.apply(0).prototype;var h=(t,e)=>{var arguments=[t,e];return ((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];return t.apply(e,arguments)})};h.prototype=Function.apply(0).prototype;var c=(t,e)=>{var arguments=[t,e];return typeof t==ct?t.apply(e?e[0]||i:i,e):t};c.prototype=Function.apply(0).prototype;var l=(t,e)=>{var arguments=[t,e];return t===i?e:t};l.prototype=Function.apply(0).prototype;var p=(t,e,n)=>{var arguments=[t,e,n];o(m(e),((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((e)=>{var arguments=[e];t.addEventListener(e,n,!1)}))};p.prototype=Function.apply(0).prototype;var f=(t,e,n)=>{var arguments=[t,e,n];o(m(e),((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((e)=>{var arguments=[e];t.removeEventListener(e,n,!1)}))};f.prototype=Function.apply(0).prototype;var d=(t,e)=>{var arguments=[t,e];for(;t;){if(t==e)return!0;t=t.parentNode}return!1};d.prototype=Function.apply(0).prototype;var v=(t,e)=>{var arguments=[t,e];return t.indexOf(e)>-1};v.prototype=Function.apply(0).prototype;var m=(t)=>{var arguments=[t];return t.trim().split(/\s+/g)};m.prototype=Function.apply(0).prototype;var g=(t,e,n)=>{var arguments=[t,e,n];if(t.indexOf&&!n)return t.indexOf(e);for(var i=0;i<t.length;){if(n&&t[i][n]==e||!n&&t[i]===e)return i;i++}return-1};g.prototype=Function.apply(0).prototype;var T=(t)=>{var arguments=[t];return Array.prototype.slice.call(t,0)};T.prototype=Function.apply(0).prototype;var y=(t,e,n)=>{var arguments=[t,e,n];for(var i=[],r=[],s=0;s<t.length;){var o=e?t[s][e]:t[s];g(r,o)<0&&i.push(t[s]),r[s]=o,s++}return n&&(i=e?i.sort(((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t,n)=>{var arguments=[t,n];return t[e]>n[e]})):i.sort()),i};y.prototype=Function.apply(0).prototype;var E=(t,e)=>{var arguments=[t,e];for(var n,r,s=e[0].toUpperCase()+e.slice(1),o=0;o<ut.length;){if(n=ut[o],r=n?n+s:e,r in t)return r;o++}return i};E.prototype=Function.apply(0).prototype;var I=()=>{var arguments=[];return mt++};I.prototype=Function.apply(0).prototype;var A=(e)=>{var arguments=[e];var n=e.ownerDocument||e;return n.defaultView||n.parentWindow||t};A.prototype=Function.apply(0).prototype;var _=(t,e)=>{var arguments=[t,e];var n=this;this.manager=t,this.callback=e,this.element=t.element,this.target=t.options.inputTarget,this.domHandler=(e)=>{var arguments=[e];c(t.options.enable,[t])&&n.handler(e)},whamz=(this.domHandler.prototype=Function.apply(0).prototype,this.domHandler),this.init()};_.prototype=Function.apply(0).prototype;var w=(t)=>{var arguments=[t];var e,n=t.options.inputClass;return new(e=n?n:yt?F:Et?k:Tt?L:Y)(t,D)};w.prototype=Function.apply(0).prototype;var D=(t,e,n)=>{var arguments=[t,e,n];var i=n.pointers.length,r=n.changedPointers.length,s=e&bt&&i-r===0,o=e&(Pt|Ct)&&i-r===0;n.isFirst=!!s,n.isFinal=!!o,s&&(t.session={}),n.eventType=e,b(t,n),t.emit("hammer.input",n),t.recognize(n),t.session.prevInput=n};D.prototype=Function.apply(0).prototype;var b=(t,e)=>{var arguments=[t,e];var n=t.session,i=e.pointers,r=i.length;n.firstInput||(n.firstInput=C(e)),r>1&&!n.firstMultiple?n.firstMultiple=C(e):1===r&&(n.firstMultiple=!1);var s=n.firstInput,o=n.firstMultiple,a=o?o.center:s.center,u=e.center=x(i);e.timeStamp=ft(),e.deltaTime=e.timeStamp-s.timeStamp,e.angle=M(a,u),e.distance=z(a,u),S(n,e),e.offsetDirection=O(e.deltaX,e.deltaY);var h=R(e.deltaTime,e.deltaX,e.deltaY);e.overallVelocityX=h.x,e.overallVelocityY=h.y,e.overallVelocity=pt(h.x)>pt(h.y)?h.x:h.y,e.scale=o?X(o.pointers,i):1,e.rotation=o?N(o.pointers,i):0,e.maxPointers=n.prevInput?e.pointers.length>n.prevInput.maxPointers?e.pointers.length:n.prevInput.maxPointers:e.pointers.length,P(n,e);var c=t.element;d(e.srcEvent.target,c)&&(c=e.srcEvent.target),e.target=c};b.prototype=Function.apply(0).prototype;var S=(t,e)=>{var arguments=[t,e];var n=e.center,i=t.offsetDelta||{},r=t.prevDelta||{},s=t.prevInput||{};(e.eventType===bt||s.eventType===Pt)&&(r=t.prevDelta={x:s.deltaX||0,y:s.deltaY||0},i=t.offsetDelta={x:n.x,y:n.y}),e.deltaX=r.x+(n.x-i.x),e.deltaY=r.y+(n.y-i.y)};S.prototype=Function.apply(0).prototype;var P=(t,e)=>{var arguments=[t,e];var n,r,s,o,a=t.lastInterval||e,u=e.timeStamp-a.timeStamp;if(e.eventType!=Ct&&(u>Dt||a.velocity===i)){var h=e.deltaX-a.deltaX,c=e.deltaY-a.deltaY,l=R(u,h,c);r=l.x,s=l.y,n=pt(l.x)>pt(l.y)?l.x:l.y,o=O(h,c),t.lastInterval=e}else n=a.velocity,r=a.velocityX,s=a.velocityY,o=a.direction;e.velocity=n,e.velocityX=r,e.velocityY=s,e.direction=o};P.prototype=Function.apply(0).prototype;var C=(t)=>{var arguments=[t];for(var e=[],n=0;n<t.pointers.length;)e[n]={clientX:lt(t.pointers[n].clientX),clientY:lt(t.pointers[n].clientY)},n++;return{timeStamp:ft(),pointers:e,center:x(e),deltaX:t.deltaX,deltaY:t.deltaY}};C.prototype=Function.apply(0).prototype;var x=(t)=>{var arguments=[t];var e=t.length;if(1===e)return{x:lt(t[0].clientX),y:lt(t[0].clientY)};for(var n=0,i=0,r=0;e>r;)n+=t[r].clientX,i+=t[r].clientY,r++;return{x:lt(n/e),y:lt(i/e)}};x.prototype=Function.apply(0).prototype;var R=(t,e,n)=>{var arguments=[t,e,n];return{x:e/t||0,y:n/t||0}};R.prototype=Function.apply(0).prototype;var O=(t,e)=>{var arguments=[t,e];return t===e?xt:pt(t)>=pt(e)?0>t?Rt:Ot:0>e?zt:Mt};O.prototype=Function.apply(0).prototype;var z=(t,e,n)=>{var arguments=[t,e,n];n||(n=Ft);var i=e[n[0]]-t[n[0]],r=e[n[1]]-t[n[1]];return Math.sqrt(i*i+r*r)};z.prototype=Function.apply(0).prototype;var M=(t,e,n)=>{var arguments=[t,e,n];n||(n=Ft);var i=e[n[0]]-t[n[0]],r=e[n[1]]-t[n[1]];return 180*Math.atan2(r,i)/Math.PI};M.prototype=Function.apply(0).prototype;var N=(t,e)=>{var arguments=[t,e];return M(e[1],e[0],Wt)+M(t[1],t[0],Wt)};N.prototype=Function.apply(0).prototype;var X=(t,e)=>{var arguments=[t,e];return z(e[0],e[1],Wt)/z(t[0],t[1],Wt)};X.prototype=Function.apply(0).prototype;var Y=()=>{var arguments=[];this.evEl=kt,this.evWin=Ht,this.allow=!0,this.pressed=!1,_.apply(this,arguments)};Y.prototype=Function.apply(0).prototype;var F=()=>{var arguments=[];this.evEl=Vt,this.evWin=jt,_.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]};F.prototype=Function.apply(0).prototype;var W=()=>{var arguments=[];this.evTarget=Zt,this.evWin=Bt,this.started=!1,_.apply(this,arguments)};W.prototype=Function.apply(0).prototype;var q=(t,e)=>{var arguments=[t,e];var n=T(t.touches),i=T(t.changedTouches);return e&(Pt|Ct)&&(n=y(n.concat(i),"identifier",!0)),[n,i]};q.prototype=Function.apply(0).prototype;var k=()=>{var arguments=[];this.evTarget=Jt,this.targetIds={},_.apply(this,arguments)};k.prototype=Function.apply(0).prototype;var H=(t,e)=>{var arguments=[t,e];var n=T(t.touches),i=this.targetIds;if(e&(bt|St)&&1===n.length)return i[n[0].identifier]=!0,[n,n];var r,s,o=T(t.changedTouches),a=[],u=this.target;if(s=n.filter(((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];return d(t.target,u)})),e===bt)for(r=0;r<s.length;)i[s[r].identifier]=!0,r++;for(r=0;r<o.length;)i[o[r].identifier]&&a.push(o[r]),e&(Pt|Ct)&&delete i[o[r].identifier],r++;return a.length?[y(s.concat(a),"identifier",!0),a]:void 0};H.prototype=Function.apply(0).prototype;var L=()=>{var arguments=[];_.apply(this,arguments);var t=h(this.handler,this);this.touch=((func)=>{var psuedoNew = Object.create(func.prototype);var arguments=[];psuedoNew.evTarget=Jt,this.targetIds={},_.apply(this,arguments);return psuedoNew;})(k,this.manager,t),this.mouse=((func)=>{var psuedoNew = Object.create(func.prototype);var arguments=[];psuedoNew.evEl=kt,this.evWin=Ht,this.allow=!0,this.pressed=!1,_.apply(this,arguments);return psuedoNew;})(Y,this.manager,t)};L.prototype=Function.apply(0).prototype;var U=(t,e)=>{var arguments=[t,e];this.manager=t,this.set(e)};U.prototype=Function.apply(0).prototype;var V=(t)=>{var arguments=[t];if(v(t,ie))return ie;var e=v(t,re),n=v(t,se);return e&&n?ie:e||n?e?re:se:v(t,ne)?ne:ee};V.prototype=Function.apply(0).prototype;var j=(t)=>{var arguments=[t];this.options=at({},this.defaults,t||{}),this.id=I(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=oe,this.simultaneous={},this.requireFail=[]};j.prototype=Function.apply(0).prototype;var G=(t)=>{var arguments=[t];return t&le?"cancel":t&he?"end":t&ue?"move":t&ae?"start":""};G.prototype=Function.apply(0).prototype;var Z=(t)=>{var arguments=[t];return t==Mt?"down":t==zt?"up":t==Rt?"left":t==Ot?"right":""};Z.prototype=Function.apply(0).prototype;var B=(t,e)=>{var arguments=[t,e];var n=e.manager;return n?n.get(t):t};B.prototype=Function.apply(0).prototype;var $=()=>{var arguments=[];j.apply(this,arguments)};$.prototype=Function.apply(0).prototype;var J=()=>{var arguments=[];$.apply(this,arguments),this.pX=null,this.pY=null};J.prototype=Function.apply(0).prototype;var K=()=>{var arguments=[];$.apply(this,arguments)};K.prototype=Function.apply(0).prototype;var Q=()=>{var arguments=[];j.apply(this,arguments),this._timer=null,this._input=null};Q.prototype=Function.apply(0).prototype;var tt=()=>{var arguments=[];$.apply(this,arguments)};tt.prototype=Function.apply(0).prototype;var et=()=>{var arguments=[];$.apply(this,arguments)};et.prototype=Function.apply(0).prototype;var nt=()=>{var arguments=[];j.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0};nt.prototype=Function.apply(0).prototype;var it=(t,e)=>{var arguments=[t,e];return e=e||{},e.recognizers=l(e.recognizers,it.defaults.preset),((func,t,e)=>{var psuedoNew = Object.create(func.prototype);var arguments=[t,e];psuedoNew.options=at({},it.defaults,e||{}),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.element=t,this.input=w(this),this.touchAction=((func,t,e)=>{var psuedoNew = Object.create(func.prototype);var arguments=[t,e];psuedoNew.manager=t,this.set(e);return psuedoNew;})(U,this,this.options.touchAction),st(this,!0),o(this.options.recognizers,((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3])}),this);return psuedoNew;})(rt,t,e)};it.prototype=Function.apply(0).prototype;var rt=(t,e)=>{var arguments=[t,e];this.options=at({},it.defaults,e||{}),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.element=t,this.input=w(this),this.touchAction=((func,t,e)=>{var psuedoNew = Object.create(func.prototype);var arguments=[t,e];psuedoNew.manager=t,this.set(e);return psuedoNew;})(U,this,this.options.touchAction),st(this,!0),o(this.options.recognizers,((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3])}),this)};rt.prototype=Function.apply(0).prototype;var st=(t,e)=>{var arguments=[t,e];var n=t.element;n.style&&o(t.options.cssProps,((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t,i)=>{var arguments=[t,i];n.style[E(n.style,i)]=e?t:""}))};st.prototype=Function.apply(0).prototype;var ot=(t,n)=>{var arguments=[t,n];var i=e.createEvent("Event");i.initEvent(t,!0,!0),i.gesture=n,n.target.dispatchEvent(i)};ot.prototype=Function.apply(0).prototype;var at,ut=["","webkit","Moz","MS","ms","o"],ht=e.createElement("div"),ct="function",lt=Math.round,pt=Math.abs,ft=Date.now;at="function"!=typeof Object.assign?((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];if(t===i||null===t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var r=arguments[n];if(r!==i&&null!==r)for(var s in r)r.hasOwnProperty(s)&&(e[s]=r[s])}return e}):Object.assign;var dt=a(((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t,e,n)=>{var arguments=[t,e,n];for(var r=Object.keys(e),s=0;s<r.length;)(!n||n&&t[r[s]]===i)&&(t[r[s]]=e[r[s]]),s++;return t}),"extend","Use `assign`."),vt=a(((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t,e)=>{var arguments=[t,e];return dt(t,e,!0)}),"merge","Use `assign`."),mt=1,gt=/mobile|tablet|ip(ad|hone|od)|android/i,Tt="ontouchstart"in t,yt=E(t,"PointerEvent")!==i,Et=Tt&&gt.test(navigator.userAgent),It="touch",At="pen",_t="mouse",wt="kinect",Dt=25,bt=1,St=2,Pt=4,Ct=8,xt=1,Rt=2,Ot=4,zt=8,Mt=16,Nt=Rt|Ot,Xt=zt|Mt,Yt=Nt|Xt,Ft=["x","y"],Wt=["clientX","clientY"];_.prototype={handler:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];}),init:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];this.evEl&&p(this.element,this.evEl,this.domHandler),this.evTarget&&p(this.target,this.evTarget,this.domHandler),this.evWin&&p(A(this.element),this.evWin,this.domHandler)}),destroy:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];this.evEl&&f(this.element,this.evEl,this.domHandler),this.evTarget&&f(this.target,this.evTarget,this.domHandler),this.evWin&&f(A(this.element),this.evWin,this.domHandler)})};var qt={mousedown:bt,mousemove:St,mouseup:Pt},kt="mousedown",Ht="mousemove mouseup";u(Y,_,{handler:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=qt[t.type];e&bt&&0===t.button&&(this.pressed=!0),e&St&&1!==t.which&&(e=Pt),this.pressed&&this.allow&&(e&Pt&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:_t,srcEvent:t}))})});var Lt={pointerdown:bt,pointermove:St,pointerup:Pt,pointercancel:Ct,pointerout:Ct},Ut={2:It,3:At,4:_t,5:wt},Vt="pointerdown",jt="pointermove pointerup pointercancel";t.MSPointerEvent&&!t.PointerEvent&&(Vt="MSPointerDown",jt="MSPointerMove MSPointerUp MSPointerCancel"),u(F,_,{handler:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=this.store,n=!1,i=t.type.toLowerCase().replace("ms",""),r=Lt[i],s=Ut[t.pointerType]||t.pointerType,o=s==It,a=g(e,t.pointerId,"pointerId");r&bt&&(0===t.button||o)?0>a&&(e.push(t),a=e.length-1):r&(Pt|Ct)&&(n=!0),0>a||(e[a]=t,this.callback(this.manager,r,{pointers:e,changedPointers:[t],pointerType:s,srcEvent:t}),n&&e.splice(a,1))})});var Gt={touchstart:bt,touchmove:St,touchend:Pt,touchcancel:Ct},Zt="touchstart",Bt="touchstart touchmove touchend touchcancel";u(W,_,{handler:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=Gt[t.type];if(e===bt&&(this.started=!0),this.started){var n=q.call(this,t,e);e&(Pt|Ct)&&n[0].length-n[1].length===0&&(this.started=!1),this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:It,srcEvent:t})}})});var $t={touchstart:bt,touchmove:St,touchend:Pt,touchcancel:Ct},Jt="touchstart touchmove touchend touchcancel";u(k,_,{handler:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=$t[t.type],n=H.call(this,t,e);n&&this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:It,srcEvent:t})})}),u(L,_,{handler:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t,e,n)=>{var arguments=[t,e,n];var i=n.pointerType==It,r=n.pointerType==_t;if(i)this.mouse.allow=!1;else if(r&&!this.mouse.allow)return;e&(Pt|Ct)&&(this.mouse.allow=!0),this.callback(t,e,n)}),destroy:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];this.touch.destroy(),this.mouse.destroy()})});var Kt=E(ht.style,"touchAction"),Qt=Kt!==i,te="compute",ee="auto",ne="manipulation",ie="none",re="pan-x",se="pan-y";U.prototype={set:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];t==te&&(t=this.compute()),Qt&&this.manager.element.style&&(this.manager.element.style[Kt]=t),this.actions=t.toLowerCase().trim()}),update:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];this.set(this.manager.options.touchAction)}),compute:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];var t=[];return o(this.manager.recognizers,((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((e)=>{var arguments=[e];c(e.options.enable,[e])&&(t=t.concat(e.getTouchAction()))})),V(t.join(" "))}),preventDefaults:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];if(!Qt){var e=t.srcEvent,n=t.offsetDirection;if(this.manager.session.prevented)return void e.preventDefault();var i=this.actions,r=v(i,ie),s=v(i,se),o=v(i,re);if(r){var a=1===t.pointers.length,u=t.distance<2,h=t.deltaTime<250;if(a&&u&&h)return}if(!o||!s)return r||s&&n&Nt||o&&n&Xt?this.preventSrc(e):void 0}}),preventSrc:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];this.manager.session.prevented=!0,t.preventDefault()})};var oe=1,ae=2,ue=4,he=8,ce=he,le=16,pe=32;j.prototype={defaults:{},set:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];return at(this.options,t),this.manager&&this.manager.touchAction.update(),this}),recognizeWith:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];if(s(t,"recognizeWith",this))return this;var e=this.simultaneous;return t=B(t,this),e[t.id]||(e[t.id]=t,t.recognizeWith(this)),this}),dropRecognizeWith:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];return s(t,"dropRecognizeWith",this)?this:(t=B(t,this),delete this.simultaneous[t.id],this)}),requireFailure:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];if(s(t,"requireFailure",this))return this;var e=this.requireFail;return t=B(t,this),-1===g(e,t)&&(e.push(t),t.requireFailure(this)),this}),dropRequireFailure:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];if(s(t,"dropRequireFailure",this))return this;t=B(t,this);var e=g(this.requireFail,t);return e>-1&&this.requireFail.splice(e,1),this}),hasRequireFailures:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];return this.requireFail.length>0}),canRecognizeWith:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];return!!this.simultaneous[t.id]}),emit:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=(e)=>{var arguments=[e];n.manager.emit(e,t)};e.prototype=Function.apply(0).prototype;var n=this,i=this.state;he>i&&e(n.options.event+G(i)),e(n.options.event),t.additionalEvent&&e(t.additionalEvent),i>=he&&e(n.options.event+G(i))}),tryEmit:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];return this.canEmit()?this.emit(t):void(this.state=pe)}),canEmit:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];for(var t=0;t<this.requireFail.length;){if(!(this.requireFail[t].state&(pe|oe)))return!1;t++}return!0}),recognize:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=at({},t);return c(this.options.enable,[this,e])?(this.state&(ce|le|pe)&&(this.state=oe),this.state=this.process(e),void(this.state&(ae|ue|he|le)&&this.tryEmit(e))):(this.reset(),void(this.state=pe))}),process:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];}),getTouchAction:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];}),reset:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];})},u($,j,{defaults:{pointers:1},attrTest:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=this.options.pointers;return 0===e||t.pointers.length===e}),process:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=this.state,n=t.eventType,i=e&(ae|ue),r=this.attrTest(t);return i&&(n&Ct||!r)?e|le:i||r?n&Pt?e|he:e&ae?e|ue:ae:pe})}),u(J,$,{defaults:{event:"pan",threshold:10,pointers:1,direction:Yt},getTouchAction:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];var t=this.options.direction,e=[];return t&Nt&&e.push(se),t&Xt&&e.push(re),e}),directionTest:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=this.options,n=!0,i=t.distance,r=t.direction,s=t.deltaX,o=t.deltaY;return r&e.direction||(e.direction&Nt?(r=0===s?xt:0>s?Rt:Ot,n=s!=this.pX,i=Math.abs(t.deltaX)):(r=0===o?xt:0>o?zt:Mt,n=o!=this.pY,i=Math.abs(t.deltaY))),t.direction=r,n&&i>e.threshold&&r&e.direction}),attrTest:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];return $.prototype.attrTest.call(this,t)&&(this.state&ae||!(this.state&ae)&&this.directionTest(t))}),emit:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];this.pX=t.deltaX,this.pY=t.deltaY;var e=Z(t.direction);e&&(t.additionalEvent=this.options.event+e),this._super.emit.call(this,t)})}),u(K,$,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];return[ie]}),attrTest:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];return this._super.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||this.state&ae)}),emit:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];if(1!==t.scale){var e=t.scale<1?"in":"out";t.additionalEvent=this.options.event+e}this._super.emit.call(this,t)})}),u(Q,j,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];return[ee]}),process:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=this.options,n=t.pointers.length===e.pointers,i=t.distance<e.threshold,s=t.deltaTime>e.time;if(this._input=t,!i||!n||t.eventType&(Pt|Ct)&&!s)this.reset();else if(t.eventType&bt)this.reset(),this._timer=r(((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];this.state=ce,this.tryEmit()}),e.time,this);else if(t.eventType&Pt)return ce;return pe}),reset:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];clearTimeout(this._timer)}),emit:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];this.state===ce&&(t&&t.eventType&Pt?this.manager.emit(this.options.event+"up",t):(this._input.timeStamp=ft(),this.manager.emit(this.options.event,this._input)))})}),u(tt,$,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];return[ie]}),attrTest:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];return this._super.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||this.state&ae)})}),u(et,$,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Nt|Xt,pointers:1},getTouchAction:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];return J.prototype.getTouchAction.call(this)}),attrTest:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e,n=this.options.direction;return n&(Nt|Xt)?e=t.overallVelocity:n&Nt?e=t.overallVelocityX:n&Xt&&(e=t.overallVelocityY),this._super.attrTest.call(this,t)&&n&t.offsetDirection&&t.distance>this.options.threshold&&t.maxPointers==this.options.pointers&&pt(e)>this.options.velocity&&t.eventType&Pt}),emit:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=Z(t.offsetDirection);e&&this.manager.emit(this.options.event+e,t),this.manager.emit(this.options.event,t)})}),u(nt,j,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];return[ne]}),process:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=this.options,n=t.pointers.length===e.pointers,i=t.distance<e.threshold,s=t.deltaTime<e.time;if(this.reset(),t.eventType&bt&&0===this.count)return this.failTimeout();if(i&&s&&n){if(t.eventType!=Pt)return this.failTimeout();var o=this.pTime?t.timeStamp-this.pTime<e.interval:!0,a=!this.pCenter||z(this.pCenter,t.center)<e.posThreshold;this.pTime=t.timeStamp,this.pCenter=t.center,a&&o?this.count+=1:this.count=1,this._input=t;var u=this.count%e.taps;if(0===u)return this.hasRequireFailures()?(this._timer=r(((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];this.state=ce,this.tryEmit()}),e.interval,this),ae):ce}return pe}),failTimeout:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];return this._timer=r(((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];this.state=pe}),this.options.interval,this),pe}),reset:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];clearTimeout(this._timer)}),emit:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];this.state==ce&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))})}),it.VERSION="2.0.6",it.defaults={domEvents:!1,touchAction:te,enable:!0,inputTarget:null,inputClass:null,preset:[[tt,{enable:!1}],[K,{enable:!1},["rotate"]],[et,{direction:Nt}],[J,{direction:Nt},["swipe"]],[nt],[nt,{event:"doubletap",taps:2},["tap"]],[Q]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var fe=1,de=2;rt.prototype={set:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];return at(this.options,t),t.touchAction&&this.touchAction.update(),t.inputTarget&&(this.input.destroy(),this.input.target=t.inputTarget,this.input.init()),this}),stop:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];this.session.stopped=t?de:fe}),recognize:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];var e=this.session;if(!e.stopped){this.touchAction.preventDefaults(t);var n,i=this.recognizers,r=e.curRecognizer;(!r||r&&r.state&ce)&&(r=e.curRecognizer=null);for(var s=0;s<i.length;)n=i[s],e.stopped===de||r&&n!=r&&!n.canRecognizeWith(r)?n.reset():n.recognize(t),!r&&n.state&(ae|ue|he)&&(r=e.curRecognizer=n),s++}}),get:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];if(t instanceof j)return t;for(var e=this.recognizers,n=0;n<e.length;n++)if(e[n].options.event==t)return e[n];return null}),add:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];if(s(t,"add",this))return this;var e=this.get(t.options.event);return e&&this.remove(e),this.recognizers.push(t),t.manager=this,this.touchAction.update(),t}),remove:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];if(s(t,"remove",this))return this;if(t=this.get(t)){var e=this.recognizers,n=g(e,t);-1!==n&&(e.splice(n,1),this.touchAction.update())}return this}),on:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t,e)=>{var arguments=[t,e];var n=this.handlers;return o(m(t),((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];n[t]=n[t]||[],n[t].push(e)})),this}),off:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t,e)=>{var arguments=[t,e];var n=this.handlers;return o(m(t),((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t)=>{var arguments=[t];e?n[t]&&n[t].splice(g(n[t],e),1):delete n[t]})),this}),emit:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})((t,e)=>{var arguments=[t,e];this.options.domEvents&&ot(t,e);var n=this.handlers[t]&&this.handlers[t].slice();if(n&&n.length){e.type=t,e.preventDefault=()=>{var arguments=[];e.srcEvent.preventDefault()},whamz=(e.preventDefault.prototype=Function.apply(0).prototype,e.preventDefault);for(var i=0;i<n.length;)n[i](e),i++}}),destroy:((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];this.element&&st(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null})},at(it,{INPUT_START:bt,INPUT_MOVE:St,INPUT_END:Pt,INPUT_CANCEL:Ct,STATE_POSSIBLE:oe,STATE_BEGAN:ae,STATE_CHANGED:ue,STATE_ENDED:he,STATE_RECOGNIZED:ce,STATE_CANCELLED:le,STATE_FAILED:pe,DIRECTION_NONE:xt,DIRECTION_LEFT:Rt,DIRECTION_RIGHT:Ot,DIRECTION_UP:zt,DIRECTION_DOWN:Mt,DIRECTION_HORIZONTAL:Nt,DIRECTION_VERTICAL:Xt,DIRECTION_ALL:Yt,Manager:rt,Input:_,TouchAction:U,TouchInput:k,MouseInput:Y,PointerEventInput:F,TouchMouseInput:L,SingleTouchInput:W,Recognizer:j,AttrRecognizer:$,Tap:nt,Pan:J,Swipe:et,Pinch:K,Rotate:tt,Press:Q,on:p,off:f,each:o,merge:vt,extend:dt,assign:at,inherit:u,bindFn:h,prefixed:E});var ve="undefined"!=typeof t?t:"undefined"!=typeof self?self:{};ve.Hammer=it,"function"==typeof define&&define.amd?define(((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(()=>{var arguments=[];return it})):"undefined"!=typeof module&&module.exports?module.exports=it:t[n]=it})(window,document,"Hammer");