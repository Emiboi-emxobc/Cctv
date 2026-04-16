import { Dom } from "../components/helpers/dom.js";

const routes = [];
let notFound = null;
let currentPath = null;

let basePath = "";
let beforeEachHooks = [];
let appName = "Mecus Ventures";

// ------------------
// START ROUTER
// ------------------

export function start(){

window.onpopstate = ()=>{
render(location.pathname + location.search);
};

interceptLinks();
render(location.pathname + location.search);

}

// ------------------
// CONFIG
// -----------------

function setConfig(options = {}){

if(options.basePath) basePath = options.basePath;
if(options.appName) appName = options.appName;

}

// ------------------
// GLOBAL MIDDLEWARE
// ------------------

function beforeEach(fn){
beforeEachHooks.push(fn);
}

// ------------------
// REGISTER ROUTE
// ------------------

function register(path, page, options = {}){

const parts = path.split("/").filter(Boolean);

routes.push({
path,
parts,
page,

title: options.title || null, // ✅ NEW  

layout: options.layout || null,  
guards: options.guards || [],  
beforeEnter: options.beforeEnter || null

});

}

// ------------------
// UTILITIES
// ------------------

function getCleanPath(path){

if(basePath && path.startsWith(basePath)){
return path.replace(basePath,"") || "/";
}

return path;

}

function parseQuery(){

const params = new URLSearchParams(location.search);
return Object.fromEntries(params.entries());

}

// ------------------
// ROUTE MATCHER
// ------------------

function match(path){

const urlParts = path.split("/").filter(Boolean);

for(const route of routes){

const routeParts = route.parts;  
const params = {};  

let matched = true;  
let i = 0;  

for(; i < routeParts.length; i++){  

  const routePart = routeParts[i];  
  const urlPart = urlParts[i];  

  if(routePart === "*"){  
    params["*"] = urlParts.slice(i).join("/");  
    return { route, params };  
  }  

  if(!urlPart){  
    matched = false;  
    break;  
  }  

  if(routePart.startsWith(":")){  
    params[routePart.slice(1)] = decodeURIComponent(urlPart);  
  }  
  else if(routePart !== urlPart){  
    matched = false;  
    break;  
  }  

}  

if(matched && i === urlParts.length){  
  return { route, params };  
}

}

return null;

}

// ------------------
// GUARDS
// ------------------

async function runGuards(guards, context){

for(const guard of guards){

const result = await guard(context);  

if(result === false) return false;  

if(typeof result === "string"){  
  redirect(result);  
  return "REDIRECTED";  
}

}

return true;

}

// ------------------
// TITLE HELPER
// ------------------

function applyTitle(route, context){

if(!route.title) return;

let title = typeof route.title === "function"
? route.title(context)
: route.title;

document.title =title.includes(appName)
?
title : `${title} | ${appName}`;

}

// ------------------
// RENDER ENGINE
// ------------------

async function render(rawUrl){

const url = rawUrl.split("?")[0];
const path = getCleanPath(url);

const result = match(path);
const query = parseQuery();

if(!result){
if(notFound) Dom.swapPage(notFound());
return;
}

const { route, params } = result;

const context = {
path,
params,
query,
navigate,
redirect,
setTitle: (title)=>{
document.title = title.includes(appName)
? title
:` ${title} | ${appName}`;
}
};

// GLOBAL MIDDLEWARE
for(const hook of beforeEachHooks){

const res = await hook(context);  

if(res === false) return;  

if(typeof res === "string"){  
  redirect(res);  
  return;  
}

}

// ROUTE TITLE (early)
applyTitle(route, context);

// ROUTE MIDDLEWARE
if(route.beforeEnter){

const ok = await route.beforeEnter(context);  

if(!ok || ok === "REDIRECTED") return;

}

// GUARDS
const allowed = await runGuards(route.guards, context);

if(!allowed || allowed === "REDIRECTED") return;

// PAGE
let pageNode = route.page(context);

if(pageNode instanceof Promise){
pageNode = await pageNode;
}

// LAYOUT
if(route.layout){
pageNode = route.layout(pageNode);
}

Dom.swapPage(pageNode);

currentPath = path;

window.scrollTo(0,0);

}

// ------------------
// NAVIGATION
// ------------------

function navigate(url){

if(url === location.pathname + location.search) return;

const full = basePath + url;

history.pushState({}, "", full);

render(url);

}

function redirect(url){

const full = basePath + url;

history.replaceState({}, "", full);

render(url);

}

// ------------------
// LINK INTERCEPTOR
// ------------------

function interceptLinks(){

document.addEventListener("click",(e)=>{

const link = e.target.closest("a");  

if(!link) return;  

if(link.target === "_blank") return;  
if(link.hasAttribute("download")) return;  

const url = link.getAttribute("href");  

if(!url) return;  

if(url.startsWith("http")) return;  
if(url.startsWith("#")) return;  
if(!url.startsWith("/")) return;  

e.preventDefault();  

navigate(url);

});

}

// ------------------
// EXPORT
// ------------------

export const Router = {
register,
navigate,
redirect,
start,
beforeEach,
setConfig,
set404:(page)=>{ notFound = page }
};

// ------------------
// DEV DEBUG
// ------------------

if(typeof window !== "undefined"){
window.Router = Router;
}

