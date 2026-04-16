import Div from './Div.js';
import Title from './Title.js';
import Img from "./Img.js";
import Paragraph from './Paragraph.js';
export default function Banner(banners=[]){
   
   const el =
   banners.map((banner,i) =>{
      Div({
      className:`${banner?.name || "banner"}`,
   },
        banner?.img && Img({
           src:banner?.img,
           className:"banner-image"
        }),
         banner?.title && Title({
            text:banner?.title,
            className:`banner-title`,
         
         }),
         
         banner?.text && Paragraph(banner?.text),
         
         banner?.cta && Button({
            text:banner?.cta,
            className:"btn banner-cta btn-primary"
         })
      )
   })
   
}