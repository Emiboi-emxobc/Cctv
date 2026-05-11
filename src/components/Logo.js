import Img from './Img.js';
import Div from './Div.js';

export default function Logo({
   size="2.3rem",src="/images/icons/logo.png"
}={}){
   return Div({
      className:" logo-con brand"
   },
      Img({
      src,style:{width:size},
      onClick:()=>{
         window.router.navigate("/")
      }
   }),
   "Marsdove"
   )
}