function he(){import("data:text/javascript,")}const U=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const h of n)if(h.type==="childList")for(const o of h.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const h={};return n.integrity&&(h.integrity=n.integrity),n.referrerpolicy&&(h.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?h.credentials="include":n.crossorigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function i(n){if(n.ep)return;n.ep=!0;const h=t(n);fetch(n.href,h)}};U();var r=(s=>(s.T="t",s.TL="tl",s.TR="tr",s.B="b",s.BL="bl",s.BR="br",s.L="l",s.LT="lt",s.LB="lb",s.R="r",s.RT="rt",s.RB="rb",s))(r||{}),$=(s=>(s.HOVER="hover",s.CLICK="click",s))($||{});const K=typeof window<"u"&&typeof document<"u";function z(s){return typeof s=="string"||s instanceof String}function G(s){return typeof s=="function"}let J=!1;if(K)try{const s=Object.defineProperty({},"once",{get(){J=!0}});window.addEventListener("test",null,s)}catch(s){}const q=new Map;function Q(s){q.has(s)&&(q.get(s).forEach(e=>e.destroy()),q.delete(s))}const Z=/([\w-]+)?(?:#([\w-]+))?((?:\.(?:[\w-]+))*)/;function I(s,e,t,i=""){let n=[];s&&(n=Z.exec(s)||[]);const h=document.createElement(n[1]||"div");return n[2]&&(h.id=n[3]),n[3]&&(h.className=n[3].replace(/\./g,` ${i}`).trim()),e&&Object.keys(e).forEach(o=>{const l=e[o];l!==void 0&&(o==="selected"?l&&h.setAttribute(o,"true"):h.setAttribute(o,l))}),t&&(z(t)?h.innerHTML=t:t.forEach(o=>h.appendChild(o))),h}function p(s,e="",t=""){if(e=e.trim(),!e)return s;if(s.classList)e.split(" ").forEach(i=>s.classList.add(t+i));else{const i=s.className&&s.className.baseVal||"";s.setAttribute("class",(i?`${i} `:"")+e.split(" ").map(n=>t+n).join(" "))}return s}function S(s,e,t=""){return s.classList.remove(t+e),s}class V{constructor(e,t,i,n){this.el=e,this.start=t,this.move=i,this.end=n,this.pending=!1,this.downHandler=h=>{this.el.setPointerCapture(h.pointerId),this.el.addEventListener("pointermove",this.moveHandler,!0),this.el.addEventListener("pointerup",this.upHandler,!0),this.el.addEventListener("pointercancel",this.upHandler,!0),this.start(h)},this.moveHandler=h=>{this.lastEv=h,!this.pending&&(this.pending=!0,this.rafId=requestAnimationFrame(this.handlerMove))},this.handlerMove=()=>{this.move(this.lastEv),this.pending=!1},this.upHandler=h=>{this.removePointerEvents(),this.pending=!1,this.end&&(cancelAnimationFrame(this.rafId),this.end(h))},this.el=e,this.start=t,this.move=i,this.end=n,e.addEventListener("pointerdown",this.downHandler,!0)}removePointerEvents(){this.el.removeEventListener("pointermove",this.moveHandler,!0),this.el.removeEventListener("pointerup",this.upHandler,!0),this.el.removeEventListener("pointercancel",this.upHandler,!0)}destroy(){!this.el||(this.el.removeEventListener("pointerdown",this.downHandler,!0),this.removePointerEvents(),this.el=null)}}function N(s,e=0,t=1){return Math.max(Math.min(s,t),e)}function H(s,e){let t=!1,i=!0,n=null;return function(){if(n=arguments,i)return i=!1,s.apply(e,n);t||(t=!0,requestAnimationFrame(()=>{s.apply(e,n),t=!1}))}}function P(s,e,t=!1){const i=[];return Object.keys(s).forEach(n=>{s[n]!==e[n]&&(i.push([n,s[n],e[n]]),t&&(e[n]=s[n]))}),i}K&&"queueMicrotask"in window&&G(queueMicrotask);function W(s){const e={container:document.body,placement:r.T,autoPlacement:!0,autoUpdate:!0,autoScroll:!0,clickOutsideClose:!0,closeAni:!0,enterable:!0,maxHeight:!0,...s};return e.translate||(e.translate=[0,0]),e}function R(s,e){const t=I();return e&&p(t,e),Object.assign(t.style,{width:"10px",height:"10px",transform:"rotate(45deg)",transformOrigin:"center",...s}),t}class ee{constructor(e){this.opened=!1,this.isAnimating=!1,this.closed=!0,this.popHide=!1,this.arrowHide=!1,this.onScroll=H(()=>{this.config.closeOnScroll?this.close():this.update()}),this.onTriClick=()=>{this.opened?this.closeWithDelay():this.openWithDelay()},this.onTriEnter=()=>{this.clearOCTimer(),this.isAnimating&&(this.closed=!1),!this.opened&&this.openWithDelay()},this.onTriLeave=()=>{this.clearOCTimer(),this.isAnimating&&(this.closed=!0),this.opened&&this.closeWithDelay()},this.clearOCTimer=()=>{clearTimeout(this.openTimer),clearTimeout(this.closeTimer)},this.removeDocClick=()=>{document.removeEventListener("pointerdown",this.onDocClick)},this.onDocClick=({target:t})=>{var o,l;const{config:i}=this,{onClickOutside:n,clickOutsideClose:h}=i;if(n||h){if(((o=this.el)==null?void 0:o.contains(t))||this.isTriggerEl&&((l=i.trigger)==null?void 0:l.contains(t))||i.clickOutsideIgnoreEl&&i.clickOutsideIgnoreEl.contains(t))return;n==null||n(),h&&this.closeWithDelay()}},this.onShowTransitionEnd=()=>{const{cssName:t,el:i}=this,{onEntered:n}=this.config;S(i,t.enterActive),S(i,t.enterTo),this.isAnimating=!1,n&&n(),this.closed&&this.closeWithDelay()},this.onHideTransitionEnd=()=>{const{cssName:t,config:i,el:n}=this,{onExited:h}=i;this.hide(),S(n,t.exitActive),S(n,t.exitTo),this.isAnimating=!1,h&&h(),this.closed||this.openWithDelay()},e&&this.init(e)}init(e){e=this.config=W(e),this.cel=I();const{style:t}=this.cel;t.position="absolute",t.left=t.top="0";const{content:i,container:n,trigger:h}=e;e.overflowHidden==null&&(e.overflowHidden=ne(n)),this.el=this.cel.appendChild(I()),this.el.appendChild(i),this.isTriggerEl=h instanceof Element,e.autoUpdate&&this.observe(),this.needListenScroll()&&(this.scrollEls=F(h,n)),e.arrow&&(this.arrowEl=Y(),this.arrowEl.appendChild(e.arrow),this.el.appendChild(this.arrowEl)),this.setCssName(),this.addTriEv(),this.addEnterEv(),e.open&&requestAnimationFrame(()=>this.open()),e.keepDom&&(k(this.cel),n.appendChild(this.cel))}update(){this.opened&&!this.isAnimating&&this.open()}updateConfig(e){const t=P(e,this.config,!0);!t.length||(t.forEach(([i,n,h])=>{var o;switch(i){case"content":this.el.removeChild(h),n&&this.el.appendChild(n);break;case"emit":this.isTriggerEl&&(this.removeEmitEv(),n&&this.addTriEv()),this.removeEnterEv(),this.addEnterEv();break;case"container":n||(e.container=document.body),this.ro&&(this.ro.unobserve(h),this.ro.observe(e.container));break;case"triggerOpenClass":if(this.opened&&this.isTriggerEl){const{trigger:l}=this.config;h&&S(l,h),n&&p(l,n)}break;case"enterable":this.removeEnterEv(),n&&this.addEnterEv();break;case"keepDom":n?this.opened||(k(this.cel),e.container.appendChild(this.cel)):this.opened||(e.container.removeChild(this.cel),A(this.cel));break;case"trigger":{const l=this.isTriggerEl,{triggerOpenClass:a}=this.config;if(l&&(this.removeEmitEv(h),a&&S(h,a)),this.isTriggerEl=n instanceof Element,this.ro&&(l&&this.ro.unobserve(h),this.isTriggerEl&&this.ro.observe(n)),this.isTriggerEl&&(this.addTriEv(),this.opened&&a&&p(h,a)),this.needListenScroll()){if(!this.scrollEls){const b=this.config;this.scrollEls=F(b.trigger,b.container)}}else this.scrollEls&&(this.removeScrollEv(),this.scrollEls=void 0)}break;case"autoScroll":case"closeOnScroll":if(this.needListenScroll()){if(!this.scrollEls){const a=this.config;this.scrollEls=F(a.trigger,a.container),this.opened&&((o=this.scrollEls)==null||o.forEach(m=>{m.addEventListener("scroll",this.onScroll,{passive:!0})}))}}else this.scrollEls&&(this.removeScrollEv(),this.scrollEls=void 0);break;case"arrow":this.arrowEl&&(this.arrowEl.removeChild(h),n||(this.el.removeChild(this.arrowEl),this.arrowEl=void 0)),n&&(this.arrowEl=this.arrowEl||Y(),this.arrowEl.appendChild(n),this.el.appendChild(this.arrowEl));break;case"autoUpdate":n?this.ro||this.observe():this.ro&&(this.ro.disconnect(),this.ro=void 0);break;case"cssName":this.setCssName();break;case"disabled":n&&this.disable();break;case"maxHeight":if(!n){const{style:l}=e.content;l&&(l.maxHeight="")}break;case"maxWidth":if(!n){const{style:l}=e.content;l&&(l.maxWidth="")}break}}),this.update())}destroy(){var t,i;const{container:e}=this.config;if(this.ro&&(this.ro.disconnect(),this.ro=void 0),this.opened)try{e.removeChild(this.cel)}catch(n){}cancelAnimationFrame(this.showRaf),cancelAnimationFrame(this.hideRaf),(t=this.clearShow)==null||t.call(this),(i=this.clearHide)==null||i.call(this),this.isAnimating=!0,this.opened=!1,this.removeScrollEv(),this.removeDocClick(),this.removeEmitEv(),this.removeEnterEv(),this.drag&&(this.drag.destroy(),this.drag=void 0),Q(this)}open(){var u;if(this.config.disabled)return;this.closed=!1;const{config:e,cssName:t,opened:i,el:n,arrowEl:h}=this,{container:o,trigger:l}=e,a=!i;if(a){if(this.isAnimating)return;this.show(),(u=this.scrollEls)==null||u.forEach(C=>{C.addEventListener("scroll",this.onScroll,{passive:!0})}),document.addEventListener("pointerdown",this.onDocClick)}const m=e.content.style,b=m&&e.maxHeight,w=m&&e.maxWidth;b&&(m.maxHeight=""),w&&(m.maxWidth=""),this.opened=!0;const c=n.getBoundingClientRect(),T=o.getBoundingClientRect(),v=h==null?void 0:h.getBoundingClientRect();let f=l.getBoundingClientRect();if(this.isTriggerEl&&(f={left:f.left-T.left,top:f.top-T.top,width:f.width,height:f.height},e.triggerOpenClass&&p(l,e.triggerOpenClass)),this.isAnimating=!0,a&&t){const{onBeforeEnter:C}=e;C&&C(),p(n,t.enterFrom),this.showRaf=requestAnimationFrame(()=>{S(n,t.enterFrom),p(n,t.enterActive),p(n,t.enterTo);const x=this.getTransitionInfo(n,this.showTransInfo);this.showTransInfo=x.info,this.clearShow=x.clear,x.promise.then(this.onShowTransitionEnd)})}else requestAnimationFrame(()=>{this.isAnimating=!1});const d=e.useTriggerPos?{xy:[Math.round(f.left),Math.round(f.top)],position:e.placement,maxHeight:b?T.height-f.top:0,maxWidth:w?T.width-f.left:0}:ie(e.placement,T,f,c,e.translate,e.autoPlacement,e.overflowHidden,e.coverTrigger,v,e.hideOnInvisible,e.changePosOnly,b,w),{onBeforePosition:y,onOpen:g}=e;y&&y(d),t&&d.position!==this.prevP&&(this.prevP&&S(n,`${e.cssName}-${this.prevP}`),this.prevP=d.position,p(n,`${e.cssName}-${d.position}`));const{xy:E}=d;if(E){if(this.popHide&&(this.popHide=!1,A(this.cel)),this.cel.style.transform=`translate3d(${E[0]}px,${E[1]}px,0)`,b&&d.maxHeight&&(m.maxHeight=`${d.maxHeight}px`),w&&d.maxWidth&&(m.maxWidth=`${d.maxWidth}px`),a&&e.dragEl){const C=[],x=[],B=T.width-c.width,L=T.height-c.height;this.drag=new V(e.dragEl,D=>{C[0]=E[0]-D.clientX,C[1]=E[1]-D.clientY},D=>{x[0]=Math.round(N(C[0]+D.clientX,0,B)),x[1]=Math.round(N(C[1]+D.clientY,0,L)),this.cel.style.transform=`translate3d(${x[0]}px,${x[1]}px,0)`},()=>{E[0]=x[0],E[1]=x[1]})}}else this.popHide||(k(this.cel),this.popHide=!0);h&&(d.arrowXY?(this.arrowHide&&(this.arrowHide=!1,A(h)),h.style.transform=`translate(${d.arrowXY[0]}px,${d.arrowXY[1]}px)`):this.arrowHide||(this.arrowHide=!0,k(h))),a&&g&&g()}close(){if(this.closed=!0,this.isAnimating||!this.opened)return;this.opened=!1;const{config:e,cssName:t,el:i}=this,{onClose:n}=e;if(e.closeAni&&t){const{onBeforeExit:h}=e;h&&h(),p(i,t.exitFrom),this.isAnimating=!0,this.hideRaf=requestAnimationFrame(()=>{S(i,t.exitFrom),p(i,t.exitActive),p(i,t.exitTo);const o=this.getTransitionInfo(i,this.hideTransInfo);this.hideTransInfo=o.info,this.clearHide=o.clear,o.promise.then(this.onHideTransitionEnd)})}else this.hide();this.isTriggerEl&&e.triggerOpenClass&&S(e.trigger,e.triggerOpenClass),this.removeScrollEv(),this.removeDocClick(),this.drag&&(this.drag.destroy(),this.drag=void 0),n&&n(),document.removeEventListener("pointerdown",this.onDocClick)}toggle(){this.opened?this.close():this.open()}enable(){this.config.disabled=!1}disable(){this.config.disabled=!0,this.close()}openWithDelay(){this.clearOCTimer();const{openDelay:e}=this.config;e?this.openTimer=setTimeout(()=>{this.open()},e):this.open()}closeWithDelay(){this.clearOCTimer();const{closeDelay:e}=this.config;e?this.closeTimer=setTimeout(()=>{this.close()},e):this.close()}show(){const{config:e}=this;e.keepDom?A(this.cel):e.container.appendChild(this.cel)}hide(){const{config:e}=this;e.keepDom?k(this.cel):e.container.removeChild(this.cel)}removeEmitEv(e){e=e||this.config.trigger,e instanceof Element&&(e.removeEventListener("click",this.onTriClick),e.removeEventListener("mouseenter",this.onTriEnter),e.removeEventListener("mouseleave",this.onTriLeave))}observe(){const{config:e}=this,t=this.ro=new ResizeObserver(()=>this.update());t.observe(this.el),t.observe(e.container),this.isTriggerEl&&t.observe(e.trigger)}addTriEv(){const{config:e}=this;if(this.isTriggerEl&&e.emit){const{trigger:t}=e;e.emit===$.CLICK?t.addEventListener("click",this.onTriClick):(t.addEventListener("mouseenter",this.onTriEnter),t.addEventListener("mouseleave",this.onTriLeave))}}addEnterEv(){const{config:e}=this;e.enterable&&e.emit===$.HOVER&&(this.cel.addEventListener("mouseenter",this.onTriEnter),this.cel.addEventListener("mouseleave",this.onTriLeave))}removeEnterEv(){this.cel.removeEventListener("mouseenter",this.onTriEnter),this.cel.removeEventListener("mouseleave",this.onTriLeave)}removeScrollEv(){var e;(e=this.scrollEls)==null||e.forEach(t=>t.removeEventListener("scroll",this.onScroll))}getTransitionInfo(e,t){let i;return{promise:new Promise(h=>{const{event:o,timeout:l}=t||se(e);if(l){const a=()=>{i==null||i(),h(null)};e.addEventListener(o,a);const m=setTimeout(()=>{i==null||i(),h(null)},l+2);i=()=>{clearTimeout(m),e.removeEventListener(o,a)}}else requestAnimationFrame(h)}),clear:i,info:t}}needListenScroll(){const{config:e}=this;return this.isTriggerEl&&e.container&&(e.autoScroll||e.closeOnScroll)}setCssName(){const{cssName:e}=this.config;this.cssName=e?{enterFrom:`${e}-enter-from`,enterActive:`${e}-enter-active`,enterTo:`${e}-enter-to`,exitFrom:`${e}-exit-from`,exitActive:`${e}-exit-active`,exitTo:`${e}-exit-to`}:void 0}}function O(s,e,t,i){switch(s){case r.T:return[e.left+e.width/2-t.width/2+i[0],e.top-t.height+i[1]];case r.TL:return[e.left+i[0],e.top-t.height+i[1]];case r.TR:return[e.left+e.width-t.width+i[0],e.top-t.height+i[1]];case r.B:return[e.left+e.width/2-t.width/2+i[0],e.top+e.height+i[1]];case r.BL:return[e.left+i[0],e.top+e.height+i[1]];case r.BR:return[e.left+e.width-t.width+i[0],e.top+e.height+i[1]];case r.L:return[e.left-t.width+i[0],e.top+e.height/2-t.height/2+i[1]];case r.LT:return[e.left-t.width+i[0],e.top+i[1]];case r.LB:return[e.left-t.width+i[0],e.top+e.height-t.height+i[1]];case r.R:return[e.left+e.width+i[0],e.top+e.height/2-t.height/2+i[1]];case r.RT:return[e.left+e.width+i[0],e.top+i[1]];case r.RB:return[e.left+e.width+i[0],e.top+e.height-t.height+i[1]];default:return[0,0]}}function X(s){switch(s){case r.T:case r.TL:case r.TR:return r.T;case r.B:case r.BL:case r.BR:return r.B;case r.L:case r.LT:case r.LB:return r.L;case r.R:case r.RT:case r.RB:return r.R;default:return r.T}}function M(s,e){switch(e){case r.T:switch(s){case r.B:return r.T;case r.BL:return r.TL;case r.BR:return r.TR;default:return s}case r.B:switch(s){case r.T:return r.B;case r.TL:return r.BL;case r.TR:return r.BR;default:return s}case r.L:switch(s){case r.R:return r.L;case r.RT:return r.LT;case r.RB:return r.LB;default:return s}case r.R:switch(s){case r.L:return r.R;case r.LT:return r.RT;case r.LB:return r.RB;default:return s}default:return s}}function te(s,e,t,i,n,h,o,l,a,m,b){const w=[document.documentElement.clientWidth||window.innerWidth,document.documentElement.clientHeight||window.innerHeight],c=[l?Math.max(t.left,0):0,l?Math.max(t.top,0):0,l?Math.min(t.left+t.width,w[0]):w[0],l?Math.min(t.top+t.height,w[1]):w[1]],T=t.left+e[0],v=t.top+e[1],f=[T,v,T+i.width,v+i.height],d=t.left+n.left,y=t.top+n.top,g=d+n.width,E=y+n.height;let u=s;if(o===r.T?v<c[1]?c[3]-E+h[1]>=i.height&&E-h[1]>=c[1]?(e[1]=O(r.B,n,i,[h[0],-h[1]])[1],u=M(s,r.B)):a||(e[1]=l?0:-t.top):!a&&f[3]>c[3]&&(e[1]=l?Math.max(t.height-i.height,0):w[1]-t.top-i.height):o===r.B?f[3]>c[3]?y-c[1]-h[1]>=i.height&&y-h[1]<=c[3]?(e[1]=O(r.T,n,i,[h[0],-h[1]])[1],u=M(s,r.T)):a||(e[1]=l?Math.max(t.height-i.height,0):w[1]-t.top-i.height):!a&&v<c[1]&&(e[1]=l?0:-t.top):o===r.L?T<c[0]?c[2]-g+h[0]>=i.width&&g-h[0]>=c[0]?(u=M(s,r.R),e[0]=O(r.R,n,i,[-h[0],h[1]])[0]):a||(e[0]=l?0:-t.left):!a&&f[2]>c[2]&&(e[0]=l?Math.max(t.width-i.width,0):w[0]-t.left+i.width):o===r.R&&(f[2]>c[2]?d-c[0]-h[0]>=i.width&&d-h[0]<=c[2]?(u=M(s,r.L),e[0]=O(r.L,n,i,[-h[0],h[1]])[0]):a||(e[0]=l?Math.max(t.width-i.width,0):w[0]-t.left+i.width):!a&&T<c[0]&&(e[0]=l?0:-t.left)),o===r.T||o===r.B){if(T<c[0]){const B=u===r.BR,L=d-h[0];(B||u===r.TR)&&L>=0&&L+i.width<=c[2]?(e[0]=L-t.left,u=B?r.BL:r.TL):e[0]=l?Math.max(-t.left,0):-t.left}else if(f[2]>c[2]){const B=u===r.BL,L=g-h[0];(B||u===r.TL)&&L<=c[2]&&L-i.width>=c[0]?(e[0]=L-t.left-i.width,u=B?r.BR:r.TR):e[0]=l?c[2]-t.left-i.width:w[0]-t.left+i.width}}else if(o===r.L||o===r.R){if(v<c[1]){const B=u===r.RB,L=y-h[1];(B||u===r.LB)&&L>=c[1]&&L+i.height<=c[3]?(e[1]=L-t.top,u=B?r.RT:r.LT):e[1]=l?Math.max(-t.top,0):-t.top}else if(f[3]>c[3]){const B=u===r.RT,L=E-h[1];(B||u===r.LT)&&L<=c[3]&&L-i.height>=c[1]?(e[1]=L-t.top-i.height,u=B?r.RB:r.LB):e[1]=l?c[3]-t.top-i.height:w[1]-t.top-i.height}}let C=0,x=0;return m&&(o===r.T||u===r.LT||u===r.RT?(C=Math.min(e[1]+i.height,c[3]-c[1]),e[1]<0&&n.top>0&&(e[1]=0)):C=t.height-e[1]),b&&(o===r.L?(x=e[0]+i.width,e[0]<0&&n.left>0&&(e[0]=0)):x=t.width-e[0]),[u,C,x]}function ie(s,e,t,i,n,h=!0,o,l,a,m,b,w,c){const T=t.left>=e.width||t.top>=e.height||t.left+t.width<=0||t.top+t.height<=0;if(m&&T)return{position:s};let v=X(s);l&&(n=[...n],v===r.T?n[1]+=t.height:v===r.B?n[1]-=t.height:v===r.L?n[0]+=t.width:n[0]-=t.width);const f=O(s,t,i,n);let d=0,y=0;h&&([s,d,y]=te(s,f,e,i,t,n,v,o,b,w,c));let g;if(!T&&a){v=X(s),g=[];const E=[a.width/2,a.height/2],u=v===r.L;u||v===r.R?(g[1]=Math.round(t.top+t.height/2-f[1]-E[1]),g[1]<E[1]||g[1]>i.height-a.height-E[1]?g=void 0:g[0]=Math.round((u?y?Math.min(y,i.width):i.width:0)-E[0])):(g[0]=Math.round(t.left+t.width/2-f[0]-E[0]),g[0]<E[0]||g[0]>i.width-a.width-E[0]?g=void 0:g[1]=Math.round((v===r.T?d?Math.min(d,i.height):i.height:0)-E[1]))}return f[0]=Math.round(f[0]),f[1]=Math.round(f[1]),{xy:f,arrowXY:g,position:s,maxHeight:d,maxWidth:y}}function Y(){const s=I(),e=s.style;return e.position="absolute",e.left=e.top="0",e.zIndex="-1",s}function se(s){const e=window.getComputedStyle(s),t=b=>(e[b]||"").split(", "),i=t("transitionDelay"),n=t("transitionDuration"),h=j(i,n),o=t("animationDelay"),l=t("animationDuration"),a=j(o,l),m=Math.max(h,a);return{event:m>0?h>a?"transitionend":"animationend":void 0,timeout:m}}function j(s,e){for(;s.length<e.length;)s=s.concat(s);return Math.max(...e.map((t,i)=>_(t)+_(s[i])))}function _(s){return Number(s.slice(0,-1).replace(",","."))*1e3}function ne(s){const{overflow:e,overflowX:t,overflowY:i}=window.getComputedStyle(s),n=e+i+t;return n.includes("hidden")||n.includes("clip")}function k(s){const{style:e}=s;e.opacity="0",e.pointerEvents="none"}function A(s){const{style:e}=s;e.opacity=e.pointerEvents=""}function re(s){return s.scrollHeight>s.offsetHeight||s.scrollWidth>s.offsetWidth}function F(s,e){const t=[];for(;s&&s!==e;)re(s)&&t.push(s),s=s.parentElement;if(t.length)return t}window.onload=function(){const s=document.querySelector(".container"),e=document.querySelector(".c"),t=document.querySelector("#btn"),i=document.createElement("div");i.classList.add("content");const n=s.getBoundingClientRect();e.scrollTop=(2e3-n.height)/2+10,e.scrollLeft=(2e3-n.width)/2+10;const h=R(void 0,"arrow"),o={container:s,content:i,trigger:t,autoPlacement:!0,autoUpdate:!0,autoScroll:!0,translate:[0,-10],arrow:h,cssName:"fade",placement:r.T,openDelay:0,closeDelay:50,emit:$.CLICK,open:!0},l=new ee(o),a=()=>{l.updateConfig(o)},m=document.querySelector(".section");m.onchange=({target:v})=>{const{name:f,value:d,checked:y}=v;f==="cb"?(d==="arrow"?o.arrow=y?h:void 0:d==="css"?o.cssName=y?"fade":"":o[d]=y,a()):f==="placement"?(o.placement=d,a()):f==="emit"&&(o.emit=d||void 0,a())};const b=document.querySelector(".translate-x-s"),w=document.querySelector(".translate-y-s"),c=document.querySelector(".open-delay"),T=document.querySelector(".close-delay");m.oninput=({target:v})=>{const{name:f,value:d}=v;f==="translateX"?(b.textContent=`${d}px`,o.translate=[Number(d),o.translate[1]],a()):f==="translateY"?(w.textContent=`${d}px`,o.translate=[o.translate[0],Number(d)],a()):f==="openDelay"?(c.textContent=`${d}ms`,o.openDelay=Number(d),a()):f==="closeDelay"&&(T.textContent=`${d}ms`,o.closeDelay=Number(d),a())}};export{he as __vite_legacy_guard};
//# sourceMappingURL=index.477af845.js.map
