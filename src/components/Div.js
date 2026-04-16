import { Dom } from "./helpers/dom.js"

const { _$ } = Dom

export default function Div(props = {}, ...children){

  return _$(
    "div",
    {
      dataset:{
        component:"div"
      },
      ...props
    },
    ...children
  )

}