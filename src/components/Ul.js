

import {_$} from './helpers/dom.js';

export default function Ul({key, className = ""}, ...list){
   
   return _$("ul", {id: key, className: `ul list ${className}`},
      ...list.map(item => _$("li", {}, item))
   )
}