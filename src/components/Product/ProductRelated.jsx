import { Box, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { useGetRelatedProducts } from "../../hooks/api/useProduct";
import ProductCard from "./ProductCard";
import Loader from "../Loader";
import Message from "../Message";

const ProductRelated = ({ category = "", excludeId }) => {
  const { data: productRelatedResponse, isLoading: loading, error: queryError } = useGetRelatedProducts(
    category && excludeId ? { category, excludeId } : undefined
  );

  const products = productRelatedResponse?.data?.products || [];
  const error = queryError?.message || (queryError ? String(queryError) : null);
  return (
    <>
      <div className='w-full flex items-center justify-center gap-4 my-10'>
        <div className='h-[1px] bg-primary flex-1'></div>
        <Typography variant="h5" align="center" className="tracking-widest">Related Products</Typography>
        <div className='h-[1px] bg-primary flex-1'></div>
      </div>
      <Paper
        style={{ padding: "0px 20px", margin: "0 50px" }}
        elevation={0}
      >
        <Grid container spacing={4}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message>{error}</Message>
          ) : (
            <>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard {...product} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default ProductRelated;
