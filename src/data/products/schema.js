export const ProductSchema = {

  id: "string",

  slug: "string",

  name: "string",

  description: "string",

  category: "string",

  price: "number",

  promo: "number|null",

  stock: "number",

  tags: "array",

  images: "array",

  shipping: {
    time: "string",
    fee: "number"
  }

}