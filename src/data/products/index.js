import { products } from "./products.mock.js"


export function getProducts(){

  return products

}


export function getProductById(id){

  return products.find(product => product.id === id)

}
export function updateLike(id) {
  const prod = products.find(product => product.id === id);
  if (prod) {
    prod.likes += 1;  // Correctly increment the likes and update the product
    alert(prod.likes)
  }
}
export function getProductBySlug(slug){

  return products.find(product => product.slug === slug)

}


export function getProductsByCategory(category){

  return products.filter(product => product.category === category)

}


export function searchProducts(query){

  const q = query.toLowerCase()

  return products.filter(product =>

    product.name.toLowerCase().includes(q) ||

    product.tags.some(tag => tag.includes(q))

  )

}


export function getFeaturedProducts(){

  return products.slice(0,4)

}