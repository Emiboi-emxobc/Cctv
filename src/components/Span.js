import {Dom} from './helpers/dom.js';

export default function Span({
   className="",text="", onClick 
}){
   
   return  Dom._$("span",{
      className,text,onClick
   })
}