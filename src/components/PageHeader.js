import Div from './Div.js';
import Title from './Title.js';
import CategoryNav from './layout/CategoryNav.js';
import SearchBar from './layout/SearchBar.js';
import BackButton from './BackButton.js';


export default function PageHeader({
   className ="",name
},...children){
   const pageTitle = name || document.title.split("|")[0];
   const pageName = pageTitle;
   
   return Div({
      className:"frsb page-header"
   },
      Title({text:pageName}),
      
      SearchBar()
   )
}