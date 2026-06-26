function t(t,e,i,n){var r,o=arguments.length,s=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(s=(o<3?r(s):o>3?r(e,i,s):r(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const s=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new o(i,t,n)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,m=globalThis,_=m.trustedTypes,g=_?_.emptyScript:"",y=m.reactiveElementPolyfillSupport,f=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&l(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const o=n?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,n)=>{if(i)t.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of n){const n=document.createElement("style"),r=e.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=i.cssText,t.appendChild(n)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=n;const o=r.fromAttribute(e,t.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(t,e,i,n=!1,r){if(void 0!==t){const o=this.constructor;if(!1===n&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??b)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,y?.({ReactiveElement:$}),(m.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,k=x.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+C,P=`<${O}>`,M=document,z=()=>M.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,D=Array.isArray,T="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,H=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,I=/"/g,W=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),F=new WeakMap,Y=M.createTreeWalker(M,129);function J(t,e){if(!D(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,n=[];let r,o=2===e?"<svg>":3===e?"<math>":"",s=U;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(s.lastIndex=d,c=s.exec(i),null!==c);)d=s.lastIndex,s===U?"!--"===c[1]?s=N:void 0!==c[1]?s=H:void 0!==c[2]?(W.test(c[2])&&(r=RegExp("</"+c[2],"g")),s=j):void 0!==c[3]&&(s=j):s===j?">"===c[0]?(s=r??U,l=-1):void 0===c[1]?l=-2:(l=s.lastIndex-c[2].length,a=c[1],s=void 0===c[3]?j:'"'===c[3]?I:L):s===I||s===L?s=j:s===N||s===H?s=U:(s=j,r=void 0);const p=s===j&&t[e+1].startsWith("/>")?" ":"";o+=s===U?i+P:l>=0?(n.push(a),i.slice(0,l)+E+i.slice(l)+C+p):i+C+(-2===l?e:p)}return[J(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class K{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let r=0,o=0;const s=t.length-1,a=this.parts,[c,l]=G(t,e);if(this.el=K.createElement(c,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=Y.nextNode())&&a.length<s;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(E)){const e=l[o++],i=n.getAttribute(t).split(C),s=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:s[2],strings:i,ctor:"."===s[1]?et:"?"===s[1]?it:"@"===s[1]?nt:tt}),n.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),n.removeAttribute(t));if(W.test(n.tagName)){const t=n.textContent.split(C),e=t.length-1;if(e>0){n.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],z()),Y.nextNode(),a.push({type:2,index:++r});n.append(t[e],z())}}}else if(8===n.nodeType)if(n.data===O)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=n.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,n){if(e===q)return e;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const o=R(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(e=Z(t,r._$AS(t,e.values),r,n)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??M).importNode(e,!0);Y.currentNode=n;let r=Y.nextNode(),o=0,s=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=i[++s]}o!==a?.index&&(r=Y.nextNode(),o++)}return Y.currentNode=M,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),R(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>D(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new Q(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new K(t)),e}k(t){D(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const r of t)n===e.length?e.push(i=new X(this.O(z()),this.O(z()),this,this.options)):i=e[n],i._$AI(r),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,n){const r=this.strings;let o=!1;if(void 0===r)t=Z(this,t,e,0),o=!R(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const n=t;let s,a;for(t=r[0],s=0;s<r.length-1;s++)a=Z(this,n[i+s],e,s),a===q&&(a=this._$AH[s]),o||=!R(a)||a!==this._$AH[s],a===V?t=V:t!==V&&(t+=(a??"")+r[s+1]),this._$AH[s]=a}o&&!n&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class nt extends tt{constructor(t,e,i,n,r){super(t,e,i,n,r),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??V)===q)return;const i=this._$AH,n=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==V&&(i===V||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const ot=x.litHtmlPolyfillSupport;ot?.(K,X),(x.litHtmlVersions??=[]).push("3.3.3");const st=globalThis;class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let r=n._$litPart$;if(void 0===r){const t=i?.renderBefore??null;n._$litPart$=r=new X(e.insertBefore(z(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}at._$litElement$=!0,at.finalized=!0,st.litElementHydrateSupport?.({LitElement:at});const ct=st.litElementPolyfillSupport;ct?.({LitElement:at}),(st.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},pt=(t=dt,e,i)=>{const{kind:n,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,r,t,!0,i)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const r=this[n];e.call(this,i),this.requestUpdate(n,r,t,!0,i)}}throw Error("Unsupported decorator location: "+n)};function ht(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return ht({...t,state:!0,attribute:!1})}const mt="simple-compact-appliances",_t=["washer","dryer","dishwasher","microwave"],gt={washer:"Washer",dryer:"Dryer",dishwasher:"Dishwasher",microwave:"Microwave"},yt={washer:"mdi:washing-machine",dryer:"mdi:tumble-dryer",dishwasher:"mdi:dishwasher",microwave:"mdi:microwave"},ft={washer:"var(--sca-color-washer, #58a6ff)",dryer:"var(--sca-color-dryer, #f0883e)",dishwasher:"var(--sca-color-dishwasher, #79c0ff)",microwave:"var(--sca-color-microwave, #d29922)"},vt="var(--sca-running, #d0bcff)",bt="var(--sca-on, #a8d5a2)",wt="var(--sca-off, #9e99a3)",$t="var(--sca-warn, #f2b8b8)",xt="var(--sca-temp, #ffcba4)",At={status:{label:"Status",icon:"mdi:clock-outline",entitySlot:"status_entity"},power:{label:"Power",icon:"mdi:flash",entitySlot:"power_entity",interactive:!0},door:{label:"Door",icon:"mdi:door-closed",entitySlot:"door_entity"},temp:{label:"Temp",icon:"mdi:thermometer",entitySlot:"temp_entity"},light:{label:"Light",icon:"mdi:lightbulb-outline",entitySlot:"light_entity",interactive:!0},fan:{label:"Fan",icon:"mdi:fan",entitySlot:"fan_entity",interactive:!0},water:{label:"Water",icon:"mdi:water",entitySlot:"water_entity"},eco:{label:"Eco",icon:"mdi:leaf",entitySlot:"eco_entity",interactive:!0},child_lock:{label:"Child Lock",icon:"mdi:lock-outline",entitySlot:"child_lock_entity",interactive:!0}},kt={washer:["status","power","door","temp"],dryer:["status","power","door","temp"],dishwasher:["status","power","door","temp"],microwave:["status","power","light","fan"]},St=new Set(["run","running","active","on","wash","rinse","spin","dry","cooking","delay_start","delayed_start"]),Et=new Set(["on","open","opened"]),Ct=`${mt}-editor`,Ot={name:"Card title",show_summary:"Show summary tab",default_tab:"Default tab",default_appliance:"Default appliance"},Pt=[{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"show_summary",selector:{boolean:{}}},{name:"default_tab",selector:{select:{mode:"dropdown",options:[{value:"control",label:"Control"},{value:"summary",label:"Summary"}]}}}]}],Mt={type:"Appliance type",name:"Display name",device_id:"Device (auto-discovery)",enabled:"Enabled",power_entity:"Power switch",door_entity:"Door sensor",status_entity:"Status sensor",running_entity:"Running sensor (fallback)",program_entity:"Program select",delay_entity:"Delay start",remaining_entity:"Remaining time sensor",temp_entity:"Temperature sensor",light_entity:"Light",fan_entity:"Fan",water_entity:"Water sensor",eco_entity:"Eco switch",child_lock_entity:"Child lock",controls:"Controls (in display order)",controls_rows:"Rows",controls_per_row:"Controls per row",show_delay:"Show delay timer",delay_min:"Delay min (minutes)",delay_max:"Delay max (minutes)",delay_step:"Delay step (minutes)"},zt=[{type:"grid",name:"",schema:[{name:"type",required:!0,selector:{select:{mode:"dropdown",options:_t.map(t=>({value:t,label:gt[t]}))}}},{name:"enabled",selector:{boolean:{}}}]},{name:"name",selector:{text:{}}},{name:"device_id",selector:{device:{}}},{type:"expandable",name:"",title:"Entity mapping (overrides auto-discovery)",icon:"mdi:link-variant",schema:[{name:"power_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"door_entity",selector:{entity:{domain:["binary_sensor"]}}},{name:"status_entity",selector:{entity:{domain:["sensor"]}}},{name:"running_entity",selector:{entity:{domain:["sensor","binary_sensor"]}}},{name:"program_entity",selector:{entity:{domain:["select","input_select"]}}},{name:"delay_entity",selector:{entity:{domain:["number","input_number"]}}},{name:"remaining_entity",selector:{entity:{domain:["sensor"]}}},{name:"temp_entity",selector:{entity:{domain:["sensor"]}}},{name:"light_entity",selector:{entity:{domain:["light","switch"]}}},{name:"fan_entity",selector:{entity:{domain:["fan","switch"]}}},{name:"water_entity",selector:{entity:{domain:["sensor"]}}},{name:"eco_entity",selector:{entity:{domain:["switch","input_boolean"]}}},{name:"child_lock_entity",selector:{entity:{domain:["switch","lock"]}}}]},{type:"expandable",name:"",title:"Controls grid (which cells, how many rows)",icon:"mdi:view-grid-outline",schema:[{type:"grid",name:"",schema:[{name:"controls_rows",selector:{number:{min:1,max:4,step:1,mode:"box"}}},{name:"controls_per_row",selector:{number:{min:1,max:6,step:1,mode:"box"}}}]},{name:"controls",selector:{select:{multiple:!0,mode:"list",options:["status","power","door","temp","light","fan","water","eco","child_lock"].map(t=>({value:t,label:At[t].label}))}}},{name:"show_delay",selector:{boolean:{}}}]},{type:"expandable",name:"",title:"Delay bounds (minutes)",icon:"mdi:timer-sand",schema:[{type:"grid",name:"",schema:[{name:"delay_min",selector:{number:{min:0,max:720,step:1,mode:"box"}}},{name:"delay_max",selector:{number:{min:15,max:1440,step:15,mode:"box"}}},{name:"delay_step",selector:{number:{min:1,max:60,step:1,mode:"box"}}}]}]}],Rt={enabled:!0,controls_rows:1,controls_per_row:4,show_delay:!0,delay_min:15,delay_max:480,delay_step:15};let Dt=class extends at{constructor(){super(...arguments),this._expanded=0,this._actionsChanged=t=>{if(!1===t.detail.isValid)return;const e=t.detail.value??{},i=Object.values(e),n={...this._config,appliances:(this._config.appliances??[]).map((t,e)=>({...t,start_action:i[e]?.start_action,pause_action:i[e]?.pause_action}))};this._fire(n)},this._topChanged=t=>{const e={...this._config,...t.detail.value};!0===e.show_summary&&delete e.show_summary,"control"===e.default_tab&&delete e.default_tab,""!==e.name&&null!=e.name||delete e.name,this._fire(e)},this._addAppliance=()=>{const t=new Set((this._config.appliances??[]).map(t=>t.type)),e=_t.find(e=>!t.has(e))??_t[0],i={...this._config,appliances:[...this._config.appliances??[],{type:e}]};this._expanded=i.appliances.length-1,this._fire(i)}}setConfig(t){this._config=t}render(){if(!this.hass||!this._config)return B``;const t=this._config.appliances??[],e={show_summary:!1!==this._config.show_summary,default_tab:this._config.default_tab??"control",...this._config};return B`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${Pt}
        .computeLabel=${t=>Ot[t.name]??t.name}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="section-title">Appliances</div>
      ${t.map((t,e)=>this._renderApplianceEditor(t,e))}

      <div class="actions">
        <ha-button @click=${this._addAppliance}>
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          Add appliance
        </ha-button>
      </div>

      <div class="advanced">
        <div class="advanced-title">Advanced YAML — start_action / pause_action</div>
        <div class="advanced-desc">
          Service calls used by the Play/Pause button per appliance. Each appliance gets a
          <code>start_action</code> and <code>pause_action</code> object with
          <code>service</code>, optional <code>service_data</code>, and optional <code>target</code>.
        </div>
        <ha-yaml-editor
          .defaultValue=${this._actionsConfig()}
          @value-changed=${this._actionsChanged}
        ></ha-yaml-editor>
      </div>
    `}_renderApplianceEditor(t,e){const i=this._expanded===e,n=kt[t.type]??kt.washer,r={...Rt,controls:n,...t};return B`
      <div class="appliance-card">
        <div class="appliance-head" @click=${()=>this._expanded=i?-1:e}>
          <ha-icon icon="mdi:${i?"chevron-down":"chevron-right"}"></ha-icon>
          <span class="appliance-head-name">
            ${t.name??gt[t.type]??"Appliance"}
            <span class="appliance-head-type">(${t.type})</span>
          </span>
          <ha-icon-button
            label="Move up"
            @click=${t=>{t.stopPropagation(),this._move(e,-1)}}
            ?disabled=${0===e}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            label="Move down"
            @click=${t=>{t.stopPropagation(),this._move(e,1)}}
            ?disabled=${e===(this._config.appliances?.length??0)-1}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            label="Remove"
            @click=${t=>{t.stopPropagation(),this._remove(e)}}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </ha-icon-button>
        </div>
        ${i?B`
          <div class="appliance-body">
            <ha-form
              .hass=${this.hass}
              .data=${r}
              .schema=${zt}
              .computeLabel=${t=>Mt[t.name]??t.name}
              @value-changed=${t=>this._applianceChanged(e,t)}
            ></ha-form>
          </div>
        `:V}
      </div>
    `}_actionsConfig(){const t={};return(this._config.appliances??[]).forEach((e,i)=>{const n=`${e.type}_${i}`,r={};e.start_action&&(r.start_action=e.start_action),e.pause_action&&(r.pause_action=e.pause_action),t[n]=r}),t}_applianceChanged(t,e){const i=e.detail.value,n={...this._config.appliances[t],...i};for(const[t,e]of Object.entries(Rt))n[t]===e&&delete n[t];const r=kt[n.type]??kt.washer;Array.isArray(n.controls)&&n.controls.length===r.length&&n.controls.every((t,e)=>t===r[e])&&delete n.controls;for(const t of Object.keys(n))""!==n[t]&&void 0!==n[t]||delete n[t];const o={...this._config,appliances:this._config.appliances.map((e,i)=>i===t?n:e)};this._fire(o)}_remove(t){const e={...this._config,appliances:this._config.appliances.filter((e,i)=>i!==t)};this._fire(e)}_move(t,e){const i=[...this._config.appliances],n=t+e;n<0||n>=i.length||([i[t],i[n]]=[i[n],i[t]],this._expanded===t?this._expanded=n:this._expanded===n&&(this._expanded=t),this._fire({...this._config,appliances:i}))}_fire(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}};var Tt;Dt.styles=s`
    :host { display: block; }
    .section-title {
      margin: 18px 0 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .appliance-card {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      margin-bottom: 8px;
      overflow: hidden;
    }
    .appliance-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 8px 8px 12px;
      cursor: pointer;
      user-select: none;
    }
    .appliance-head:hover { background: var(--input-fill-color, rgba(127,127,127,0.06)); }
    .appliance-head-name {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
      text-transform: capitalize;
    }
    .appliance-head-type {
      color: var(--secondary-text-color);
      font-weight: 400;
      margin-left: 6px;
      font-size: 11px;
    }
    .appliance-body {
      padding: 4px 12px 12px;
      border-top: 1px solid var(--divider-color);
    }
    .actions { margin: 10px 0 6px; display: flex; justify-content: flex-start; }
    .advanced {
      margin-top: 18px;
      padding: 12px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .advanced-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin-bottom: 4px;
    }
    .advanced-desc {
      font-size: 11px;
      color: var(--secondary-text-color);
      line-height: 1.6;
      margin-bottom: 10px;
    }
    .advanced-desc code {
      font-family: var(--code-font-family, ui-monospace, "Roboto Mono", monospace);
      font-size: 11px;
      padding: 1px 5px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border-radius: 4px;
    }
    ha-yaml-editor { display: block; }
  `,t([ht({attribute:!1})],Dt.prototype,"hass",void 0),t([ut()],Dt.prototype,"_config",void 0),t([ut()],Dt.prototype,"_expanded",void 0),Dt=t([lt(Ct)],Dt),window.customCards=window.customCards||[],window.customCards.push({type:mt,name:"Simple Compact Appliances",description:"A compact card for controlling household appliances (washer, dryer, dishwasher, microwave).",preview:!1,documentationURL:"https://github.com/priyam13coding/simple-compact-appliances-card"}),console.info(`%c ${mt} %c v0.2.0 `,"color: white; background: #58a6ff; font-weight: 700;","color: #58a6ff; background: white; font-weight: 700;");let Ut=Tt=class extends at{constructor(){super(...arguments),this._tab="control",this._activeAppliance=null,this._programOpen=!1,this._optimistic={},this._outsideClickHandler=t=>{if(!this._programOpen)return;const e=this.shadowRoot?.querySelector(".program-wrapper");if(!e)return;t.composedPath().includes(e)||(this._programOpen=!1,document.removeEventListener("click",this._outsideClickHandler,!0))}}static getConfigElement(){return document.createElement(`${mt}-editor`)}static getStubConfig(t,e){return{appliances:[{type:"washer"}]}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(!Array.isArray(t.appliances)||0===t.appliances.length)throw new Error("You must specify at least one appliance");for(const e of t.appliances)if(!e.type||!_t.includes(e.type))throw new Error(`Invalid appliance type: ${e.type}`);if(this._config={show_summary:!0,default_tab:"control",...t},!this._activeAppliance){const e=t.appliances.find(t=>!1!==t.enabled);this._activeAppliance=this._config.default_appliance??e?.type??t.appliances[0].type}"summary"===this._config.default_tab&&(this._tab="summary")}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._outsideClickHandler,!0)}getCardSize(){return 4}updated(t){if(super.updated(t),!this._config||!this.hass)return;const e=Date.now();let i=!1;const n={...this._optimistic};for(const[t,r]of Object.entries(n))e-r.setAt>Tt.STALE_MS&&(delete n[t],i=!0);i&&(this._optimistic=n)}render(){if(!this._config||!this.hass)return V;const t=this._visibleAppliances();if(0===t.length)return B`
        <ha-card>
          <div class="warning">No appliances enabled. Edit the card to add one.</div>
        </ha-card>
      `;this._activeAppliance&&t.some(t=>t.type===this._activeAppliance)||(this._activeAppliance=t[0].type);const e=!1!==this._config.show_summary;return B`
      <ha-card>
        ${e?this._renderTabs():V}
        ${"control"!==this._tab&&e?this._renderSummaryTab(t):this._renderControlTab(t)}
      </ha-card>
    `}_renderTabs(){return B`
      <div class="tab-bar">
        <button
          class="tab ${"control"===this._tab?"active":""}"
          @click=${()=>{this._tab="control",this._programOpen=!1}}
        >
          <ha-icon icon="mdi:tune-vertical-variant"></ha-icon>
          <span>Control</span>
        </button>
        <button
          class="tab ${"summary"===this._tab?"active":""}"
          @click=${()=>{this._tab="summary",this._programOpen=!1}}
        >
          <ha-icon icon="mdi:view-grid-outline"></ha-icon>
          <span>Summary</span>
        </button>
      </div>
    `}_renderControlTab(t){const e=t.find(t=>t.type===this._activeAppliance)??t[0];return B`
      ${t.length>1?this._renderSelector(t):V}
      ${this._renderApplianceCard(e)}
    `}_renderSelector(t){return B`
      <div class="selector">
        ${t.map(t=>B`
          <button
            class="chip ${t.type===this._activeAppliance?"active":""}"
            style="--chip-color: ${ft[t.type]};"
            @click=${()=>{this._activeAppliance=t.type,this._programOpen=!1}}
            title=${t.name}
          >
            <ha-icon icon=${yt[t.type]}></ha-icon>
            <span class="chip-label">${t.name}</span>
          </button>
        `)}
      </div>
    `}_renderApplianceCard(t){const e=this._getPower(t),i=this._getDoor(t),n=this._getRunning(t),r=this._getRemainingSeconds(t),o=this._getProgram(t),s=this._getDelay(t),a=ft[t.type];return B`
      <div class="appliance" style="--sca-accent: ${a};">

        <!-- Header: tile + name/program + running pill -->
        <div class="app-header">
          <div class="app-id">
            <div class="tile ${e?"tile-on":"tile-off"}">
              <ha-icon icon=${yt[t.type]}></ha-icon>
            </div>
            <div>
              <div class="app-name">${t.name}</div>
              <div class="app-program">${o??"—"}</div>
            </div>
          </div>
          <div class="status-pill ${n?"running":""}">
            ${n&&null!=r?B`<ha-icon icon="mdi:timer-outline"></ha-icon> ${Nt(r)}`:n?B`<ha-icon icon="mdi:play"></ha-icon> Running`:"Standby"}
          </div>
        </div>

        <!-- Status grid: data-driven by app.controls / rows / per_row -->
        ${this._renderStatusGrid(t)}

        <!-- Delay / Program / Play row -->
        ${this._renderControlRow(t,e,i,n,o,s)}

        ${"open"===i?B`<p class="hint warn">Close the door to start</p>`:V}
        ${e?V:B`<p class="hint dim">Turn on power to start</p>`}
      </div>
    `}_renderStatusGrid(t){const e=Math.max(1,t.controls_rows),i=Math.max(1,t.controls_per_row),n=e*i,r=t.controls.slice(0,n);for(;r.length<n;)r.push(null);return B`
      <div class="status-grid" style="grid-template-columns: repeat(${i}, 1fr);">
        ${r.map((e,n)=>{const r=(n%i>0?"cell-border-left ":"")+(Math.floor(n/i)>0?"cell-border-top ":"");if(null==e)return B`<div class="cell cell-empty ${r}"></div>`;const o=this._readControlCell(t,e);return B`
            <div
              class="cell ${o.interactive?"cell-interactive":""} ${r}"
              @click=${o.interactive?o.onClick:void 0}
              title=${o.label}
            >
              <ha-icon icon=${o.icon} style="color: ${o.color};"></ha-icon>
              <span class="cell-value" style="color: ${o.color};">${o.value}</span>
              <span class="cell-label">${o.label}</span>
            </div>
          `})}
      </div>
    `}_readControlCell(t,e){const i=At[e],n=i?.label??e;switch(e){case"status":{const e=this._getRunning(t),i=this._getRemainingSeconds(t);return{label:n,icon:"mdi:clock-outline",color:e?vt:wt,value:e?null!=i?Nt(i):"Running":"Idle",interactive:!1}}case"power":{const e=this._getPower(t);return{label:n,icon:"mdi:flash",color:e?bt:wt,value:e?"On":"Off",interactive:!!t.power_entity,onClick:()=>this._togglePower(t)}}case"door":{const e=this._getDoor(t);return{label:n,icon:"open"===e?"mdi:door-open":"mdi:door-closed",color:null==e?wt:"closed"===e?bt:$t,value:null==e?"—":"closed"===e?"Closed":"Open",interactive:!1}}case"temp":{const e=this._getTemp(t);return{label:n,icon:"mdi:thermometer",color:e?xt:wt,value:e?`${e.value}${e.unit}`:"—",interactive:!1}}case"light":{const e=this._isOn(t.light_entity,`light:${t.type}`);return{label:n,icon:e?"mdi:lightbulb-on":"mdi:lightbulb-outline",color:e?bt:wt,value:t.light_entity?e?"On":"Off":"—",interactive:!!t.light_entity,onClick:()=>this._toggleEntity(t.light_entity,`light:${t.type}`)}}case"fan":{const e=this._isOn(t.fan_entity,`fan:${t.type}`);return{label:n,icon:"mdi:fan",color:e?bt:wt,value:t.fan_entity?e?"On":"Off":"—",interactive:!!t.fan_entity,onClick:()=>this._toggleEntity(t.fan_entity,`fan:${t.type}`)}}case"water":{const e=this._getNumericWithUnit(t.water_entity);return{label:n,icon:"mdi:water",color:e?bt:wt,value:e??"—",interactive:!1}}case"eco":{const e=this._isOn(t.eco_entity,`eco:${t.type}`);return{label:n,icon:"mdi:leaf",color:e?bt:wt,value:t.eco_entity?e?"On":"Off":"—",interactive:!!t.eco_entity,onClick:()=>this._toggleEntity(t.eco_entity,`eco:${t.type}`)}}case"child_lock":{const e=this._isOn(t.child_lock_entity,`child_lock:${t.type}`);return{label:n,icon:e?"mdi:lock":"mdi:lock-open-variant-outline",color:e?$t:wt,value:t.child_lock_entity?e?"On":"Off":"—",interactive:!!t.child_lock_entity,onClick:()=>this._toggleEntity(t.child_lock_entity,`child_lock:${t.type}`)}}default:return{label:n,icon:"mdi:help-circle-outline",color:wt,value:"—",interactive:!1}}}_renderControlRow(t,e,i,n,r,o){const s=e&&"open"!==i,a=this._getProgramOptions(t),c=!(t.show_delay&&null!=t.delay_entity)||n;return B`
      <div class="control-row">
        ${t.show_delay?B`
          <span class="row-label">Delay</span>

          <button
            class="round-btn"
            ?disabled=${c||null!=o&&o<=t.delay_min}
            @click=${()=>this._adjustDelay(t,-t.delay_step)}
            title="Decrease delay"
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>

          <span class="delay-value">
            ${null!=o?function(t){if(t<60)return`${t}m`;const e=Math.floor(t/60),i=t%60;return 0===i?`${e}h`:`${e}h ${i}m`}(o):"—"}
          </span>

          <button
            class="round-btn"
            ?disabled=${c||null!=o&&o>=t.delay_max}
            @click=${()=>this._adjustDelay(t,t.delay_step)}
            title="Increase delay"
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        `:V}

        <!-- Program dropdown -->
        <div class="program-wrapper">
          <button
            class="program-trigger"
            ?disabled=${!t.program_entity||0===a.length}
            @click=${()=>this._toggleProgram()}
            aria-expanded=${this._programOpen}
          >
            <span class="program-text">${r??"—"}</span>
            <ha-icon
              icon="mdi:chevron-down"
              class="chevron ${this._programOpen?"open":""}"
            ></ha-icon>
          </button>
          ${this._programOpen&&a.length>0?B`
            <div class="program-popup" @click=${t=>t.stopPropagation()}>
              ${a.map((e,i)=>B`
                <button
                  class="program-option ${e===r?"selected":""}"
                  style=${i<a.length-1?"border-bottom: 1px solid var(--sca-border);":""}
                  @click=${()=>this._selectProgram(t,e)}
                >${e}</button>
              `)}
            </div>
          `:V}
        </div>

        <!-- Play / Pause -->
        <button
          class="play-btn ${n?"running":""}"
          ?disabled=${!s||(n?!t.pause_action:!t.start_action)}
          @click=${()=>n?this._pause(t):this._start(t)}
          title=${n?"Pause":"Start"}
        >
          <ha-icon icon=${n?"mdi:pause":"mdi:play"}></ha-icon>
        </button>
      </div>
    `}_renderSummaryTab(t){const e=t.filter(t=>this._getRunning(t)).length;return B`
      <div class="summary">
        <div class="summary-header">
          <div class="summary-title">All Appliances</div>
          <div class="summary-sub">${e} active</div>
        </div>
        <div class="summary-list">
          ${t.map(t=>this._renderSummaryRow(t))}
        </div>
      </div>
    `}_renderSummaryRow(t){const e=this._getPower(t),i=this._getDoor(t),n=this._getRunning(t),r=this._getRemainingSeconds(t),o=this._getProgram(t);let s="off",a="Off";return e&&("open"===i?(s="warn",a="Door open"):(s="idle",a="Idle")),B`
      <button
        class="summary-row"
        style="--sca-accent: ${ft[t.type]};"
        @click=${()=>{this._activeAppliance=t.type,this._tab="control",this._programOpen=!1}}
      >
        <div class="row-tile ${n?"tile-running":e?"tile-on":"tile-off"}">
          <ha-icon icon=${yt[t.type]}></ha-icon>
        </div>
        <div class="row-id">
          <div class="row-name">${t.name}</div>
          <div class="row-program">${o??"—"}</div>
        </div>
        <div class="row-status">
          ${n?B`
                <div class="row-time">${null!=r?Nt(r):"Running"}</div>
                <div class="row-time-sub">${null!=r?"remaining":""}</div>
              `:B`<span class="status-tag ${s}">${a}</span>`}
        </div>
        ${n?B`<span class="dot"></span>`:V}
      </button>
    `}_visibleAppliances(){return this._config.appliances.filter(t=>!1!==t.enabled).map(t=>this._resolve(t))}_resolve(t){const e=t.device_id?this._discoverOnDevice(t.device_id,t.type):{};return{type:t.type,name:t.name??gt[t.type],enabled:!1!==t.enabled,power_entity:t.power_entity??e.power_entity,door_entity:t.door_entity??e.door_entity,status_entity:t.status_entity??e.status_entity,running_entity:t.running_entity??e.running_entity,program_entity:t.program_entity??e.program_entity,delay_entity:t.delay_entity??e.delay_entity,remaining_entity:t.remaining_entity??e.remaining_entity,temp_entity:t.temp_entity??e.temp_entity,light_entity:t.light_entity??e.light_entity,fan_entity:t.fan_entity??e.fan_entity,water_entity:t.water_entity??e.water_entity,eco_entity:t.eco_entity??e.eco_entity,child_lock_entity:t.child_lock_entity??e.child_lock_entity,start_action:t.start_action,pause_action:t.pause_action,controls:t.controls??kt[t.type],controls_rows:t.controls_rows??1,controls_per_row:t.controls_per_row??4,show_delay:!1!==t.show_delay,delay_min:t.delay_min??15,delay_max:t.delay_max??480,delay_step:t.delay_step??15}}_discoverOnDevice(t,e){const i=this.hass.entities;if(!i)return{};const n=Object.keys(i).filter(e=>i[e].device_id===t),r=this.hass.states,o={},s=(t,e)=>{for(const i of n)if(t.some(t=>i.startsWith(t+"."))&&r[i]&&e(i))return i},a=(t,...e)=>{const i=t.toLowerCase(),n=(r[t]?.attributes?.friendly_name??"").toString().toLowerCase();return e.some(t=>i.includes(t)||n.includes(t))};return o.power_entity=s(["switch"],t=>a(t,"power","switch")||!0),o.door_entity=s(["binary_sensor"],t=>a(t,"door")),o.status_entity=s(["sensor"],t=>a(t,"state","status","mode")),o.running_entity=o.status_entity,o.program_entity=s(["select","input_select"],t=>a(t,"program","cycle","course","mode")),o.delay_entity=s(["number","input_number"],t=>a(t,"delay")),o.remaining_entity=s(["sensor"],t=>a(t,"remaining","time_left","end_time","finish")),o.temp_entity=s(["sensor"],t=>"temperature"===r[t]?.attributes?.device_class||a(t,"temperature","temp")),o.light_entity=s(["light","switch"],t=>a(t,"light","lamp")),o.fan_entity=s(["fan","switch"],t=>a(t,"fan","vent","hood")),o.water_entity=s(["sensor"],t=>"water"===r[t]?.attributes?.device_class||a(t,"water","rinse")),o.eco_entity=s(["switch"],t=>a(t,"eco")),o.child_lock_entity=s(["switch","lock"],t=>a(t,"child","lock")),o}_getPower(t){const e=this._optimistic[`power:${t.type}`];if(e)return!!e.value;if(!t.power_entity)return!0;const i=this.hass.states[t.power_entity];return!i||"on"===i.state}_getDoor(t){if(!t.door_entity)return null;const e=this.hass.states[t.door_entity];return e?Et.has(e.state.toLowerCase())?"open":"closed":null}_getRunning(t){const e=t.status_entity??t.running_entity;if(!e)return!1;const i=this.hass.states[e];return!!i&&St.has(i.state.toLowerCase())}_getRemainingSeconds(t){if(!t.remaining_entity)return null;const e=this.hass.states[t.remaining_entity];if(!e||"unknown"===e.state||"unavailable"===e.state)return null;if("timestamp"===e.attributes?.device_class){const t=Date.parse(e.state);return isNaN(t)?null:Math.max(0,Math.round((t-Date.now())/1e3))}const i=parseFloat(e.state);if(isNaN(i))return null;const n=(e.attributes?.unit_of_measurement??"").toLowerCase();return n.includes("min")?Math.round(60*i):n.includes("h")?Math.round(3600*i):Math.round(i)}_getProgram(t){const e=this._optimistic[`program:${t.type}`];if(e)return e.value;if(!t.program_entity)return null;const i=this.hass.states[t.program_entity];return i?"unknown"===i.state||"unavailable"===i.state?null:i.state:null}_getProgramOptions(t){if(!t.program_entity)return[];const e=this.hass.states[t.program_entity];return e?.attributes?.options??[]}_getDelay(t){const e=this._optimistic[`delay:${t.type}`];if(e)return e.value;if(!t.delay_entity)return null;const i=this.hass.states[t.delay_entity];if(!i)return null;const n=parseFloat(i.state);return isNaN(n)?null:n}_getTemp(t){if(!t.temp_entity)return null;const e=this.hass.states[t.temp_entity];if(!e)return null;const i=parseFloat(e.state);if(isNaN(i))return null;const n=e.attributes?.unit_of_measurement??"";return{value:String(Math.round(i)),unit:n}}_isOn(t,e){const i=this._optimistic[e];if(i)return!!i.value;if(!t)return!1;const n=this.hass.states[t];return"on"===n?.state}_getNumericWithUnit(t){if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=parseFloat(e.state);if(isNaN(i))return null;const n=e.attributes?.unit_of_measurement??"";return`${Math.round(i)}${n}`}_togglePower(t){if(!t.power_entity)return;const e=this._getPower(t);this._setOptimistic(`power:${t.type}`,!e);const i=t.power_entity.split(".")[0];this.hass.callService(i,e?"turn_off":"turn_on",{entity_id:t.power_entity})}_toggleEntity(t,e){const i=this._isOn(t,e);this._setOptimistic(e,!i);const n=t.split(".")[0];this.hass.callService(n,i?"turn_off":"turn_on",{entity_id:t})}_toggleProgram(){this._programOpen=!this._programOpen,this._programOpen?setTimeout(()=>document.addEventListener("click",this._outsideClickHandler,!0),0):document.removeEventListener("click",this._outsideClickHandler,!0)}_selectProgram(t,e){if(this._programOpen=!1,document.removeEventListener("click",this._outsideClickHandler,!0),!t.program_entity)return;this._setOptimistic(`program:${t.type}`,e);const i=t.program_entity.split(".")[0];this.hass.callService(i,"select_option",{entity_id:t.program_entity,option:e})}_adjustDelay(t,e){if(!t.delay_entity)return;const i=this._getDelay(t)??t.delay_min,n=Math.max(t.delay_min,Math.min(t.delay_max,i+e));if(n===i)return;this._setOptimistic(`delay:${t.type}`,n);const r=t.delay_entity.split(".")[0];this.hass.callService(r,"set_value",{entity_id:t.delay_entity,value:n})}_start(t){this._callAction(t.start_action)}_pause(t){this._callAction(t.pause_action)}_callAction(t){if(!t||!t.service)return;const[e,i]=t.service.split(".");if(!e||!i)return;const n={...t.service_data??{}};t.target&&Object.assign(n,t.target),this.hass.callService(e,i,n)}_setOptimistic(t,e){this._optimistic={...this._optimistic,[t]:{value:e,setAt:Date.now()}}}};function Nt(t){if(t>=3600){const e=Math.floor(t/3600),i=Math.floor(t%3600/60);return 0===i?`${e}h`:`${e}h ${i}m`}const e=Math.floor(t/60),i=t%60;return 0===e?`${i}s`:`${e}:${String(i).padStart(2,"0")}`}Ut.STALE_MS=3e5,Ut.styles=s`
    :host {
      display: block;
      --sca-border:        rgba(127, 127, 127, 0.18);
      --sca-border-strong: rgba(127, 127, 127, 0.28);
      --sca-subtle-bg:     rgba(127, 127, 127, 0.06);
      --sca-hover-bg:      rgba(127, 127, 127, 0.12);
      --sca-radius:        20px;
      --sca-radius-inner:  14px;
      --sca-radius-small:  10px;
      --sca-text-primary:   var(--primary-text-color);
      --sca-text-secondary: var(--secondary-text-color);
      --sca-mono:           ui-monospace, "SF Mono", "Roboto Mono", "JetBrains Mono",
                            Menlo, Consolas, monospace;
    }

    ha-card {
      border-radius: var(--sca-radius);
      overflow: visible;
      padding: 0;
    }

    .warning {
      color: var(--error-color);
      padding: 14px 18px;
      font-size: 0.9rem;
    }

    /* ── Tab bar ────────────────────────────────────────────────────── */
    .tab-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      padding: 8px 8px 0;
    }
    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 4px;
      border: none;
      border-radius: var(--sca-radius-small);
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background 180ms, color 180ms;
    }
    .tab:hover { background: var(--sca-hover-bg); color: var(--sca-text-primary); }
    .tab.active {
      background: color-mix(in srgb, var(--primary-color, #58a6ff) 18%, transparent);
      color: var(--primary-color, #58a6ff);
    }
    .tab ha-icon { --mdc-icon-size: 16px; }

    /* ── Appliance selector ────────────────────────────────────────── */
    .selector {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      gap: 6px;
      padding: 8px;
    }
    .chip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 4px;
      border: none;
      border-radius: var(--sca-radius-small);
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
      font: inherit;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      min-width: 0;
      transition: background 180ms, color 180ms;
    }
    .chip:hover { background: var(--sca-hover-bg); color: var(--sca-text-primary); }
    .chip.active {
      background: color-mix(in srgb, var(--chip-color) 18%, transparent);
      color: var(--chip-color);
    }
    .chip ha-icon { --mdc-icon-size: 16px; }
    .chip-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media (max-width: 360px) {
      .chip-label { display: none; }
    }

    /* ── Appliance card ────────────────────────────────────────────── */
    .appliance {
      padding: 8px 12px 14px;
    }
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 4px 12px;
    }
    .app-id {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .tile {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 200ms;
    }
    .tile ha-icon { --mdc-icon-size: 20px; }
    .tile-on  {
      background: color-mix(in srgb, var(--sca-accent) 22%, transparent);
      color: var(--sca-accent);
    }
    .tile-off {
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
    }
    .app-name {
      font-size: 15px;
      font-weight: 500;
      color: var(--sca-text-primary);
      line-height: 1.15;
      text-transform: capitalize;
    }
    .app-program {
      font-size: 11px;
      color: var(--sca-text-secondary);
      line-height: 1;
      margin-top: 2px;
    }
    .status-pill {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
      font-family: var(--sca-mono);
    }
    .status-pill.running {
      background: color-mix(in srgb, var(--sca-accent) 22%, transparent);
      color: var(--sca-accent);
    }
    .status-pill ha-icon { --mdc-icon-size: 12px; }

    /* ── Status grid ───────────────────────────────────────────────── */
    /* grid-template-columns is set inline per appliance (controls_per_row). */
    .status-grid {
      display: grid;
      border: 1px solid var(--sca-border);
      border-radius: var(--sca-radius-inner);
      overflow: hidden;
      margin-bottom: 10px;
    }
    .cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 10px 4px;
      min-width: 0;
      transition: background 150ms;
    }
    .cell-border-left { border-left: 1px solid var(--sca-border); }
    .cell-border-top  { border-top:  1px solid var(--sca-border); }
    .cell-empty       { background: var(--sca-subtle-bg); }
    .cell-interactive {
      cursor: pointer;
    }
    .cell-interactive:hover { background: var(--sca-hover-bg); }
    .cell ha-icon { --mdc-icon-size: 14px; }
    .cell-value {
      font-size: 11px;
      font-weight: 500;
      line-height: 1.1;
      text-align: center;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cell-label {
      font-size: 9px;
      color: var(--sca-text-secondary);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1;
    }

    /* ── Control row ──────────────────────────────────────────────── */
    .control-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: nowrap;
    }
    .row-label {
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--sca-text-secondary);
      font-weight: 500;
      flex-shrink: 0;
    }
    .round-btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid var(--sca-border-strong);
      background: var(--sca-subtle-bg);
      color: var(--sca-text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 150ms, border-color 150ms, transform 80ms;
      padding: 0;
    }
    .round-btn ha-icon { --mdc-icon-size: 14px; }
    .round-btn:hover:not(:disabled) {
      background: var(--sca-hover-bg);
      border-color: var(--sca-accent);
    }
    .round-btn:active:not(:disabled) { transform: scale(0.92); }
    .round-btn:disabled { opacity: 0.35; cursor: not-allowed; }

    .delay-value {
      width: 44px;
      text-align: center;
      font-size: 12px;
      color: var(--sca-accent);
      font-family: var(--sca-mono);
      font-weight: 500;
      flex-shrink: 0;
    }

    /* program dropdown */
    .program-wrapper {
      position: relative;
      flex: 1;
      min-width: 0;
    }
    .program-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 4px;
      padding: 7px 10px;
      border: 1px solid var(--sca-border);
      background: var(--sca-subtle-bg);
      border-radius: var(--sca-radius-small);
      color: var(--sca-text-primary);
      font: inherit;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
    }
    .program-trigger:hover:not(:disabled) { background: var(--sca-hover-bg); }
    .program-trigger:disabled { opacity: 0.5; cursor: not-allowed; }
    .program-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-transform: capitalize;
    }
    .chevron {
      --mdc-icon-size: 14px;
      color: var(--sca-text-secondary);
      transition: transform 200ms;
      flex-shrink: 0;
    }
    .chevron.open { transform: rotate(180deg); }
    .program-popup {
      position: absolute;
      bottom: calc(100% + 4px);
      left: 0;
      right: 0;
      max-height: 220px;
      overflow-y: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1b1f));
      border: 1px solid var(--sca-border-strong);
      border-radius: var(--sca-radius-small);
      z-index: 1000;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32);
      animation: pop 140ms ease-out;
    }
    @keyframes pop {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .program-option {
      display: block;
      width: 100%;
      padding: 9px 12px;
      background: transparent;
      border: none;
      color: var(--sca-text-secondary);
      font: inherit;
      font-size: 11px;
      text-align: left;
      cursor: pointer;
      text-transform: capitalize;
    }
    .program-option:hover {
      background: var(--sca-hover-bg);
      color: var(--sca-text-primary);
    }
    .program-option.selected {
      color: var(--sca-accent);
      background: color-mix(in srgb, var(--sca-accent) 18%, transparent);
      font-weight: 600;
    }

    /* play / pause */
    .play-btn {
      width: 38px;
      height: 30px;
      border: none;
      border-radius: 10px;
      background: var(--sca-accent);
      color: var(--card-background-color, #fff);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 150ms, transform 80ms;
    }
    .play-btn ha-icon { --mdc-icon-size: 16px; }
    .play-btn.running {
      background: var(--sca-subtle-bg);
      color: var(--sca-text-primary);
      border: 1px solid var(--sca-border-strong);
    }
    .play-btn:active:not(:disabled) { transform: scale(0.92); }
    .play-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* hints */
    .hint {
      margin: 8px 0 0;
      text-align: center;
      font-size: 10px;
    }
    .hint.warn { color: var(--error-color, #f2b8b8); }
    .hint.dim  { color: var(--sca-text-secondary); }

    /* ── Summary ──────────────────────────────────────────────────── */
    .summary { padding: 8px 12px 14px; }
    .summary-header { padding: 6px 4px 10px; }
    .summary-title {
      font-size: 15px;
      font-weight: 500;
      color: var(--sca-text-primary);
    }
    .summary-sub {
      font-size: 11px;
      color: var(--sca-text-secondary);
      margin-top: 2px;
    }
    .summary-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .summary-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: var(--sca-radius-inner);
      background: var(--sca-subtle-bg);
      border: 1px solid var(--sca-border);
      color: var(--sca-text-primary);
      font: inherit;
      cursor: pointer;
      text-align: left;
      width: 100%;
      transition: background 150ms;
    }
    .summary-row:hover { background: var(--sca-hover-bg); }
    .row-tile {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .row-tile ha-icon { --mdc-icon-size: 18px; }
    .tile-running {
      background: color-mix(in srgb, var(--sca-accent) 22%, transparent);
      color: var(--sca-accent);
    }
    .row-id { flex: 1; min-width: 0; }
    .row-name {
      font-size: 13px;
      font-weight: 500;
      text-transform: capitalize;
      line-height: 1.15;
    }
    .row-program {
      font-size: 10px;
      color: var(--sca-text-secondary);
      line-height: 1;
      margin-top: 2px;
      text-transform: capitalize;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .row-status {
      text-align: right;
      flex-shrink: 0;
    }
    .row-time {
      font-size: 12px;
      font-family: var(--sca-mono);
      font-weight: 500;
      color: var(--sca-accent);
    }
    .row-time-sub {
      font-size: 9px;
      color: var(--sca-text-secondary);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .status-tag {
      font-size: 10px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--sca-subtle-bg);
      color: var(--sca-text-secondary);
    }
    .status-tag.warn {
      background: color-mix(in srgb, var(--error-color, #f2b8b8) 18%, transparent);
      color: var(--error-color, #f2b8b8);
    }
    .status-tag.off {
      background: transparent;
      color: var(--sca-text-secondary);
      opacity: 0.6;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--sca-accent);
      box-shadow: 0 0 8px var(--sca-accent);
      flex-shrink: 0;
      animation: pulse 1.6s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.4; }
    }
  `,t([ht({attribute:!1})],Ut.prototype,"hass",void 0),t([ut()],Ut.prototype,"_config",void 0),t([ut()],Ut.prototype,"_tab",void 0),t([ut()],Ut.prototype,"_activeAppliance",void 0),t([ut()],Ut.prototype,"_programOpen",void 0),t([ut()],Ut.prototype,"_optimistic",void 0),Ut=Tt=t([lt(mt)],Ut);export{Ut as SimpleCompactAppliancesCard};
