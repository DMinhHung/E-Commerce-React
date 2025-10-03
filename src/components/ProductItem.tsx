import { Link } from "react-router-dom";
import { formatCategoryName } from "../utils/formatCategoryName";

interface ProductItemProps {
  id: number;
  image: string;
  title: string;
  category: string;
  price: number;
  stock: number;
}

const formatPriceVND = (price: number) => {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const ProductItem = ({
  id,
  image,
  title,
  category,
  price,
  stock,
}: ProductItemProps) => {
  return (
    <div className="w-[400px] flex flex-col gap-3 justify-center max-md:w-[300px] bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link
        to={`/product/${id}`}
        className="w-full h-[300px] max-md:h-[200px] overflow-hidden rounded-t-lg"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </Link>

      <div className="px-4 py-2 flex flex-col gap-2">
        <Link
          to={`/product/${id}`}
          className="text-black text-center text-2xl max-md:text-xl font-semibold hover:text-secondaryBrown transition-colors"
        >
          <h2>{title}</h2>
        </Link>

        <p className="text-secondaryBrown text-center text-lg max-md:text-base">
          {formatCategoryName(category)}
        </p>

        <p className="text-black text-center text-2xl max-md:text-xl font-bold">
          {formatPriceVND(price)}
        </p>

        <div className="flex flex-col gap-2 mt-2">
          <Link
            to={`/product/${id}`}
            className="text-white bg-secondaryBrown text-center text-lg max-md:text-base font-medium w-full py-3 rounded-md shadow-md hover:bg-[#8b5e3c] transition-colors"
          >
            Xem sản phẩm
          </Link>
          <Link
            to={`/product/${id}`}
            className="bg-white text-black text-center text-lg max-md:text-base border border-gray-300 font-medium w-full py-3 rounded-md shadow-sm hover:bg-gray-100 transition-colors"
          >
            Tìm hiểu thêm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
