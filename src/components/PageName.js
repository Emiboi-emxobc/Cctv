import Div from './Div.js';
import Title from './Title.js';

export default function PageName(){
   const pageTitle = document.title;
   const pageName = pageTitle.split("|")[0];
   
   return Title({
      tag:4,
      text:" Marsdove"
   })
}