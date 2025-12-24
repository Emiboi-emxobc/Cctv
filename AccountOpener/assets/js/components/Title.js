import {$,_$} from "./helpers/dom.js";

export default function Title({tag="h2",className="page-title",text=""}){
   return _$(tag,{
      className:className,
      html: text 
   });
}