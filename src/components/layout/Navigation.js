import Div from "../Div.js"
import Text from "../Text.js"

function NavLink(label, path){

  return Text(
    {
      className: "nav-link",
      onClick: () => Router.navigate(path)
    },
    label
  )

}

export default function Navigation(){

  return Div(
    { className:"navigation" },

    NavLink("Home", "/"),
    NavLink("Shop", "/shop"),
    NavLink("Products", "/product")

  )

}