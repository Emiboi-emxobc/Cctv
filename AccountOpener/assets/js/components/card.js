import Title from './Title.js';

export function card(props, ...children, callback) {
   const card = _$("div",props,...children);
   card.className=`card ${props.className}`;
   
   if (callback) {
      callback(card)
   }
   
   return card
   
}