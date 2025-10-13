import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface BannerItem {
  id: number;
  title: string;
  image: string;
  link: string;
  status: number;
  sort_order: number;
}

const Banner: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // const fetchBanners = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_ADMIN_INSIGHT_URL}/api/v1/end_user/banner/form`
  //     );
  //     if (res.data.status) {
  //       const sortedBanners = (res.data.data.items as BannerItem[]).sort(
  //         (a, b) => a.sort_order - b.sort_order
  //       );
  //       setBanners(sortedBanners);
  //     }
  //   } catch (err) {
  //     console.error("Lỗi khi lấy banner:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBanners = async () => {
    try {
      console.log("API URL:", import.meta.env.VITE_APP_ADMIN_INSIGHT_URL);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_ADMIN_INSIGHT_URL}/api/v1/end_user/banner/form`
      );
      if (res.data.status) {
        const sortedBanners = (res.data.data.items as BannerItem[]).sort(
          (a, b) => a.sort_order - b.sort_order
        );
        setBanners(sortedBanners);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return <div>Đang tải banner...</div>;
  }

  if (!banners.length) {
    return <div>Không có banner</div>;
  }

  // Lấy banner có sort_order nhỏ nhất
  const banner = banners.reduce((prev, curr) => (curr.sort_order < prev.sort_order ? curr : prev), banners[0]);

  return (
    <div
      className="banner w-full flex flex-col justify-end items-center max-sm:h-[550px] max-sm:gap-2"
      style={{
        backgroundImage: `url(${banner.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-white text-center text-6xl font-bold tracking-[1.86px] leading-[60px] max-sm:text-4xl max-[400px]:text-3xl">
        {banner.title}
      </h2>
      <h3 className="text-white text-3xl font-normal leading-[72px] tracking-[0.9px] max-sm:text-xl max-[400px]:text-lg">
        The High-Quality Collection
      </h3>
      <div className="flex justify-center items-center gap-3 pb-10 max-[400px]:flex-col max-[400px]:gap-1 w-[420px] max-sm:w-[350px] max-[400px]:w-[300px]">
        <Link
          to={banner.link}
          className="bg-white text-black text-center text-xl border border-[rgba(0, 0, 0, 0.40)] font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center"
        >
          Shop Now
        </Link>
        <Link
          to={banner.link}
          className="text-white border-white border-2 text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center"
        >
          See Collection
        </Link>
      </div>
    </div>
  );
};

export default Banner;
