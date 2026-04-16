import Div from "../Div.js"
import Text from "../Text.js"
import Card from '../Card.js';
import { getCategories } from "../../data/categories/index.js"

export default function CategoryNav(){

  const categories = getCategories()

  return Div(
    { className:"flash-row" },

    ...categories.map(cat => {
      
     
          
    }

    

    )

  )

}