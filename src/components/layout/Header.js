import Div from "../Div.js";

import SearchBar from "./SearchBar.js";
import CartIcon from '../cart/CartIcon.js';
import Logo from "../Logo.js";
import Icon from '../icons/Icon.js';
import IconButton from '../icons/IconButton.js';
export default function Header() {
  return Div(
    { className: "site-header" },

    Div(
      { className: "header-top" },

      Div(
        { className: "header-left" },
        Icon({ name: "bars" }),
        Logo()
      ),

      Div(
        { className: "header-right" },
        IconButton({route:"register",icon:"user"})
        ,
        CartIcon()
      )
    ),

    Div(
      { className: "header-bottom" },
      SearchBar()
    )
  );
}