import Div from "../Div.js"
import Paragraph from "../typography/Paragraph.js"

export default function Footer(){
  return Div(
    { className:"site-footer" },
    
    Div({ className: "footer-brand" },
      Paragraph({className :"brand"
      }, "Mecus Ventures Furniture"),
      Paragraph({}, "Quality handcrafted furniture for homes and offices.")
    ),
    
    Div({ className: "footer-info" },
      Paragraph({}, "Delivery available across Nigeria."),
      Paragraph({}, "© 2026 Mecus Ventures")
    )
  )
}