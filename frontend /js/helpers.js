export const copyText = async (text) =>{
   try {
   const showFeedback = feedbackFactory();
   

    await navigator.clipboard.writeText(text);
   showFeedback("success", "Copied to clipboard ✅");
   
   } catch (e) {
      showFeedback("danger", "Unable to copy this text");
   }
}


export function createElement({ tag = "div", className = "", id = "" }, callback) {
  const el = document.createElement(tag);
  el.className = className;
  if (id) el.id = id;
  if (callback) callback(el);
  return el;
}

export function feedbackFactory(theme = {}) {
  const colors = {
    success: theme.success || "bg-[#18902C] text-white",
    danger: theme.danger || "bg-[#D0313D] text-white",
    warning: theme.warning || "bg-[#EA9534] text-white",
    info: theme.info || "bg-[#DF7737] text-white",
  };

  return (type = "info", message = "Notification", time = 3000) => {
    const container = createElement({
      tag: "div",
      className: `${colors[type]} p-3 rounded-md fixed bottom-5 right-5 shadow-md animate-bounce z-50`,
    }, (el) => {
      el.innerText = message;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), time);
    });
    return container;
  };
} 
const showFeedback = feedbackFactory();

