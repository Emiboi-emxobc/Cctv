import {_$} from './helpers/dom.js';

export default function Paragraph({
   className,text,id
},...children){
   
   return _$("p",{
      className:`paragraph ${className}`,text,id
   },...children)
}