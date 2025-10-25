import {create} from './create.js';
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
      alert(titleEl.textContent);
      return container;

//End of function 🇳🇬🇳🇬🇳🇳
}


}