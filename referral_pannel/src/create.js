export function create({
    tag ="div",
    className = "card",
    id, 
    callback,
    textContent,
}){
    const element =
    document.createElement(tag);
    if(id)element.id = id;
    
   if (textContent) {
      element.innerHTML=textContent;
   } 
      
  element.className = ` p-4 ${className}`;
    if (callback) callback(element);
    
    
    return element;
}

