import Button from './Button.js';

export default 
function PrimaryButton({
   onClick,className =""
},...ch){
   
   return Button({
      className:`btn-primary ${className}`,
      onClick
   },...ch)
}