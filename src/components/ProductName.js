import Title from './Title.js';
import Div from './Div.js';


export default function ProductName(...children){
 return Title({ tag:3,
    className:"product-title",
 },...children)
 
}