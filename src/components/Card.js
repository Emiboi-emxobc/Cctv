import Div from './Div.js';
import Title from './Title.js';
import Paragraph from './Paragraph.js';

export default 
function ProductCardShell({
   className = "product-card",
   onClick
},...children){
   
   return Div({
      className,
      onClick,
   },...children)
}