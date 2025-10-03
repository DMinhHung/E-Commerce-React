import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProductItem from "./ProductItem";

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  price: number;
  stock: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  brand: {
    id: number;
    name: string;
    logo: string;
  };
}

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProducts = async () => {
      try {
        console.log("API URL:", import.meta.env.VITE_ADMIN_INSIGHT_URL);
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_INSIGHT_URL}/api/v1/end_user/product/form`
        );
        setProducts(res.data.data.items || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  return (
    <div
      id="gridTop"
      className="max-w-screen-2xl flex flex-wrap justify-between items-center gap-y-8 mx-auto mt-12 max-xl:justify-start max-xl:gap-5 px-5 max-[400px]:px-3"
    >
      {products.map((product) => (
        <ProductItem
          key={product.id}
          id={product.id}
          title={product.name}
          image={product.thumbnail}
          category={product.category.name}
          price={product.price}
          stock={product.stock}
        />
      ))}
    </div>
  );
};

export default React.memo(ProductGrid);
