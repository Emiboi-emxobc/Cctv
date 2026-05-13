import Section from './Section.js'
import Title from './typography/Title.js';
import Div from './Div.js'

export default function Feature({
   name= "",id,className,
},...contents){
   
   return Section({
      id,className:`feature ${id}`,
   },
   Div({
      className:"feature-header"
   },
      Title({ className: "feature-title", text: name })
   )
   
   ,
      Div({
         className:"feature-content"
      },
         ...contents
      )
   )
}