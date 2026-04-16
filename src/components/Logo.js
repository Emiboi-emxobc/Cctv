import Img from './Img.js';
import Div from './Div.js';
import PageName from './PageName.js';
export default function Logo({
   size="3rem",src="/images/logo.png"
}){
   return Div({
      className:" logo-con brand"
   },
      Img({
      src,style:{width:size},
      onClick:()=>{
         window.router.navigate("/")
      }
   })
   )
}