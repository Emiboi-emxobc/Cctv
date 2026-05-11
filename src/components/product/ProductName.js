import Title from '../typography/Title.js';
import Div from '../Div.js';


export default function ProductName(product){
 return Title({ tag:3,
    className:"product-name",
 }, product.name)
 
}