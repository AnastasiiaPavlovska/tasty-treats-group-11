var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},o=e.parcelRequire78be;null==o&&((o=function(e){if(e in t)return t[e].exports;if(e in n){var o=n[e];delete n[e];var a={id:e,exports:{}};return t[e]=a,o.call(a.exports,a,a.exports),a.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){n[e]=t},e.parcelRequire78be=o);var a={save:(e,t)=>{try{let n=JSON.stringify(t);localStorage.setItem(e,n)}catch(e){console.error("Set state error: ",e.message)}},load:e=>{try{let t=localStorage.getItem(e);return null===t?void 0:JSON.parse(t)}catch(e){console.error("Get state error: ",e.message)}},remove:e=>{try{localStorage.removeItem(e)}catch(e){console.error("Remove item error: ",e.message)}}};let r=new(o("6kfMw")).default;const i="favorites";function l(){return a.load(i)||{}}var s={getLs:l,checkFav:function(e){return(console.log(e),e in l())?(console.log(`Id ${e} in Favorites`),!0):(console.log(`Id ${e} not in Favorites`),!1)},togleFav:function(e){console.log(e);let t=l();return e in t?(delete t[e],a.save(i,t),console.log("Remove from favorites"),0):(r.getRecipeById(e).then(n=>{console.log(n),t[e]=n,a.save(i,t),console.log("Add to favorites")}),console.log(t),1)}},c={},u="Expected a function",d=0/0,g=/^\s+|\s+$/g,f=/^[-+]0x[0-9a-f]+$/i,p=/^0b[01]+$/i,b=/^0o[0-7]+$/i,v=parseInt,m="object"==typeof e&&e&&e.Object===Object&&e,y="object"==typeof self&&self&&self.Object===Object&&self,h=m||y||Function("return this")(),T=Object.prototype.toString,L=Math.max,$=Math.min,M=function(){return h.Date.now()};function w(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function S(e){if("number"==typeof e)return e;if("symbol"==typeof(t=e)||t&&"object"==typeof t&&"[object Symbol]"==T.call(t))return d;if(w(e)){var t,n="function"==typeof e.valueOf?e.valueOf():e;e=w(n)?n+"":n}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(g,"");var o=p.test(e);return o||b.test(e)?v(e.slice(2),o?2:8):f.test(e)?d:+e}c=function(e,t,n){var o=!0,a=!0;if("function"!=typeof e)throw TypeError(u);return w(n)&&(o="leading"in n?!!n.leading:o,a="trailing"in n?!!n.trailing:a),function(e,t,n){var o,a,r,i,l,s,c=0,d=!1,g=!1,f=!0;if("function"!=typeof e)throw TypeError(u);function p(t){var n=o,r=a;return o=a=void 0,c=t,i=e.apply(r,n)}function b(e){var n=e-s,o=e-c;return void 0===s||n>=t||n<0||g&&o>=r}function v(){var e,n,o,a=M();if(b(a))return m(a);l=setTimeout(v,(e=a-s,n=a-c,o=t-e,g?$(o,r-n):o))}function m(e){return(l=void 0,f&&o)?p(e):(o=a=void 0,i)}function y(){var e,n=M(),r=b(n);if(o=arguments,a=this,s=n,r){if(void 0===l)return c=e=s,l=setTimeout(v,t),d?p(e):i;if(g)return l=setTimeout(v,t),p(s)}return void 0===l&&(l=setTimeout(v,t)),i}return t=S(t)||0,w(n)&&(d=!!n.leading,r=(g="maxWait"in n)?L(S(n.maxWait)||0,t):r,f="trailing"in n?!!n.trailing:f),y.cancel=function(){void 0!==l&&clearTimeout(l),c=0,o=s=a=l=void 0},y.flush=function(){return void 0===l?i:m(M())},y}(e,t,{leading:o,maxWait:t,trailing:a})};const H=document.querySelector(".category-list-favorites"),j=document.querySelector(".favorites-list"),E=document.querySelector("#pagination"),O=document.querySelector(".favorites-text");let x=[],q=0,k=3,I=s.getLs(),N="";function F(e){e||=1,e=Number(e),I=s.getLs();let t=[];x=[],q=0,k=window.innerWidth<768?2:3;let n=0;Object.keys(I).forEach(e=>{let t=I[e];q++,x.includes(t.category)||x.push(t.category)}),N=x.includes(N)?N:"",Object.keys(I).forEach(o=>{let a=I[o],r=1===e?0:(e-1)*k,i=1===e?k:e*k;(N&&a.category===N||!N)&&(n++,t.length<k&&n>r&&n<=i&&t.push(`<li class="item-cards"><img class="card-img" data-recipe-id="${a._id}"src="${a.preview}"/><button class="add-fav-btn" data-recipe-id="${a._id}">love</button><span class="span-title">${a.title.toUpperCase()}</span><span class="span-descr">${a.description}</span><button class="main-see-recipe">See recipe</button></li>`))});let o=x.sort().map(e=>`<li class="favourites-list-btn"><button class="category-btn" data-recipe-category="${e}">${e}</button></li>`).join("");H.innerHTML=o,H.querySelectorAll(".category-btn").forEach(e=>{e.addEventListener("click",e=>{N=e.target.dataset.recipeCategory,console.log(e.target.dataset.recipeCategory),F()})}),document.querySelector(".all-tags").addEventListener("click",()=>{console.log("categories reset",N=""),F()}),t.length?(j.innerHTML=t.join(""),j.querySelectorAll(".add-fav-btn").forEach(t=>{t.addEventListener("click",function(t){t.preventDefault(),s.togleFav(t.target.dataset.recipeId),F(e)})}),n>k?function(e,t,n,o){e=Number(e),t=Number(t);let a=window.innerWidth<768?2:3;if(console.log(e,t),t>1){n.innerHTML="",1===e?(n.innerHTML+='<button class="main-pag-btn" disabled><<</button>',n.innerHTML+='<button class="main-pag-btn" disabled><</button>'):(n.innerHTML+='<button class="main-pag-btn main-pag-btn-green" data-topage="1"><<</button>',n.innerHTML+=`<button class="main-pag-btn main-pag-btn-green" data-topage="${e-1}"><</button>`);for(let o=e-a;o<=e+a;o++)o>0&&o<=t&&(o===e?n.innerHTML+=`<button class="main-pag-btn main-pag-btn-green active"  data-topage="${o}">${o}</button>`:o===e+a||o===e-a?n.innerHTML+=`<button class="main-pag-btn" data-topage="${o}">...</button>`:n.innerHTML+=`<button class="main-pag-btn" data-topage="${o}">${o}</button>`);e===t?(n.innerHTML+='<button class="main-pag-btn" disabled>></button>',n.innerHTML+='<button class="main-pag-btn" disabled>>></button>'):(n.innerHTML+=`<button class="main-pag-btn main-pag-btn-green" data-topage="${e+1}">></button>`,n.innerHTML+=`<button class="main-pag-btn main-pag-btn-green" data-topage="${t}">>></button>`),n.querySelectorAll("[data-topage]").forEach(e=>{e.addEventListener("click",function(e){e.preventDefault(),o(Number(e.target.dataset.topage))})})}}(e,Math.ceil(n/k),E,F):E.innerHTML="",O.style.display="none"):O.style.display="flex"}console.log(I),window.onresize=c(function(){F()},500),F();
//# sourceMappingURL=favorites.91af1295.js.map