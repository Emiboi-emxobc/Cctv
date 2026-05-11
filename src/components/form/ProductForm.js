

import Input from "./Input.js";
import TextArea from "./TextArea.js";

import FormGrid from "./FormGrid.js";
import FormSection from "./FormSection.js";
import ArrayField from "./ArrayField.js";
import ImageUploader from "./ImageUploader.js";


import Field from "./Field.js";

import { loadCss } from "../../helpers/loadCss.js";
import Form from "./Form.js";

const FORM = "product";

export default function ProductForm({ onSubmit }) {
  loadCss("/src/components/form/form.css");

  return Form(
    {
      name: FORM,

      // 🔥 VALIDATION SCHEMA
      schema: {
        name: { required: true },
        price: { required: true, min: 1 },
        stock: { min: 0 },
        "shipping.fee": { min: 0 }
      },

      onSubmit
    },

    // ---------------- BASIC INFO ----------------
    FormSection(
      { title: "Basic Information" },

      Field(
        { label: "Product Name" },
        Input({ name: "name", form: FORM })
      ),

      Field(
        { label: "Short Description" },
        Input({ name: "shortDescription", form: FORM })
      ),

      Field(
        { label: "Description" },
        TextArea({ name: "description", form: FORM })
      ),

      Field(
        { label: "Brand" },
        Input({ name: "brand", form: FORM })
      )
    ),

    // ---------------- CLASSIFICATION ----------------
    FormSection(
      { title: "Classification" },

      FormGrid({ cols: 2 },

        Field(
          { label: "Category" },
          Input({ name: "category", form: FORM })
        ),

        Field(
          { label: "Sub Category" },
          Input({ name: "subCategory", form: FORM })
        )
      ),

      ArrayField({
        label: "Tags",
        form: FORM,
        name: "tags"
      })
    ),

    // ---------------- PRICING ----------------
    FormSection(
      { title: "Pricing" },

      FormGrid({ cols: 3 },

        Field(
          { label: "Price" },
          Input({ name: "price", type: "number", form: FORM })
        ),

        Field(
          { label: "Promo Price" },
          Input({ name: "promo", type: "number", form: FORM })
        ),

        Field(
          { label: "Currency" },
          Input({ name: "currency", form: FORM })
        )
      )
    ),

    // ---------------- INVENTORY ----------------
    FormSection(
      { title: "Inventory" },

      FormGrid({ cols: 2 },

        Field(
          { label: "Stock" },
          Input({ name: "stock", type: "number", form: FORM })
        ),

        Field(
          { label: "Sold" },
          Input({ name: "sold", type: "number", form: FORM })
        )
      )
    ),

    // ---------------- MEDIA ----------------
    FormSection(
      { title: "Images" },

      ImageUploader({
        form: FORM,
        name: "images"
      })
    ),

    // ---------------- SHIPPING ----------------
    FormSection(
      { title: "Shipping" },

      FormGrid({ cols: 3 },

        Field(
          { label: "Delivery Time" },
          Input({ name: "shipping.time", form: FORM })
        ),

        Field(
          { label: "Fee" },
          Input({ name: "shipping.fee", type: "number", form: FORM })
        ),

        Field(
          { label: "Free Shipping" },
          Input({
            name: "shipping.freeShipping",
            type: "checkbox",
            form: FORM
          })
        )
      )
    ),

    // ---------------- META ----------------
    FormSection(
      { title: "Meta" },

      FormGrid({ cols: 3 },

        Field(
          { label: "Status" },
          Input({ name: "status", form: FORM })
        ),

        Field(
          { label: "Featured" },
          Input({
            name: "featured",
            type: "checkbox",
            form: FORM
          })
        ),

        Field(
          { label: "Trending" },
          Input({
            name: "trending",
            type: "checkbox",
            form: FORM
          })
        )
      )
    )
  );
}