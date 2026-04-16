import Button from './Button.js';

export default 
function SecondaryButton({
   onClick,className =""
},...ch){
   
   return Button({
      className:`btn-secondary ${className}`,
      onClick
   },...ch)
}