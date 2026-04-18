import { Dom } from "./helpers/dom.js"

const { _$ } = Dom

export default function Text({ tag = "span",
    ...props } = {},
  ...children
) {
  
  return _$(
    tag,
    {
      dataset: {
        component: "text"
      },
      ...props
    },
    ...children
  )
  
}