import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import LottieLoading from "../LottieLoading";
import ProductCard from "../Product/ProductCard";
import { useGetTopProducts } from "../../hooks/api/useProduct";
const TopProducts: React.FC = () => {
  const { data: productTopRatedResponse, isLoading: loadingProductTop, error: errorProductTop } = useGetTopProducts({ pageNumber: 1, perPage: 15 });
  const productTopRaw = productTopRatedResponse?.data?.products || [];
  const productTop = React.useMemo(() => productTopRaw.slice(0, 15).sort(() => 0.5 - Math.random()), [productTopRaw]);

  return (
    <div className="mx-auto px-16">
      <div className='w-full flex items-center justify-center gap-4 my-10'>
        <div className='h-[1px] bg-primary flex-1'></div>
        <Typography variant="h5" align="center" className="tracking-widest">Top Products</Typography>
        <div className='h-[1px] bg-primary flex-1'></div>
      </div>
      {loadingProductTop ? (
        <LottieLoading className="flex justify-center my-10" />
      ) : errorProductTop ? (
        <div className="p-4 mb-4 bg-red-50 text-red-700 rounded border border-red-300">
          {errorProductTop.message || String(errorProductTop)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {productTop && productTop.map((product) => (
              <div key={product._id}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
          <div className="flex justify-center my-8">
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/shop?sort_by=rating"
              className="!rounded-none"
            >
              View more
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopProducts;


