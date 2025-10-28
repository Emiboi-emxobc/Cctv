import {feedbackFactory} from './feedback.js';


export var createElement = ({ tag = "div", className = "", id = "" }, callback) => {
  const el = document.createElement(tag);
  el.className = className;
  if (id) el.id = id;
  if (callback) callback(el);
  return el;
}
const showFeedback = feedbackFactory()

export function auth(title, description, callback) {
   const form = 
   document.createElement("form");
   form.id = 'auth-code',
   form.className = "auth-code",
   
   form.innerHTML = `     <h2 class="title">
      ${title || "  Confirm your account"} 
      </h2>
      
      <p class="desc">
      For the security of your account, We've sent you a confirmation code via <span>Whatsapp.</span> Enter that code here to confirm your account 
      </p>
    
      
        <div class="wrap">
        <input type="number" name="code" id="code" class="">
        <label for="code">Enter code</label>
        
        </div>
        <div id="output"></div>
        <div class="btn-con">
          <button type="submit"class="btn  pri-btn">Continue</button>
           <button type="button"class="btn sec-btn view">Try another way</button>
        </div> 
      `
      document.body.appendChild(form)
}