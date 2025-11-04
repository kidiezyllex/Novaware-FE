import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  Typography,
} from "@material-ui/core";
import { FaTags, FaTrademark, FaBoxOpen } from "react-icons/fa";
import CallMadeIcon from "@material-ui/icons/CallMade";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { formatPriceDollar } from "../../utils/formatPrice.js";
import { useGNNPersonalizedProducts } from "../../hooks/api/useRecommend";
import LottieLoading from "../LottieLoading.jsx";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  transparentPaper: {
    background: "transparent",
    boxShadow: "none",
  },
  gnnLikeSwiper: {
    '& .swiper-slide': {
      backgroundColor: 'transparent !important',
      background: 'transparent !important',
      boxShadow: 'none !important',
    },
    '& .swiper-slide-shadow, & .swiper-slide-shadow-left, & .swiper-slide-shadow-right, & .swiper-slide-shadow-top, & .swiper-slide-shadow-bottom': {
      display: 'none !important',
      backgroundImage: 'none !important',
      backgroundColor: 'transparent !important',
      opacity: '0 !important',
    },
  },
  card: { 
    width: 320, 
    height: "auto", 
    borderRadius: 8 
  },
  media: { 
    height: 300, 
    backgroundSize: "contain", 
    objectFit: "contain" 
  },
}));

const YouMightAlsoLikeModal = ({ open, onClose, userId }) => {
  const classes = useStyles();
  const { data: likeData, isLoading: likeLoading, error: likeError } = useGNNPersonalizedProducts(
    userId || "",
    { k: 5 }
  );

  useEffect(() => {
    if (!open) return;
    if (!userId) {
      toast.info("Please sign in to see personalized recommendations.");
      onClose();
      return;
    }
    if (likeError) {
      toast.error("Failed to load recommendations.");
    }
  }, [open, userId, likeError, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      style={{ zIndex: 9999 }}
      PaperProps={{ className: classes.transparentPaper, elevation: 0 }}
      BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.4)" } }}
    >
      <DialogContent style={{ padding: 0 }}>
        {userId && likeLoading && <LottieLoading />}
        {userId && !likeLoading && !likeError && likeData?.data?.products?.length > 0 && (
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className={clsx("gnn-like-swiper !overflow-hidden", classes.gnnLikeSwiper)}
          >
            {likeData.data.products.slice(0, 5).map((p, idx) => (
              <SwiperSlide key={p._id || idx} style={{ backgroundColor: "transparent", width: 320 }}>
                <Card className={classes.card} style={{ margin: "0 auto" }}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={p.images && p.images.length > 0 ? p.images[0] : "https://via.placeholder.com/180"}
                      title={p.name}
                    />
                    <CardContent>
                      <Typography variant="subtitle2" noWrap>
                        {p.name}
                      </Typography>
                      <Typography variant="subtitle2" color="secondary">
                        {formatPriceDollar(p.price * (1 - (p.sale || 0) / 100))}
                      </Typography>
                      {(p.category || p.brand || typeof p.countInStock !== 'undefined') && (
                        <Box mt={1} display="flex" alignItems="center" flexWrap="wrap" style={{ gap: 6, rowGap: 6 }}>
                          {p.category && (
                            <Chip
                              size="small"
                              color="primary"
                              icon={<FaTags style={{ fontSize: 14 }} />}
                              label={p.category}
                              style={{ padding: "0 8px" }}
                            />
                          )}
                          {p.brand && (
                            <Chip
                              size="small"
                              color="primary"
                              icon={<FaTrademark style={{ fontSize: 14 }} />}
                              label={p.brand}
                              style={{ padding: "0 8px" }}
                            />
                          )}
                          <Chip
                            size="small"
                            color={(Number(p.countInStock) || 0) > 0 ? "primary" : "default"}
                            icon={<FaBoxOpen style={{ fontSize: 14 }} />}
                            label={`${(Number(p.countInStock) || 0) > 0 ? `${Number(p.countInStock)} in stock` : "Out of stock"}`}
                            style={{ padding: "0 8px" }}
                          />
                        </Box>
                      )}
                      <Box mt={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="medium"
                          style={{ width: "100%" }}
                          onClick={() => window.open(`/product/${p._id || ''}`, "_blank")}
                          endIcon={<CallMadeIcon />}
                        >
                          View details
                        </Button>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default YouMightAlsoLikeModal;

