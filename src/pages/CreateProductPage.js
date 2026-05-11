import Div from "../components/Div.js";
import Title from "../components/Title.js";
import ProductForm from "../components/form/ProductForm.js";

export default function CreateProductPage() {

  function handleSubmit(data) {
    console.log("🔥 Product submitted:", data);
  }

  return Div(
    { className: "page create-product-page" },

    // Page Header
    Title({
      level: 1,
      className: "page-title",
      text: "Create Product"
    }),

    // Form Container (important for layout)
    Div(
      { className: "form-wrapper card" },

      ProductForm({
        onSubmit: handleSubmit
      })
    )
  );
}