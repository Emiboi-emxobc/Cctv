import { _$ } from "../helpers/dom.js";
import {CardFooter} from './CardFooter.js';
import {CardHeader} from './CardHeader.js';
import {CardBody} from './CardBody.js';
/**
 * Base Card wrapper
 */
export default function Card(
  { className = "", ...props } = {},
  ...children
) {
  return _$(
    "div",
    {
      className: `card ${className}`.trim(),
      ...props
    },
    ...children
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { CardHeader, CardBody, CardFooter };