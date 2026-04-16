import Div from "../Div.js"

import Header from "./Header.js"
import Footer from "./Footer.js"

export default function Layout(pageContent){

  return Div(
    { className:"site-layout" },

    Header(),

    Div(
      { className:"site-content" },

      pageContent
    ),

    Footer()

  )

}