import React, { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiShoppingBag } from "react-icons/fi";
import { FaTags, FaShareAlt, FaHeart, FaRegHeart, FaTrademark, FaBoxOpen, FaTshirt } from "react-icons/fa";
import {
  Box,
  Button,
  Chip,
  Divider,
  Typography,
  FormHelperText,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Link from "@material-ui/core/Link";
import Rating from "@material-ui/lab/Rating";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { toast } from "react-toastify";
import clsx from "clsx";
import ShareButtons from "../ShareButtons.jsx";
import ShippingPolicy from "../Modal/ShippingPolicy.jsx";
import ReturnPolicy from "../Modal/ReturnPolicy.jsx";
import UpdateProfileModal from "../Modal/UpdateProfileModal.jsx";
import { makeStyles } from "@material-ui/core/styles";
import { formatPriceDollar } from "../../utils/formatPrice.js";
import YouMightAlsoLikeModal from "./YouMightAlsoLikeModal.jsx";
import CompleteTheLookModal from "./CompleteTheLookModal.jsx";

const useStyles = makeStyles((theme) => ({
  price: {
    fontSize: "1.6rem",
    fontWeight: 600,
    color: (props) => props.sale > 0 && "#DD8190",
  },
  rootPrice: {
    fontSize: "1.3rem",
    textDecoration: "line-through",
  },
  description: {
    whiteSpace: "pre-wrap",
    fontSize: 15,
    color: theme.palette.text.secondary,
  },
  // --- Color swatch styles ---
  colorOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    marginRight: 8,
    marginLeft: 8,
    border: "none",
    background: "transparent",
    gap: 8,
  },
  colorHexText: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    fontFamily: "monospace",
    userSelect: "none",
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    boxShadow: "none",
    transition: "transform .15s ease, box-shadow .15s ease",
    "&:hover": {
      transform: "scale(1.06)",
    },
  },
  colorCircleSelected: {
    boxShadow:
      "0 0 0 2px #fff, 0 0 0 4px #DD8190, 0 4px 8px rgba(0,0,0,.18) !important",
  },
  colorCircleDisabled: {
    filter: "grayscale(1) contrast(.85) brightness(.95)",
    boxShadow: "0 0 0 1px #eaeaea inset",
  },
  sizeFormControl: {
    margin: "20px 0 25px",
  },
  colorFormControl: {
    margin: "0px 0 25px",
  },
  sizeFormGroup: {
    flexDirection: "row",
  },
  label: {
    fontSize: 18,
    color: theme.palette.text.primary,
  },
  label1: {
    fontSize: 18,
    marginBottom: "10px",
    color: theme.palette.text.primary,
  },
  button: {
    height: 48,
    width: 160,
    marginRight: 10,
    borderRadius: 0,
  },
  productItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px 0",
  },
  productThumb: {
    width: 56,
    height: 56,
    objectFit: "cover",
    borderRadius: 4,
    marginRight: 12,
  },
  buttonheart: {
    height: 48,
    width: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #DD8190",
  },
  socialGroup: {
    ...theme.mixins.customize.flexMixin("center", "center"),
  },
  socialIcon: {
    fontSize: 18,
    margin: "0 10px",
    color: "#929292",
    transition: "transform .3s",
    "&:hover": {
      transform: "translateY(-1px)",
      color: theme.palette.secondary.main,
    },
  },
  buttoncz: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 15px",
    marginRight: "3px",
    marginLeft: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: "pointer",
  },
  NextIcon: {
    marginLeft: "29px",
    fontSize: "35px",
  },
  scrollerWrap: {
    position: "relative",
    marginTop: 12,
  },
  navBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
    background: "rgba(255,255,255,0.9)",
  },
  navLeft: { left: -8 },
  navRight: { right: -8 },
  buttonGroup: {
    marginTop: 30,
    display: "flex",
    alignItems: "center",
  },
  favoriteButton: {
    marginLeft: 10,
    padding: 10,
    border: "none",
    backgroundColor: "transparent",
  },
  addToCartFullWidth: {
    height: 48,
    width: "100%",
    borderRadius: 0,
  },
  qtyContainer: {
    display: "flex",
    alignItems: "stretch",
    border: "1px solid #000",
    borderRadius: 2,
    height: 76,
    width: 124,
    overflow: "hidden",
  },
  qtyNumber: {
    flex: "none",
    width: 82,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  qtySide: {
    width: 40,
    display: "flex",
    flexDirection: "column",
    borderLeft: "1px solid #000",
  },
  qtyBtn: {
    flex: "none",
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
  },
  qtyDivider: {
    height: 1,
    backgroundColor: "#000",
  },
  qtyIcon: {
    fontSize: 16,
  },
  pulseIcon: {
    animation: "$pulse 1.2s ease-in-out infinite",
    transformOrigin: "center",
  },
  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.2)" },
    "100%": { transform: "scale(1)" },
  },
}));

