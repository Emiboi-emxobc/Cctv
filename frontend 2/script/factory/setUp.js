export function create({
   tag ="div",className ="card",
   id ='',content ='',
}, callback) {
   const element = 
   document.createElement(tag);
   element.className = className;
   element.id = id;
   if(content) element.innerHTML = content;
   
   if (callback) callback(element);
}
