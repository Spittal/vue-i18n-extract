import e from"path";import n from"is-valid-glob";import r from"glob";import s from"fs";import t from"dot-object";import a from"js-yaml";import i from"esm";function*o(e,n,r){for(void 0===r&&(r=1);;){var s=n.exec(e.content);if(null===s)break;var t=(e.content.substring(0,s.index).match(/\n/g)||[]).length+1;yield{path:s[r],line:t,file:e.fileName}}}function l(t){if(!n(t))throw new Error("languageFiles isn't a valid glob pattern.");var i=r.sync(t);if(0===i.length)throw new Error("languageFiles glob has no files.");return i.map(n=>{var r=e.resolve(process.cwd(),n),t=r.substring(r.lastIndexOf(".")).toLowerCase(),i=".yaml"===t||".yml"===t?a.safeLoad(s.readFileSync(r,"utf8")):require(r),o=i.default?i.default:i;return{fileName:n.replace(process.cwd(),""),path:n,content:JSON.stringify(o)}})}function u(){return(u=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&(e[s]=r[s])}return e}).apply(this,arguments)}var f;require=i(module),function(e){e[e.None=0]="None",e[e.Missing=1]="Missing",e[e.Unused=2]="Unused",e[e.All=3]="All"}(f||(f={}));var c={report:async function(i){var{vueFiles:c,languageFiles:g,output:p,add:m}=i,d=e.resolve(process.cwd(),c),h=e.resolve(process.cwd(),g),v=function(e,n,r){void 0===r&&(r=f.All);var s=[],t=[];Object.keys(n).forEach(r=>{var a=n[r];e.forEach(e=>{var t=function(n){return n.path===e.path||n.path.startsWith(e.path+".")};n[r].some(t)||s.push(u({},e,{language:r})),a=a.filter(e=>!t(e))}),t.push(...a.map(e=>u({},e,{language:r})))});var a={};return r&f.Missing&&(a=Object.assign(a,{missingKeys:s})),r&f.Unused&&(a=Object.assign(a,{unusedKeys:t})),a}(function(e){if(!n(e))throw new Error("vueFiles isn't a valid glob pattern.");var t=r.sync(e);if(0===t.length)throw new Error("vueFiles glob has no files.");return t.map(e=>({fileName:e.replace(process.cwd(),""),path:e,content:s.readFileSync(e,"utf8")}))}(d).reduce((e,n)=>[...e,...function(e){return[...o(e,/(?:[$ .]tc?)\(\s*?(["'`])((?:[^\\]|\\.)*?)\1/g,2)]}(n),...function(e){return[...o(e,/(?:<i18n|<I18N)(?:.|\n)*?(?:[^:]path=("|'))(.*?)\1/g,2)]}(n),...function(e){return[...o(e,/v-t="'(.*?)'"/g)]}(n)],[]),l(h).reduce((e,n)=>{var r=n.fileName.substring(n.fileName.lastIndexOf("/")+1,n.fileName.lastIndexOf(".")),s=t.dot(JSON.parse(n.content)),a=Object.keys(s).map((e,r)=>({line:r,path:e,file:n.fileName}));return e[r]=a,e},{}));v.missingKeys&&console.table(v.missingKeys),v.unusedKeys&&console.table(v.unusedKeys),p&&(await async function(e,n){var r=JSON.stringify(e);return new Promise((e,t)=>{s.writeFile(n,r,n=>{n?t(n):e()})})}(v,e.resolve(process.cwd(),p)),console.log("The report has been has been saved to "+p)),m&&v.missingKeys&&v.missingKeys.length>0&&(function(n,r){l(n).forEach(n=>{var i=JSON.parse(n.content);r.forEach(e=>{(e.language&&n.fileName.includes(e.language)||!e.language)&&t.str(e.path,"",i)});var o=n.fileName.substring(n.fileName.lastIndexOf(".")+1),l=e.resolve(process.cwd()+n.fileName),u=JSON.stringify(i,null,2);if("json"===o)s.writeFileSync(l,u);else if("js"===o)s.writeFileSync(l,"export default "+u+"; \n");else if("yaml"===o||"yml"===o){var f=a.safeDump(i);s.writeFileSync(l,f)}})}(h,v.missingKeys),console.log("The missing keys have been added to your languages files"))}};export default c;
//# sourceMappingURL=vue-i18n-extract.modern.js.map
