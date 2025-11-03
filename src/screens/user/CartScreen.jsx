import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../actions/cartActions";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import Meta from "../../components/Meta";
import ProductFormSelect from "../../components/Product/ProductFormSelect";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  CART_TOGGLE_SELECT_ITEM,
  CART_SELECT_ALL_ITEMS,
} from "../../constants/cartConstants";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize?.breadcrumbs,
  },
  largeImage: {
    width: theme.spacing(12),
    height: theme.spacing(15),
  },
  cartTotalWrapper: {
    padding: 20,
    fontSize: 16,
    backgroundColor: "#F4F4F4",
  },
  cartTotal: {
    fontSize: 18,
    marginBottom: 8,
    "&:nth-child(2)": {
      color: theme.palette.secondary.main,
    },
  },
  divider: {
    margin: "8px 0",
    width: 60,
    height: 2,
    backgroundColor: "#2a2a2a",
  },
  empty: {
    padding: 24,
    textAlign: "center",
  },
}));

const CartScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userLogin);
  const { cartItems } = useSelector((state) => state.cart);

  // Tạo key định danh duy nhất cho item
  const getItemKey = (item) =>
    `${item.product}-${item.sizeSelected}-${item.colorSelected}`;

  // Toggle chọn 1 item
  const handleToggle = (item) => {
    dispatch({
      type: CART_TOGGLE_SELECT_ITEM,
      payload: getItemKey(item),
    });
  };

  // Kiểm tra tất cả item đã được chọn chưa
  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  // Chọn hoặc bỏ chọn tất cả
  const handleSelectAll = () => {
    dispatch({ type: CART_SELECT_ALL_ITEMS, payload: !allSelected });
  };

  const removeFromCartHandler = (id, sizeSelected, colorSelected) => {
    dispatch(removeFromCart(id, sizeSelected, colorSelected));
    toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
  };

  // Tính tổng giá của những item được chọn
  const totalPrice = cartItems
    .filter((item) => item.selected)
    .reduce((acc, item) => acc + item.qty * item.priceSale, 0)
    .toFixed(2);

  const checkoutHandler = () => {
    const selectedProducts = cartItems.filter((item) => item.selected);

    if (selectedProducts.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    if (userInfo) {
      history.push("/shipping");
    } else {
      history.push("/login?redirect=shipping");
    }
  };

  return (
    <Container maxWidth="xl" style={{ marginBottom: 48 }}>
      <Meta title="Shopping Cart | FashionShop" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Link color="textPrimary" component={RouterLink} to="/cart">
              Shopping Cart
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          {cartItems.length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          cartItems.some((item) => item.selected) &&
                          !allSelected
                        }
                        checked={allSelected}
                        onChange={handleSelectAll}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>Products</TableCell>
                    <Hidden smDown>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Size & Qty & Color</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </Hidden>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item, index) => (
                    <TableRow
                      key={`${item.product}-${item.sizeSelected}-${item.colorSelected}-${index}`}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={!!item.selected}
                          onChange={() => handleToggle(item)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <ListItem disableGutters>
                          <ListItemAvatar>
                            <Avatar
                              variant="square"
                              src={item.images && item.images[0]}
                              alt={item.name}
                              className={classes.largeImage}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.name}
                            secondary={`Size: ${item.sizeSelected}, Color: ${item.colorSelected}`}
                            style={{ marginLeft: 16 }}
                          />
                        </ListItem>

                        <Hidden mdUp>
                          <Divider />
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={2}
                          >
                            <Box>${item.priceSale}</Box>
                            <Box>
                              <ProductFormSelect item={item} />
                            </Box>
                            <Box>
                              <IconButton
                                onClick={() =>
                                  removeFromCartHandler(
                                    item.product,
                                    item.sizeSelected,
                                    item.colorSelected
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Hidden>
                      </TableCell>

                      <Hidden smDown>
                        <TableCell align="right">${item.priceSale}</TableCell>
                        <TableCell align="center">
                          <ProductFormSelect item={item} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              removeFromCartHandler(
                                item.product,
                                item.sizeSelected,
                                item.colorSelected
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </Hidden>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className={classes.empty}>
              <Typography variant="subtitle1" color="secondary">
                Your cart is empty.{" "}
                <Link to="/" component={RouterLink} color="primary">
                  Go shopping!
                </Link>
              </Typography>
            </div>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} className={classes.cartTotalWrapper}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider className={classes.divider} />
            <Box
              display="flex"
              justifyContent="space-between"
              className={classes.cartTotal}
            >
              <Typography>Selected Items:</Typography>
              <Typography>
                {cartItems.filter((item) => item.selected).length}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              className={classes.cartTotal}
            >
              <Typography>Total Price:</Typography>
              <Typography>${totalPrice}</Typography>
            </Box>

            <Divider className={classes.divider} />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={cartItems.filter((item) => item.selected).length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartScreen;
