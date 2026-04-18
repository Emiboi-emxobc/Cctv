import { categories } from "./categories.js"

export function getCategories(){

  return categories

}

export function getCategoryBySlug(slug){

  return categories.find(cat => cat.slug === slug)

}