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
  const { _id, name, images, price, sale } = props;
  const [openModal, setOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(setOpenCartDrawer(true));
    dispatch(addToCart(id, 1, "m"));
  };
  const handleOpenQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenModal(true);
  };

  const finalPrice = price * (1 - sale / 100);

  return (
    <>
      <motion.div
        className="group h-full overflow-hidden bg-white border border-gray-300 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <RouterLink to={`/product/${_id}`} className="flex h-full flex-col">
          {/* Image Container with proper aspect ratio */}
          <div className="relative w-full pb-[100%] overflow-hidden bg-gray-50">
            {sale > 0 && (
              <div className="absolute top-3 left-3 z-20 bg-primary px-2 py-1 text-xs font-semibold uppercase text-white">
                -{sale}%
              </div>
            )}
            
            {/* Desktop Action Buttons */}
            <motion.div
              className="absolute top-1/2 right-3 z-20 hidden flex-col items-center gap-2 md:flex"
              initial={{ x: "150%", opacity: 0 }}
              animate={{
                x: isHovered ? "0%" : "150%",
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Tooltip title="Quick view" placement="left" arrow>
                <button
                  onClick={handleOpenQuickView}
                  className="flex items-center justify-center bg-white p-2.5 text-gray-600 border border-gray-300 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary hover:scale-110"
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </button>
              </Tooltip>
              <Tooltip title="Add to cart" placement="left" arrow>
                <button
                  onClick={(e) => handleAddToCart(e, _id)}
                  className="flex items-center justify-center bg-white p-2.5 text-gray-600 border border-gray-300 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary hover:scale-110"
                >
                  <AddShoppingCartOutlinedIcon fontSize="small" />
                </button>
              </Tooltip>
            </motion.div>

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
                className="absolute inset-0 h-full w-full object-contain"
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
          <div className="flex flex-1 flex-col p-3 bg-pink-50 border-t border-t-gray-300">
            <Tooltip title={name || ""} arrow>
              <h3 className="mb-2 line-clamp-2 text-base font-medium leading-6 text-gray-800 transition-colors group-hover:text-primary">
                {name}
              </h3>
            </Tooltip>
            <div className="mt-auto flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${sale > 0 ? "text-primary" : "text-gray-900"}`}>
                  {formatPriceDollar(finalPrice)}
                </span>
                {sale > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPriceDollar(price)}
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
