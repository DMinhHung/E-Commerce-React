import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Button,
  Dropdown,
  ProductItem,
  QuantityInput,
  StandardSelectInput,
} from "../components";

import { addProductToTheCart } from "../features/cart/cartSlice";
import { useAppDispatch } from "../hooks";
import WithSelectInputWrapper from "../utils/withSelectInputWrapper";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  gallery: { url: string }[];
  price: number;
  stock: number;
  description: string;
  category: { name: string };
  brand: { name: string };
  item_variant?: Variant[];
}

interface Variant {
  id: number;
  name: string;
  thumbnail?: string | null;
  price: number;
  stock: number;
  attributes: {
    name: string;
    value: string;
  }[];
}

const formatCategoryNameSafe = (category: any) => {
  if (!category) return "";
  if (typeof category === "string") return category.split("_").join(" ");
  if (typeof category === "object" && category.name)
    return category.name.split("_").join(" ");
  return "";
};

const SingleProduct = () => {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [variant, setVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>("");

  const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_INSIGHT_URL}/api/v1/end_user/product/form/view?id=${params.id}`
        );
        const product: Product = res.data.data;
        setSingleProduct(product);
        setMainImage(product.thumbnail);

        if (product.item_variant?.length) {
          const firstVariant = product.item_variant[0];
          setVariant(firstVariant);

          const sizeAttr = firstVariant.attributes.find(a =>
            a.name.toLowerCase().includes("size")
          );
          const colorAttr = firstVariant.attributes.find(a =>
            a.name.toLowerCase().includes("màu")
          );

          setMainImage(firstVariant.thumbnail || product.thumbnail);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleProduct();
  }, [params.id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_INSIGHT_URL}/api/v1/end_user/product/form/view`
        );
        setProducts(res.data.data.items || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (!singleProduct) return;
    dispatch(
      addProductToTheCart({
        id: variant ? variant.id : singleProduct.id,
        image: variant?.thumbnail || singleProduct.thumbnail,
        title: variant ? variant.name : singleProduct.name,
        category: formatCategoryNameSafe(singleProduct.category),
        price: variant?.price || singleProduct.price,
        quantity,
        stock: variant?.stock || singleProduct.stock,
      })
    );
    toast.success("Product added to the cart");
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!singleProduct) return null;

  return (
    <div className="max-w-screen-2xl mx-auto px-5 max-[400px]:px-3">
      <div className="grid grid-cols-3 gap-x-8 max-lg:grid-cols-1">
        {/* Product images */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <img
            src={mainImage}
            alt={singleProduct.name}
            className="w-full h-auto object-cover rounded-lg cursor-zoom-in"
            onClick={() => window.open(mainImage, "_blank")}
          />
          <div className="flex gap-2">
            {[mainImage, ...singleProduct.gallery.map(g => g.url)].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery ${idx}`}
                className="w-16 h-16 object-cover rounded cursor-pointer hover:ring-2 hover:ring-brown"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="w-full flex flex-col gap-5 mt-9">
          <h1 className="text-4xl font-semibold">{singleProduct.name}</h1>
          <p className="text-base text-secondaryBrown">
            {formatCategoryNameSafe(singleProduct.category)}
          </p>
          <p className="text-2xl font-bold">
            {((variant?.price || singleProduct.price)).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </p>

          {/* Variant selector */}
          {singleProduct.item_variant?.length > 0 && (
            <SelectInputUpgrade
              selectList={singleProduct.item_variant.map(v => ({
                id: v.id,
                value: v.name,
              }))}
              value={variant?.id || ""}
              onChange={(e) => {
                const selectedVariant = singleProduct.item_variant!.find(
                  v => v.id === parseInt(e.target.value)
                );
                if (selectedVariant) {
                  setVariant(selectedVariant);
                  setMainImage(selectedVariant.thumbnail || singleProduct.thumbnail);
                  setQuantity(1);
                }
              }}
            />
          )}

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <QuantityInputUpgrade
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          <Button mode="brown" text="Add to cart" onClick={handleAddToCart} />

          {singleProduct.description && (
            <Dropdown dropdownTitle="Description">
              {singleProduct.description}
            </Dropdown>
          )}
        </div>
      </div>

      {/* Similar products */}
      <div className="mt-24">
        <h2 className="text-black/90 text-5xl mb-12 text-center max-lg:text-4xl">
          Similar Products
        </h2>
        <div className="flex flex-wrap justify-between items-center gap-y-8 mt-12 max-xl:justify-start max-xl:gap-5">
          {products.slice(0, 3).map((product) => (
            <ProductItem
              key={product.id}
              id={product.id}
              image={product.thumbnail || ""}
              title={product.name}
              category={formatCategoryNameSafe(product.category)}
              price={product.price}
              popularity={0}
              stock={product.stock}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
