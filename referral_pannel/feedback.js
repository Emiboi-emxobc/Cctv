import {createElement} from './auth.js';

export function feedbackFactory(theme = {}) {
  const colors = {
    success: theme.success || "bg-[#333] text-white",
    danger: theme.danger || "bg-[#D0313D] text-white",
    warning: theme.warning || "bg-[#EA9534] text-white",
    info: theme.info || "bg-[#DF7737] text-white",
    normal:"bg-[#111]"
  };

  return (type = "info", message = "Notification", time = 2000) => {
    const container = createElement({
      tag: "div",
      className: `${colors[type]} p-3 rounded-md fixed top-1/2 right-5 shadow-md animate-bounce z-50`,
    }, (el) => {
      el.innerText = message;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), time);
    });
    return container;
  };
}
