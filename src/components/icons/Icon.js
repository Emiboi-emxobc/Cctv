import Span from "../Span.js";

export default function Icon({name="",type="solid",size, onClick}){
   return Span({
      className:`fa-${name} fa-${type} fa-${size}`,
      onClick
   })
}