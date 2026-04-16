import Div from "../components/Div.js";
import Feature from '../components/Feature.js';
import ProductGrid from '../components/ProductGrid.js';
import Paragraph from "../components/Paragraph.js";
import Button from "../components/Button.js";
import Title from "../components/Title.js";
import Img from "../components/Img.js";
import Icon from "../components/icons/Icon.js"
import ProductCard from "../components/ProductCard.js";
import { getProducts } from "../data/products/index.js";

export default function HomePage() {
  const products = getProducts().slice(0, 4);

  return Div(
    { className: "page home-page" },

    // Hero Section
    Div(
      { className: " hero-section" },
      /* Img({
        src: "images/hero.png",
        className: "hero-image"
      }), */

      Title(
        { className: "hero-title",text:"Shop Premium Furniture" }
      ),

      Paragraph({text:"Discover quality handcrafted furniture built for comfort, durability, and modern living.",
        className:"hero-tagline"
      }),

      Button(
        { 
          className: "btn-primary", 
          onClick: () => Router.navigate("/shop") 
        }, 
        Icon({name:"shopping-cart"}),
        "Start shopping"
      )
    ),

    // Featured Products Section
    Feature({
      name:"Featured products",
      id:"featured-products"
    },ProductGrid(products))
  );
}