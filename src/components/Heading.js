import { Dom } from "./helpers/dom.js"

const { _$ } = Dom

export default function Heading(
  { level = 1, ...props } = {},
  ...children
){

  const tag = "h" + level

  return _$(
    tag,
    {
      dataset:{
        component:"heading"
      },
      ...props
    },
    ...children
  )

}