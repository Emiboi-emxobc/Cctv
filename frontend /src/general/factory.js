export function factory({
   tag ="div",className = "card",id,
   content
}, callback) {
   const element = 
   document.createElement(tag);
   element.className = className;
   if (id) element.id = id;
   if (content) {
      element.innerHTML = content;
   }
      if (callback) {
         callback(element);
      }
   
   return element 
}