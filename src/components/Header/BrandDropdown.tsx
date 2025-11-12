import React, { useState, useCallback, useMemo } from "react";
import {
  MenuItem,
  Menu,
  Typography,
  MenuList,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetGroupedBrands } from "../../hooks/api/useBrand";
import { filterByBrand } from "../../actions/filterActions";
import LottieLoading from "../LottieLoading";

type Brand = { _id?: string; id?: string; name: string };
type BrandGroup = { letter: string; items: Brand[] };

type BrandDropdownProps = {
  menuItemClassName?: string;
};

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    border: `1px solid ${theme.palette.divider}`,
    width: "90vw",
    maxWidth: "90vw",
  },
  brandsMenuList: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gridAutoRows: "minmax(32px, auto)",
    columnGap: theme.spacing(2),
    rowGap: theme.spacing(1),
    padding: theme.spacing(1, 2),
  },
  brandGroupColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: theme.spacing(0.5),
    minWidth: 0,
  },
  letterRow: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: "8px 16px",
  },
  letterText: {
    fontWeight: 700,
    color: "#f50057",
    whiteSpace: "nowrap",
  },
  letterDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "#f50057",
    opacity: 0.4,
  },
  menuItemText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    display: "block",
  },
}));

const BrandDropdown: React.FC<BrandDropdownProps> = ({ menuItemClassName }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: brandsResponse, isLoading: loadingBrands, error: errorBrands } = useGetGroupedBrands();

  const brandGroups: BrandGroup[] = useMemo(() => {
    const rawGroups = brandsResponse?.data?.groups;
    if (!Array.isArray(rawGroups) || rawGroups.length === 0) {
      return [];
    }

    return rawGroups
      .map((group) => ({
        letter: group.letter,
        items: Array.isArray(group.items)
          ? group.items.map((brand) => ({
            ...brand,
            _id: brand._id ?? (brand as Brand).id ?? `${group.letter}-${brand.name}`,
          }))
          : [],
      }))
      .filter((group) => group.items.length > 0);
  }, [brandsResponse]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleBrandClick = useCallback((brandName: string) => {
    dispatch(filterByBrand(brandName));
    handleClose();
  }, [dispatch, handleClose]);

  return (
    <>
      <MenuItem
        className={menuItemClassName}
        aria-owns={open ? "brands-menu" : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
        disableRipple
      >
        <Typography>Brands</Typography>
        <ArrowDropDownIcon fontSize="medium" />
      </MenuItem>

      <Menu
        id="brands-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          className: classes.brandsMenuList,
          onMouseLeave: handleClose,
        }}
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
        }}
      >
        {loadingBrands ? (
          <LottieLoading />
        ) : errorBrands ? (
          <MenuItem>{errorBrands instanceof Error ? errorBrands.message : String(errorBrands)}</MenuItem>
        ) : (
          brandGroups.map((group) => (
            <div className={classes.brandGroupColumn} key={group.letter}>
              <div className={classes.letterRow} role="presentation" aria-hidden>
                <span className={classes.letterText}>{group.letter}</span>
                <span className={classes.letterDivider} />
              </div>
              {group.items.map((brand) => (
                <MenuItem
                  key={brand._id ?? brand.id ?? brand.name}
                  component={Link}
                  to={`/shop?brand=${brand.name}`}
                  onClick={() => handleBrandClick(brand.name)}
                >
                  <Typography className={classes.menuItemText}>{brand.name}</Typography>
                </MenuItem>
              ))}
            </div>
          ))
        )}
      </Menu>
    </>
  );
};

export default BrandDropdown;


