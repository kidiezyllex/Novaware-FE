import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import AddShoppingCartOutlinedIcon from "@material-ui/icons/AddShoppingCartOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { RiShoppingBag3Fill } from "react-icons/ri";
import Tooltip from "@material-ui/core/Tooltip";
import ProductModalView from "./ProductModalView";
import { addToCart, setOpenCartDrawer } from "../../actions/cartActions";
import { useDispatch } from "react-redux";
import { formatPriceDollar } from "../../utils/formatPrice";

const ProductCard = (props) => {
  const { _id, name, images, price, sale, variants } = props;
  const [openModal, setOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const variant = variants && variants.length > 0 ? variants[0] : null;
  const finalPrice = variant?.price ? variant?.price : (price * (1 - sale / 100));

  const handleAddToCart = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(setOpenCartDrawer(true));
    dispatch(addToCart(id, 1, variant?.size || "M", variant?.color || ""));  
  };
  const handleOpenQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenModal(true);
  };


  return (
    <>
      <motion.div
        className="group h-full overflow-hidden bg-white border border-pink-500 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <RouterLink to={`/product?id=${_id}`} className="flex h-full flex-col">
          {/* Image Container with proper aspect ratio */}
          <div className="relative w-full pb-[100%] overflow-hidden bg-gray-50">
            {sale > 0 && (
              <div className="absolute top-3 left-3 z-20 bg-pink-600 px-2 py-1 text-xs font-semibold uppercase text-white">
                -{sale}%
              </div>
            )}

            {/* Back Image */}
            {images && images[1] && (
              <motion.img
                className="absolute inset-0 h-full w-full object-contain"
                src={images[1]}
                alt={`${name} - back view`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                onError={(e) => {
                  e.target.src = images[0] || '';
                }}
              />
            )}

            {/* Front Image with fade on hover */}
            {images && images[0] && (
              <motion.img
                className="absolute inset-0 h-full w-full object-contain bg-white"
                src={images[0]}
                alt={name}
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 0 : 1 }}
                transition={{ duration: 0.4 }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-1 flex-col p-3 bg-primary border-t rounded-t-xl">
            <Tooltip title={name || ""} arrow>
              <h3 className="mb-2 line-clamp-2 text-base font-light leading-6 text-white">
                {name}
              </h3>
            </Tooltip>
            <div className="mt-auto flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${sale > 0 ? "text-white" : "text-white"}`}>
                  {formatPriceDollar(finalPrice)}
                </span>
                {sale > 0 && (
                  <span className="text-base italic text-white line-through">
                    {formatPriceDollar(finalPrice)}
                  </span>
                )}
              </div>

              {/* Mobile Add to Cart Button */}
              <div className="w-full md:hidden">
                <button
                  onClick={(e) => handleAddToCart(e, _id)}
                  className="mt-2 w-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 active:scale-95"
                >
                  <span className="flex items-center justify-center gap-2">
                    <RiShoppingBag3Fill />
                    Add to Cart
                  </span>
                </button>
              </div>
            </div>
            {/* Desktop Action Buttons */}
            <div
              className="grid grid-cols-2 gap-2 mt-4"
            >
              <button
                onClick={handleOpenQuickView}
                className="h-10 flex items-center gap-2 justify-center border border-white text-white hover:bg-pink-600"
              >
                <VisibilityOutlinedIcon fontSize="small" className="text-white" />
                View
              </button>
              <button
                onClick={(e) => handleAddToCart(e, _id)}
                className="h-10 flex items-center gap-2 justify-center border border-white text-white hover:bg-pink-600"
              >
                <AddShoppingCartOutlinedIcon fontSize="small" className="text-white" />
                Add
              </button>
            </div>
          </div>
        </RouterLink>
      </motion.div>
      <ProductModalView
        {...props}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default ProductCard;
