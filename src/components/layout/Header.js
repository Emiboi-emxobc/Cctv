import Div from "../Div.js"
import {_$} from '../helpers/dom.js';
import Logo from '../Logo.js';
import Text from "../Text.js"
import CategoryNav from "./CategoryNav.js"
import Icon from '../icons/Icon.js';
import Navigation from "./Navigation.js"
import CartIcon from "../cart/CartIcon.js"

export default function Header(){

  return _$("header"
   , { className:"site-header" },
      
       Div({ className:"fr g4"},
         Icon({name:"bars mr2",size:"lg"}),
          Logo({})
       ),
       
       Div({
         
       },
      /*   Navigation()*/
       ),
       
       Div({},
         CartIcon()
       )
      
    )
}