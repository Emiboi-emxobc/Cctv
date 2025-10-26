
// 🧩 Utility: Feedback messages
function createElement({ tag = "div", className = "", id = "" }, callback) {
  const el = document.createElement(tag);
  el.className = className;
  if (id) el.id = id;
  if (callback) callback(el);
  return el;
}





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

function feedbackFactory(theme = {}) {
  const colors = {
    success: theme.success || "bg-[#333] bg-dark text-white",
    danger: theme.danger || "bg-[#D0313D] text-white",
    warning: theme.warning || "bg-[#EA9534] text-white",
    info: theme.info || "bg-[#DF7737] text-white",
    normal: "bg-[#111]",
  };

  return (type = "info", message = "Notification", time = 2000) => {
    const container = createElement(
      {
        tag: "div",
        className: `${colors[type]} p-3 rounded-md fixed top-1/2 right-5 shadow-md animate-bounce z-50 feedback`,
      },
      (el) => {
        el.innerText = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), time);
      }
    );
    return container;
  };
}

export const showFeedback = feedbackFactory();
