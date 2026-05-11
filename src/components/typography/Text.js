import {Dom} from '../helpers/dom.js';

export default function Text({
   className="",onClick 
},text){
   
   return  Dom._$("span",{
      className,onClick
   },text)
}