import React, { useState, useCallback, useMemo } from "react";
import { MenuItem, Menu, Typography } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetCategories } from "../../hooks/api/useCategory";
import { filterByCategory } from "../../actions/filterActions";
import { FaEllipsisH, FaTshirt, FaGem, FaFemale, FaShoePrints } from "react-icons/fa";
import { PiPants } from "react-icons/pi";
import LottieLoading from "../LottieLoading";

type Category = { _id: string; name: string };

type CategoryDropdownProps = {
  menuItemClassName?: string;
};

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    border: `1px solid ${theme.palette.divider}`,
    width: "auto",
    maxWidth: "none",
  },
  itemIcon: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: theme.spacing(1) + 4,
    color: theme.palette.text.secondary,
  },
  textMedium: {
    fontWeight: 400,
  },
}));

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ menuItemClassName }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: categoriesResponse, isLoading, error } = useGetCategories();
  const categoriesRaw = categoriesResponse?.data?.categories || [];
  const categories: Category[] = Array.isArray(categoriesRaw) ? categoriesRaw : [];

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleCategoryClick = useCallback((categoryName: string) => {
    dispatch(filterByCategory(categoryName));
    handleClose();
  }, [dispatch, handleClose]);

  const renderIcon = useCallback((name: string) => {
    const key = name.trim().toLowerCase();
    switch (key) {
      case "other":
        return <FaEllipsisH className={classes.itemIcon} />;
      case "tops":
        return <FaTshirt className={classes.itemIcon} />;
      case "accessories":
        return <FaGem className={classes.itemIcon} />;
      case "bottoms":
        return <PiPants className={classes.itemIcon} />;
      case "dresses":
        return <FaFemale className={classes.itemIcon} />;
      case "shoes":
        return <FaShoePrints className={classes.itemIcon} />;
      default:
        return null;
    }
  }, [classes.itemIcon]);

  return (
    <>
      <MenuItem
        className={menuItemClassName}
        aria-owns={open ? "categories-menu" : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
        disableRipple
      >
        <Typography className={classes.textMedium}>Categories</Typography>
        <ArrowDropDownIcon fontSize="medium" />
      </MenuItem>

      <Menu
        id="categories-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          className: classes.menuPaper,
          onMouseLeave: handleClose,
        }}
      >
        {isLoading ? (
          <LottieLoading />
        ) : error ? (
          <MenuItem>{error instanceof Error ? error.message : String(error)}</MenuItem>
        ) : (
          categories.map((category, index) => {
            const key = category?._id ?? category?.name ?? `category-${index}`;
            return (
              <MenuItem
                key={key}
                component={Link}
                to={`/shop?category=${category.name}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                {renderIcon(category.name)}
                <Typography className={classes.textMedium}>{category.name}</Typography>
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
};

export default CategoryDropdown;


