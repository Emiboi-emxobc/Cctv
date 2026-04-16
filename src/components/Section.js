import {_$} from './helpers/dom.js';

export default function Section({
   id ="",className
},...children){
   return _$("section",{
      id,className
   },...children)
}