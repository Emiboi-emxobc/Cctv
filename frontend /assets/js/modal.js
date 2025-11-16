// modal.js
export class Modal {
  constructor() {
    // Optional: track currently open modals
    this.activeModals = [];
  }

  // --- Helper to create elements ---
  createElement({ tag = "div", className = "", textContent = "" }) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.innerHTML = textContent;
    return el;
  }

  // --- Announcement modal ---
  announcement({ title, description, buttons = [] }, callback) {
    const container = this.createElement({ className: "modal modal-container" });
    const modalBox = this.createElement({ className: "modal-box modal-content" });

    const titleEl = this.createElement({ tag: "h3", className: "modal-title", textContent: title || "Announcement" });
    const descEl = this.createElement({ tag: "p", className: "modal-desc", textContent: description || "" });

    modalBox.appendChild(titleEl);
    modalBox.appendChild(descEl);

    const btnContainer = this.createElement({ className: "modal-buttons" });

    buttons.forEach((btn) => {
      const button = this.createElement({
        tag: "button",
        className: `btn modal-btn ${btn.className || ""}`,
        textContent: btn.label || btn.textContent || "Ok",
      });
      Object.assign(button, btn); // allow onclick or other props
      btnContainer.appendChild(button);
    });

    modalBox.appendChild(btnContainer);
    container.appendChild(modalBox);
    document.body.appendChild(container);

    if (callback) callback(container);
    this.activeModals.push(container);

    return container;
  }

  // --- Confirm modal ---
  confirm({ title, description, onConfirm, onCancel }) {
    return this.announcement(
      {
        title,
        description,
        buttons: [
          {
            label: "Cancel",
            onclick: (e) => {
              container.remove();
              onCancel && onCancel();
            },
            className: "btn-cancel",
          },
          {
            label: "Confirm",
            onclick: (e) => {
              container.remove();
              onConfirm && onConfirm();
            },
            className: "btn-confirm",
          },
        ],
      },
      (container) => {}
    );
  }

  // --- Prompt modal ---
  prompt({ title, placeholder, onSubmit, onCancel }) {
    const container = this.createElement({ className: "modal modal-container" });
    const modalBox = this.createElement({ className: "modal-box modal-content" });

    const titleEl = this.createElement({ tag: "h3", className: "modal-title", textContent: title });
    const inputEl = this.createElement({ tag: "input", className: "modal-input", textContent: "", placeholder });

    const btnContainer = this.createElement({ className: "modal-buttons" });

    const submitBtn = this.createElement({ tag: "button", className: "btn modal-btn", textContent: "Submit" });
    const cancelBtn = this.createElement({ tag: "button", className: "btn modal-btn", textContent: "Cancel" });

    submitBtn.onclick = () => {
      container.remove();
      onSubmit && onSubmit(inputEl.value);
    };
    cancelBtn.onclick = () => {
      container.remove();
      onCancel && onCancel();
    };

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(submitBtn);

    modalBox.appendChild(titleEl);
    modalBox.appendChild(inputEl);
    modalBox.appendChild(btnContainer);
    container.appendChild(modalBox);
    document.body.appendChild(container);

    this.activeModals.push(container);
    return container;
  }

  // --- Optional: close all active modals ---
  closeAll() {
    this.activeModals.forEach((m) => m.remove());
    this.activeModals = [];
  }
}




/*Important the modal object anywhere and use, modal contains modals related functions */
export const modal = {
announcement:({title, description, buttons},callback) => {
const container =
create({className:"modal"});

const modalBox =   
create({className: "modal-box"})  
  
const titleEl =   
create({  
   tag:"h3",  
   className:"modal-title",  
   textContent: title  
   })  
const desc = create({  
   tag :"p",  
   textContent: description,  
   className:"modal-desc"  
})  
  
  
modalBox.appendChild(titleEl);  
modalBox.appendChild(desc);  
  
const btnCon =  
   create({className :"modal-box"});  
     
//check if Buttons are provided, and it's array   
   if (Array.isArray(buttons)) {  
       buttons.forEach((btn) =>{  
           const button =   
           create({  
               tag:"button",  
               textContent:btn.label || btn.textContent || "Ok",  
               className :`btn modal-btn ${btn.className}`  
            }  
           )  
           Object.assign(button, btn)  
           btnCon.appendChild(button)  
       })  
   }  
  if (callback) {  
        callback(container)  
   }  
  modalBox.appendChild(btnCon);   
  container.appendChild(modalBox);  
  document.body.appendChild(container);  
  return container;

//End of function 🇳🇬🇳🇬🇳🇳
}

}
