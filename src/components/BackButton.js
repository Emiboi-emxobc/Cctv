import Icon from './icons/Icon.js';
import Button from './Button.js';

export default function BackButton(){
   return Button({
      className:"back-button",
      onClick: () =>history.back()
   },
      Icon({name:"arrow-left"})
   )
}