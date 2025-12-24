import {_$} from './helpers/dom.js';

export function input({label="",id="",type='text',className= ""}){
  const lab = _$("label",{html:label,htmlFor:id});
  const inp = _$("input",{type,id,className});
  const inpGroup = _$("div",{
     className:"input-group",
  },[inp,lab]);
  
  return inpGroup
}