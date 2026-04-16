import Button from './Button.js';
import Icon from './icons/Icon.js'


export default function ViewButton(c){
   return Button({
      className:"btn view-btn",
      onClick : c()
   },
      Icon({name:"arrow-right"})
   )
}