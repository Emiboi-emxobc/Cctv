import Heading from "./Heading.js";


export default function Title({
  tag = 4,
  level=4,
  className = "page-title", 
  text = "", 
  onClick
},...children) {
  return Heading({level:tag,
    className: `title ${className}`,  // Combined dynamic className with global system
    text,
    onClick
  },...children);
}