import { _$ } from '../helpers/dom.js';
import Div from '../Div.js';
import { Store } from '../../store/index.js';

export default function Input({
  type = "text",
  className = "",
  id = "",
  label = "",
  placeholder = "",
  name = "",
  value,
  checked,
  form, // 🔥 form name (e.g "product")
  bind, // 🔥 direct path binding (e.g "product.price")
  onInput,
  onChange,
  onKeyDown,
  accept,
  multiple,
  disabled = false,
  required = false
}) {
  
  // -----------------------
  // AUTO BIND TO STORE
  // -----------------------
  function handleInput(e) {
    let val;
    
    if (type === "checkbox") {
      val = e.target.checked;
    } else if (type === "file") {
      val = Array.from(e.target.files);
    } else {
      val = e.target.value;
    }
    
    // 🔥 bind using form + name
    if (form && name) {
      Store.set(`forms.${form}.data.${name}`, val);
    }
    
    // 🔥 bind using direct path
    if (bind) {
      Store.set(bind, val);
    }
    
    onInput && onInput(e);
  }
  
  function handleChange(e) {
    onChange && onChange(e);
  }
  
  // -----------------------
  // INPUT PROPS
  // -----------------------
  const inputProps = {
    type,
    id,
    className: `input ${type}-input ${className}`,
    name,
    placeholder,
    onInput: handleInput,
    onChange: handleChange,
    onKeyDown,
    disabled,
    required
  };
  
  // special cases
  if (type === "checkbox") {
    inputProps.checked = checked;
  } else if (value !== undefined) {
    inputProps.value = value;
  }
  
  if (type === "file") {
    inputProps.accept = accept;
    inputProps.multiple = multiple;
  }
  
  return Div(
    {
      className: `input-group ${type}-input-container`
    },
    
    _$("input", inputProps),
    
    label &&
    _$("label", {
      htmlFor: id,
      text: label
    })
  );
}