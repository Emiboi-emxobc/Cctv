import {_$} from './helpers/dom.js';
import Div from './Div.js';
export default function Input({
   type="text",
   className ="",
   id ="",
   label ="",
   placeholder,
   name ="",onKeyDown,
   onInput
}){
   
   return Div({
      className:`input-group ${type}-input-container `,
   },
      _$("input",{
         type,
         id,
         className :`input ${type}-input ${className}`,
         name,
         placeholder,
         onInput,
         onKeyDown
      }),
      
      _$("label",{
         htmlFor:id,
         text:label
      })
   )
}