const ProductInfo = memo(
  ({
    product,
    user,
    handleUpdateModalOpen,
    addToCartHandler,
    shippingModalOpen,
    returnModalOpen,
    handleShippingClick,
    handleReturnClick,
    handleShippingModalClose,
    handleReturnModalClose,
    updateModalOpen,
    handleUpdateModalClose,
    isFavorite,
    handleAddToFavorites,
    handleRemoveFromFavorites,
  }) => {
    const { handleSubmit, control, watch, setValue } = useForm();
    const hasInitDefaultVariantRef = useRef(false);
    const classes = useStyles(product);
    const [likeModalOpen, setLikeModalOpen] = useState(false);
    const [outfitModalOpen, setOutfitModalOpen] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(product.price || 0);
    const currentUserId = user?._id || user?.id || "";
    const productId = product._id || "";
    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

    const safeNumber = useCallback((value, fallback = 0) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }, []);

    // Watch size and color changes
    const selectedSize = watch("size");
    const selectedColor = watch("color");

    // Extract unique sizes from variants
    const sizeOptions = useMemo(() => {
      if (hasVariants) {
        const sizes = [...new Set(product.variants.map((v) => v.size.toUpperCase()))];
        return sizes.sort((a, b) => {
          const order = { S: 0, M: 1, L: 2, XL: 3 };
          return (order[a] || 99) - (order[b] || 99);
        });
      }
      // Fallback to old structure
      if (product.size) {
        return Object.keys(product.size)
          .filter((key) => safeNumber(product.size[key]) > 0)
          .map((s) => s.toUpperCase())
          .sort((a, b) => {
            const order = { S: 0, M: 1, L: 2, XL: 3 };
            return (order[a] || 99) - (order[b] || 99);
          });
      }
      return [];
    }, [hasVariants, product.variants, product.size]);

    const colorOptions = useMemo(() => {
      if (hasVariants) {
        const colorMap = new Map();
        product.variants.forEach((variant) => {
          const colorValue = variant.color || "";
          if (!colorValue) return;
          if (!colorMap.has(colorValue)) {
            colorMap.set(colorValue, {
              hexCode: colorValue,
              name: colorValue, // Use hex/name if no name provided
            });
          }
        });
        return Array.from(colorMap.values());
      }
      if (product.colors && product.colors.length > 0) {
        return product.colors
          .filter((color) => color && (color.hexCode || color.name))
          .map((color) => ({
            name: color.name || color.hexCode,
            hexCode: color.hexCode || color.name || "",
          }));
      }
      return [];
    }, [hasVariants, product.variants, product.colors]);

    useEffect(() => {
      if (hasInitDefaultVariantRef.current) return;
      if (hasVariants && !selectedSize && !selectedColor) {
        const first = product.variants[0];
        if (first) {
          setValue("size", (first.size || "").toUpperCase(), { shouldValidate: true });
          setValue("color", first.color || "", { shouldValidate: true });
        }
      }
      hasInitDefaultVariantRef.current = true;
    }, [hasVariants, product.variants, selectedSize, selectedColor, setValue]);

    // Auto select first available size when no variants but sizes exist
    useEffect(() => {
      if (hasVariants) return;
      if (!selectedSize && sizeOptions.length > 0) {
        setValue("size", sizeOptions[0], { shouldValidate: true });
      }
    }, [hasVariants, sizeOptions, selectedSize, setValue]);

    const selectedVariant = useMemo(() => {
      if (hasVariants) {
        if (!product.variants) return null;

        const normalizedSize = selectedSize ? selectedSize.toLowerCase() : null;
        const normalizedColor = selectedColor || null;

        return product.variants.find((variant) => {
          const variantSize = (variant.size || "").toLowerCase();
          const variantColor = variant.color || "";
          const sizeMatches = !normalizedSize || variantSize === normalizedSize;
          const colorMatches = !normalizedColor || variantColor === normalizedColor;
          return sizeMatches && colorMatches;
        }) || null;
      }

      const variantFromSize = () => {
        if (!selectedSize) return null;
        const stock =
          product.size?.[selectedSize.toLowerCase()] ?? product.size?.[selectedSize] ?? 0;
        return {
          size: selectedSize,
          color: selectedColor || "",
          stock: safeNumber(stock),
          price: product.price,
        };
      };

      if (sizeOptions.length > 0) {
        return variantFromSize();
      }

      const aggregateStock =
        Object.values(product.size || {}).reduce((acc, value) => acc + safeNumber(value), 0) ||
        safeNumber(product.countInStock);

      return aggregateStock > 0
        ? {
            size: "",
            color: "",
            stock: aggregateStock,
            price: product.price,
          }
        : null;
    }, [
      hasVariants,
      product.variants,
      product.size,
      product.price,
      product.countInStock,
      selectedSize,
      selectedColor,
      sizeOptions.length,
      safeNumber,
    ]);

    useEffect(() => {
      const variantPrice = selectedVariant?.price;
      const basePrice = safeNumber(product.price);
      const nextPrice =
        variantPrice !== undefined && variantPrice !== null && safeNumber(variantPrice) > 0
          ? safeNumber(variantPrice)
          : basePrice;
      setCurrentPrice(nextPrice);
    }, [selectedVariant, product.price]);

    // Reset color if it's not available for selected size
    useEffect(() => {
      if (!hasVariants) return;
      if (selectedSize && selectedColor && product.variants) {
        const hasAvailableVariant = product.variants.some(
          (v) =>
            v.size.toLowerCase() === selectedSize.toLowerCase() &&
            v.color === selectedColor &&
            v.stock > 0
        );
        if (!hasAvailableVariant) {
          setValue("color", "", { shouldValidate: false });
        }
      }
    }, [hasVariants, selectedSize, selectedColor, product.variants, setValue]);

    const getAvailableSizesForColor = (colorHex) => {
      if (!product.variants || !colorHex) return sizeOptions;
      return product.variants
        .filter((v) => v.color === colorHex && v.stock > 0)
        .map((v) => v.size.toUpperCase())
        .filter((size, index, self) => self.indexOf(size) === index);
    };

    // Get available colors for selected size
    const getAvailableColorsForSize = (size) => {
      if (!product.variants || !size) return colorOptions;
      return product.variants
        .filter(
          (v) => v.size.toLowerCase() === size.toLowerCase() && v.stock > 0
        )
        .map((v) => v.color)
        .filter((color, index, self) => self.indexOf(color) === index)
        .map((hexCode) => ({
          hexCode,
          name: hexCode,
        }));
    };

    // Check if size is available (considering selected color)
    const isSizeAvailable = (size) => {
      if (!hasVariants || !product.variants) {
        // Fallback to old structure
        const sizeLower = size.toLowerCase();
        return product.size && safeNumber(product.size[sizeLower]) > 0;
      }
      if (selectedColor) {
        const availableSizes = getAvailableSizesForColor(selectedColor);
        return availableSizes.includes(size);
      }
      // If no color selected, check if size exists in any variant with stock
      return product.variants.some(
        (v) => v.size.toUpperCase() === size && v.stock > 0
      );
    };

    const isColorAvailable = (colorHex) => {
      if (!hasVariants || !product.variants) return true; // Fallback
      if (selectedSize) {
        const availableColors = getAvailableColorsForSize(selectedSize);
        return availableColors.some((c) => c.hexCode === colorHex);
      }
      return product.variants.some(
        (v) => v.color === colorHex && v.stock > 0
      );
    };

    // Filter color options to only show colors that have available sizes
    const availableColorOptions = useMemo(() => {
      if (!hasVariants || !product.variants || product.variants.length === 0) {
        return colorOptions;
      }
      if (selectedSize) {
        // If size is selected, only show colors that have this size available
        return getAvailableColorsForSize(selectedSize);
      }
      // If no size selected, show colors that have at least one size available
      return colorOptions.filter((color) => {
        const colorHex = color.hexCode || color.name;
        return product.variants.some(
          (v) => v.color === colorHex && v.stock > 0
        );
      });
    }, [colorOptions, selectedSize, product.variants, hasVariants]);

    const shouldRenderSizeSelector = sizeOptions.length > 0;
    const shouldRenderColorSelector = availableColorOptions.length > 0;
    const totalInventory = safeNumber(selectedVariant?.stock ?? product.countInStock);
    const isOutOfStock =
      (!hasVariants && shouldRenderSizeSelector && !selectedSize && totalInventory === 0) ||
      totalInventory === 0;

    return (
      <>
        <Box display="flex" alignItems="center" mb={1}>
          <Chip
            size="small"
            color="primary"
            icon={<FaTags style={{ fontSize: 14 }} />}
            label={product.category || "Uncategorized"}
            style={{ marginRight: 8, padding: "0 8px" }}
          />
          <Chip
            size="small"
            color="primary"
            icon={<FaTrademark style={{ fontSize: 14 }} />}
            label={product.brand || "Unbranded"}
            style={{ marginRight: 8, padding: "0 8px" }}
          />
          <Chip
            size="small"
            color={product.countInStock > 0 ? "primary" : "default"}
            icon={<FaBoxOpen style={{ fontSize: 14 }} />}
            label={`${product.countInStock > 0 ? `${product.countInStock} in stock` : "Out of stock"}`}
            style={{ padding: "0 8px" }}
          />
        </Box>
        <Typography variant="h5" component="h1" gutterBottom>
          {product.name}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <Rating
            name="read-only"
            value={product.rating}
            precision={0.5}
            readOnly
          />
          <Typography component="span" style={{ marginLeft: 5 }}>
            {`(${product.numReviews} reviews) | `}
          </Typography>
          <Typography
            component="span"
            style={{ marginLeft: 5 }}
            color={product.countInStock > 0 ? "secondary" : "black"}
          >
            {`Status: ${product.countInStock > 0 ? "In Stock" : "Out of Stock"
              }`}
          </Typography>
        </Box>

        {/* Price */}
        <Typography
          variant="h6"
          color="textPrimary"
          component="div"
          className={classes.price}
          gutterBottom
        >
          {product.sale ? (
            <Typography
              variant="subtitle2"
              color="textSecondary"
              component="span"
              className={classes.rootPrice}
            >
              {formatPriceDollar(currentPrice)}
            </Typography>
          ) : null}
          {"  "}{formatPriceDollar(currentPrice * (1 - (product.sale || 0) / 100))}
        </Typography>

        <Typography
          variant="body1"
          component="p"
          className={classes.description}
        >
          {product.description}
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit(addToCartHandler)}>
          {/* Size Selection */}
          {shouldRenderSizeSelector && (
            <FormControl
              fullWidth
              component="fieldset"
              classes={{ root: classes.sizeFormControl }}
            >
              <Box display="flex" alignItems="center">
                <FormLabel
                  component="legend"
                  color="secondary"
                  className={classes.label1}
                  style={{ marginRight: "16px", marginBottom: "14px" }}
                >
                  Size:
                </FormLabel>
                <Controller
                  name="size"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <RadioGroup {...field} row>
                        {sizeOptions.map((size) => {
                          const sizeAvailable = isSizeAvailable(size);
                          return (
                            <FormControlLabel
                              style={{ marginBottom: "15px" }}
                              key={size}
                              value={size}
                              control={<Radio style={{ display: "none" }} />}
                              label={
                                <Box
                                  className={clsx(
                                    classes.buttoncz,
                                    field.value === size && "active",
                                    !sizeAvailable && classes.disabled
                                  )}
                                  style={{
                                    borderRadius: 0,
                                    backgroundColor:
                                      field.value === size && sizeAvailable
                                        ? "#f5005730"
                                        : "transparent",
                                    opacity: sizeAvailable ? 1 : 0.5,
                                    pointerEvents: sizeAvailable
                                      ? "auto"
                                      : "none",
                                    borderColor: field.value === size ? "#DD8190" : "#ccc",
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (!sizeAvailable) return;
                                    const next = field.value === size ? "" : size;
                                    field.onChange(next);
                                  }}
                                >
                                  <Typography
                                    style={{
                                      color: sizeAvailable ? "black" : "gray",
                                    }}
                                  >
                                    {size}
                                  </Typography>
                                </Box>
                              }
                              disabled={!sizeAvailable}
                            />
                          );
                        })}
                      </RadioGroup>
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </>
                  )}
                  rules={{
                    required: shouldRenderSizeSelector
                      ? "Please select size!"
                      : false,
                  }}
                />
              </Box>
              <Typography variant="body1" className={classes.description}>
                {/* eslint-disable-next-line */}
                <Link
                  component="button"
                  onClick={(event) => {
                    event.preventDefault();
                    handleUpdateModalOpen();
                  }}
                >
                  Update your status to get recommended size
                </Link>
              </Typography>
              <UpdateProfileModal
                open={updateModalOpen}
                onClose={handleUpdateModalClose}
                user={user}
              />
            </FormControl>
          )}

          {/* Color Selection */}
          {shouldRenderColorSelector && (
            <FormControl
              fullWidth
              component="fieldset"
              className={classes.colorFormControl}
            >
              <Box display="flex" alignItems="center">
                <FormLabel
                  component="legend"
                  className={classes.label1}
                  style={{ marginRight: "16px", marginBottom: "-2px" }}
                >
                  Color:
                </FormLabel>
                <Controller
                  name="color"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <RadioGroup {...field} row>
                        {availableColorOptions.map((color, index) => {
                          const colorHex = color.hexCode || color.name;
                          const isSelected = field.value === colorHex;
                          const isAvailable = isColorAvailable(colorHex);
                          return (
                            <FormControlLabel
                              key={index}
                              value={colorHex}
                              control={<Radio style={{ display: "none" }} />}
                              label={
                                <Box
                                  className={classes.colorOption}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (!isAvailable) return;
                                    const next = isSelected ? "" : colorHex;
                                    field.onChange(next);
                                  }}
                                  style={{
                                    opacity: isAvailable ? 1 : 0.5,
                                    pointerEvents: isAvailable ? "auto" : "none",
                                  }}
                                >
                                  <Box
                                    className={clsx(
                                      classes.colorCircle,
                                      isSelected && classes.colorCircleSelected,
                                      !isAvailable && classes.colorCircleDisabled
                                    )}
                                    style={{ backgroundColor: colorHex || "#ccc" }}
                                  />
                                  <Typography className={classes.colorHexText}>
                                    {(color.name || colorHex || "").toUpperCase()}
                                  </Typography>
                                </Box>
                              }
                            />
                          );
                        })}
                      </RadioGroup>
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </>
                  )}
                  rules={{
                    required: shouldRenderColorSelector
                      ? "Please select a color!"
                      : false,
                  }}
                />
              </Box>
            </FormControl>
          )}

          {/* Quantity */}
          <FormControl className={classes.colorFormControl} variant="outlined">
            <Box display="flex" alignItems="center">
              <FormLabel
                component="legend"
                color="secondary"
                className={classes.label1}
                style={{ marginRight: "16px", marginBottom: "-2px" }}
              >
                Quantity:
              </FormLabel>
              <Controller
                name="qty"
                control={control}
                defaultValue={1}
                render={({ field }) => {
                  const value = Number(field.value) || 1;
                  const min = 1;
                  // Use variant stock if available, otherwise use product countInStock
                  const max = Math.max(0, safeNumber(selectedVariant?.stock ?? product.countInStock));
                  const disabled =
                    max === 0 ||
                    (shouldRenderSizeSelector && !selectedSize) ||
                    (shouldRenderColorSelector && !selectedColor && hasVariants);
                  const handleChange = (next) => {
                    if (disabled) return;
                    const clamped = Math.min(Math.max(next, min), Math.max(min, max));
                    field.onChange(clamped);
                  };
                  return (
                    <Box>
                      <Box className={classes.qtyContainer} aria-disabled={disabled}>
                        <Box className={classes.qtyNumber}>
                          <Typography>{disabled ? 0 : value}</Typography>
                        </Box>
                        <Box className={classes.qtySide}>
                          <Box
                            className={classes.qtyBtn}
                            onClick={() => handleChange(value + 1)}
                            style={{ opacity: disabled || value >= max ? 0.4 : 1, pointerEvents: disabled || value >= max ? "none" : "auto" }}
                            title={disabled ? "Out of stock" : "Increase"}
                          >
                            <AddIcon className={classes.qtyIcon} />
                          </Box>
                          <Box className={classes.qtyDivider} />
                          <Box
                            className={classes.qtyBtn}
                            onClick={() => handleChange(value - 1)}
                            style={{ opacity: disabled || value <= min ? 0.4 : 1, pointerEvents: disabled || value <= min ? "none" : "auto" }}
                            title={disabled ? "Out of stock" : "Decrease"}
                          >
                            <RemoveIcon className={classes.qtyIcon} />
                          </Box>
                        </Box>
                      </Box>
                      {disabled && (
                        <FormHelperText error>
                          {max === 0
                            ? "Out of stock"
                            : shouldRenderSizeSelector && !selectedSize
                              ? "Please select size"
                              : shouldRenderColorSelector && !selectedColor
                                ? "Please select color"
                                : "Out of stock"}
                        </FormHelperText>
                      )}
                    </Box>
                  );
                }}
              />
            </Box>
            {/* Button Groups */}
            {/* Top row: two new buttons + Wishlist */}
            <Box className={classes.buttonGroup}>
              <Button
                variant="contained"
                color="default"
                startIcon={<FaRegHeart className={classes.pulseIcon} />}
                className={classes.button}
                type="button"
                onClick={() => setLikeModalOpen(true)}
                style={{ backgroundColor: "#00bcd4", color: "#fff", whiteSpace: "nowrap", paddingLeft: 16, paddingRight: 16, width: "auto", minWidth: "auto" }}
              >
                You might also like
              </Button>
              <Button
                variant="contained"
                color="default"
                startIcon={<FaTshirt className={classes.pulseIcon} />}
                className={classes.button}
                type="button"
                onClick={() => {
                  if (!currentUserId) {
                    toast.info("Please sign in to see outfit recommendations.");
                    return;
                  }
                  setOutfitModalOpen(true);
                }}
                style={{ backgroundColor: "#9c27b0", color: "#fff", whiteSpace: "nowrap", paddingLeft: 16, paddingRight: 16, width: "auto", minWidth: "auto" }}
              >
                Complete the look
              </Button>
              {/* Favorite Button (Wishlist) */}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FaHeart />}
                className={classes.button}
                disabled={product.countInStock === 0}
                type="button"
                onClick={
                  isFavorite ? handleRemoveFromFavorites : handleAddToFavorites
                }
                style={{ whiteSpace: "nowrap", paddingLeft: 16, paddingRight: 16 }}
              >
                {isFavorite ? (
                  <span style={{ whiteSpace: "nowrap", wordBreak: "keep-all" }}>
                    remove wishlist
                  </span>
                ) : (
                  <span style={{ whiteSpace: "nowrap", wordBreak: "keep-all" }}>
                    wishlist
                  </span>
                )}
              </Button>
            </Box>
            {/* Bottom row: Add to Cart full width */}
            <Box style={{ marginTop: 12, width: "100%" }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FiShoppingBag />}
                className={classes.addToCartFullWidth}
                disabled={
                  isOutOfStock ||
                  (shouldRenderSizeSelector && !selectedSize) ||
                  (shouldRenderColorSelector && !selectedColor && hasVariants)
                }
                type="submit"
                fullWidth
              >
                Add to Cart
              </Button>
            </Box>
          </FormControl>
        </form>

        <YouMightAlsoLikeModal
          open={likeModalOpen}
          onClose={() => setLikeModalOpen(false)}
          userId={currentUserId}
          productId={productId}
        />

        <CompleteTheLookModal
          open={outfitModalOpen}
          onClose={() => setOutfitModalOpen(false)}
          userId={currentUserId}
          productId={productId}
          user={user}
        />

        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          mt={2}
        >
          <Box
            display="flex"
            alignItems="center"
            onClick={handleShippingClick}
            style={{ cursor: "pointer" }}
            mb={2}
          >
            <Typography variant="h6" component="div">
              Shipping Policy
              <Typography variant="body2" color="textSecondary">
                Free shipping on orders over 1.000 $
              </Typography>
            </Typography>
            <ChevronRightIcon className={classes.NextIcon} />
          </Box>

          <Box
            display="flex"
            alignItems="center"
            onClick={handleReturnClick}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" component="div">
              Return Policy
              <Typography variant="body2" color="textSecondary">
                Free returns within 7 days
              </Typography>
            </Typography>
            <ChevronRightIcon className={classes.NextIcon} />
          </Box>
        </Box>
        <ShippingPolicy
          open={shippingModalOpen}
          onClose={handleShippingModalClose}
        />
        <ReturnPolicy open={returnModalOpen} onClose={handleReturnModalClose} />

        {/* Tags */}
        <Divider style={{ marginTop: 30 }} />
        <Box display="flex" alignItems="center" my={2}>
          <Box mr={1} color="text.secondary" display="flex" alignItems="center">
            <FaTags />
          </Box>
          <Typography className={classes.label}>Tags:</Typography>
          <Box ml={2}>
            <Chip
              size="small"
              label={product.category}
              style={{ marginRight: 8 }}
            />
            <Chip size="small" label={product.brand} />
          </Box>
        </Box>
        <Divider />

        {/* Share Section */}
        <Box display="flex" alignItems="center" my={2}>
          <Box mr={1} color="text.secondary" display="flex" alignItems="center">
            <FaShareAlt />
          </Box>
          <Typography className={classes.label}>Share:</Typography>
          <Box ml={1}>
            <div className={classes.socialGroup}>
              <ShareButtons
                url={`https://cybershop-v1.herokuapp.com/product/${product._id}`}
              />
            </div>
          </Box>
        </Box>
      </>
    );
  }
);

export default ProductInfo;
