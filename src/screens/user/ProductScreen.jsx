import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { addToCart } from "../../actions/cartActions";
import { toast } from "react-toastify";
import { Grid, Container, Link } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import ProductReview from "../../components/Product/ProductReview.jsx";
import ProductRelated from "../../components/Product/ProductRelated.jsx";
import ProductInfo from "../../components/Product/ProductInfo.jsx";
import ProductImageGallery from "../../components/Product/ProductImageGallery.jsx";
import { useGetProduct, useRecommendSize } from "../../hooks/api/useProduct";
import { useGetProfile } from "../../hooks/api/useUser";
import { useGetFavorites } from "../../hooks/api/useUser";
import { useAddFavorite, useRemoveFavorite } from "../../hooks/api/useUser";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  productInfo: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: "0 !important",
    },
  },
}));

const ProductScreen = ({ match, setLoginModalOpen }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const productId = match.params.id;

  // Hooks for API data
  const { data: productResponse, isLoading: loading, error: productError } = useGetProduct(productId);
  const product = productResponse?.data?.product;
  
  const { data: userResponse } = useGetProfile();
  const user = userResponse?.data?.user;
  
  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  
  const { data: sizeResponse } = useRecommendSize(user?._id || "");
  const recommendedSize = sizeResponse?.data?.recommendedSize;
  
  const { data: favoritesResponse } = useGetFavorites(userInfo?._id || "");
  const favoriteItems = favoritesResponse?.data?.favoriteItems || [];
  
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  
  const error = productError?.message || (productError ? String(productError) : null);

  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Check if product is in favorites
  useEffect(() => {
    if (userInfo && favoriteItems && product?._id) {
      const isProductInFavorites = favoriteItems.some(
        (item) => item._id === product._id
      );
      setIsFavorite(isProductInFavorites);
    }
  }, [userInfo, favoriteItems, product?._id]);

  const addToCartHandler = ({ qty, size, color }) => {
    const selectedColor = product.colors.find((c) => c.hexCode === color);
    const colorName = selectedColor ? selectedColor.name : "";

    dispatch(addToCart(productId, qty, size, color, colorName));
    toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  const handleAddToFavorites = async () => {
    if (userInfo && product?._id) {
      try {
        await addFavoriteMutation.mutateAsync({
          userId: userInfo._id,
          body: { productId: product._id }
        });
        toast.success("Đã thêm vào yêu thích!");
      } catch (error) {
        toast.error("Thêm vào yêu thích thất bại");
      }
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (userInfo && product?._id) {
      try {
        await removeFavoriteMutation.mutateAsync({
          userId: userInfo._id,
          productId: product._id
        });
        toast.info("Đã xóa khỏi yêu thích!");
      } catch (error) {
        toast.error("Xóa khỏi yêu thích thất bại");
      }
    }
  };

  return (
    <Container maxWidth="xl" className={classes.wrapper}>
      {loading ? (
        <Loader my={200} />
      ) : error ? (
        <Message mt={100}>{error}</Message>
      ) : product && product._id ? (
        <>
          <Meta title={product.name} />
          <Grid container className={classes.breadcrumbsContainer}>
            <Grid item>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link color="inherit" component={RouterLink} to="/">
                  Home
                </Link>
                <Link color="inherit" component={RouterLink} to="/">
                  Product
                </Link>
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to={`/product/${product._id}`}
                >
                  {product.name || "Not found product"}
                </Link>
              </Breadcrumbs>
            </Grid>
          </Grid>

          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <ProductImageGallery product={product} />
            </Grid>
            <Grid item xs={12} md={6} className={classes.productInfo}>
              <ProductInfo
                product={product}
                recommendedSize={recommendedSize}
                user={user}
                handleUpdateModalOpen={() => setUpdateModalOpen(true)}
                addToCartHandler={addToCartHandler}
                shippingModalOpen={shippingModalOpen}
                returnModalOpen={returnModalOpen}
                handleShippingClick={() => setShippingModalOpen(true)}
                handleReturnClick={() => setReturnModalOpen(true)}
                handleShippingModalClose={() => setShippingModalOpen(false)}
                handleReturnModalClose={() => setReturnModalOpen(false)}
                updateModalOpen={updateModalOpen}
                handleUpdateModalClose={() => setUpdateModalOpen(false)}
                isFavorite={isFavorite}
                handleAddToFavorites={handleAddToFavorites}
                handleRemoveFromFavorites={handleRemoveFromFavorites}
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              <ProductReview reviews={product.reviews} productId={productId} />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              {product && (
                <ProductRelated
                  category={product.category}
                  excludeId={product._id}
                />
              )}
            </Grid>
          </Grid>
        </>
      ) : null}
    </Container>
  );
};

export default ProductScreen;
