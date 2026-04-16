import Div from './Div.js';
import Img from './Img.js';
import Button from './Button.js';
import Paragraph from "./Paragraph.js"
import Card from './Card.js';

export default function CartItem(item){
  return Card(
        { },
        Img({
          src:item.images[0]
        }),
        
        Div({
          className:"card-content"
        },
          Paragraph({text:item.name}),

        Paragraph({text:`₦${item.price}`,className:"price"}),
        
        Button({
          onclick :() =>removeItem(),
          className:"btn btn-primary"
        },"Remove")

        )
      )

    

}