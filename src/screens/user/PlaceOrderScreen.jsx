import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrder } from "../../hooks/api/useOrder";
import { toast } from "react-toastify";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  ListItemText,
  ListItem,
  List,
  ListItemIcon,
  Avatar,
  Box,
  Hidden,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GrLocation, GrCreditCard, GrProjects } from "react-icons/gr";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Message from "../../components/Message";
import CheckoutSteps from "../../components/CheckoutSteps";
import Meta from "../../components/Meta";
import paypalImage from "../../assets/images/paypal.png";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  content: {
    padding: 24,
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    [theme.breakpoints.down("sm")]: {
      padding: 32,
    },
  },
  orderItems: {
    flexWrap: "wrap",
    paddingRight: 0,
  },
  items: {
    flexBasis: "100%",
    marginLeft: 56,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& .MuiTableCell-root": {
      paddingLeft: 0,
    },
    "& .MuiTableCell-head": {
      color: "rgba(0, 0, 0, 0.54)",
      fontWeight: 400,
    },
  },
  largeImage: {
    width: theme.spacing(6),
    height: theme.spacing(8),
  },
  empty: {
    ...theme.mixins.customize.centerFlex("column wrap"),
    marginTop: 30,
  },
  cartTotalWrapper: {
    marginTop: 22,
    padding: 20,
    fontSize: 16,
    backgroundColor: "#F4F4F4",
  },
  divider: {
    margin: "8px 0",
    width: 80,
    height: 2,
    backgroundColor: "#2a2a2a",
  },
  itemName: {
    ...theme.mixins.customize.textClamp(2),
  },
}));

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const cart = useSelector((state) => state.cart);

  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }

  // Only selected items
  const selectedItems = cart.cartItems.filter((item) => item.selected);

  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const address = Object.values(cart.shippingAddress)
    .filter((value) => typeof value === "string")
    .join(", ");

  cart.itemsPrice = addDecimals(
    selectedItems.reduce((acc, item) => acc + item.priceSale * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(
    cart.itemsPrice > 1000 ? 0 : cart.itemsPrice > 30 ? 5 : 30
  );
  cart.taxPrice = addDecimals(Number((0.05 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const createOrderMutation = useCreateOrder();
  const { data: orderResponse, isSuccess: success, error } = createOrderMutation;
  const order = orderResponse?.data?.order;

  useEffect(() => {
    if (success && order?._id) {
      history.push(`/order/${order._id}`);
      toast.success("Order created successfully!");
    }
  }, [history, success, order]);

  const placeOrderHandler = async () => {
    try {
      await createOrderMutation.mutateAsync({
        orderItems: selectedItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });
    } catch (error) {
      toast.error("Failed to create order");
    }
  };

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Place Order | FashionShop" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            style={{ marginBottom: 24 }}
          >
            <Link color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Link color="textPrimary" component={RouterLink} to="/payment">
              Place Order
            </Link>
          </Breadcrumbs>
          <CheckoutSteps step={3} />
        </Grid>
      </Grid>
      <Paper elevation={0} className={classes.content}>
        <Grid container spacing={8}>
          <Grid item xs={12} lg={8}>
            <List>
              <ListItem divider>
                <ListItemIcon>
                  <GrLocation fontSize={22} />
                </ListItemIcon>
                <ListItemText
                  primary="Shipping"
                  secondary={
                    <>
                      {address}
                      {cart.shippingAddress.recipientPhoneNumber && (
                        <Typography variant="body2">
                          Recipient's Phone:{" "}
                          {cart.shippingAddress.recipientPhoneNumber}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <GrCreditCard fontSize={22} />
                </ListItemIcon>
                <ListItemText
                  primary="Payment Method"
                  secondary={cart.paymentMethod}
                />
                <ListItemAvatar>
                  <img src={paypalImage} alt="" width="80px" height="30px" />
                </ListItemAvatar>
              </ListItem>
              <ListItem className={classes.orderItems}>
                <ListItemIcon>
                  <GrProjects fontSize={22} />
                </ListItemIcon>
                <ListItemText primary="Order Items" />
                {selectedItems.length > 0 ? (
                  <div className={classes.items}>
                    <TableContainer component={Paper} elevation={0}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Products</TableCell>
                            <Hidden smDown>
                              <TableCell align="right">Size</TableCell>
                              <TableCell align="right">Color</TableCell>
                              <TableCell align="right">Price</TableCell>
                            </Hidden>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedItems.map((item) => {
                            const selectedColor = item.color?.find(
                              (color) =>
                                color.hexCode === item.colorSelected ||
                                color.name === item.colorSelected
                            );
                            const colorName = selectedColor
                              ? selectedColor.name
                              : item.colorSelected;

                            return (
                              <TableRow key={item.name}>
                                <TableCell component="th" scope="item">
                                  <ListItem disableGutters>
                                    <ListItemAvatar>
                                      <Avatar
                                        variant="square"
                                        src={item.images && item.images[0]}
                                        alt="product image"
                                        className={classes.largeImage}
                                      />
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={item.name}
                                      secondary={`Size: ${item.sizeSelected.toUpperCase()} | Color: ${colorName}`}
                                      className={classes.itemName}
                                      style={{ marginLeft: 16 }}
                                    />
                                  </ListItem>
                                  <Hidden mdUp>
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      mt={2}
                                    >
                                      <Box textAlign="center">
                                        Size: {item.sizeSelected.toUpperCase()}
                                      </Box>
                                      <Box textAlign="center">
                                        Color: {colorName}
                                      </Box>
                                      <Box textAlign="center">
                                        {`${item.qty} x $${
                                          item.priceSale
                                        } = $${(
                                          item.qty * item.priceSale
                                        ).toFixed(2)}`}
                                      </Box>
                                    </Box>
                                  </Hidden>
                                </TableCell>
                                <Hidden smDown>
                                  <TableCell align="right">
                                    {item.sizeSelected.toUpperCase()}
                                  </TableCell>
                                  <TableCell align="right">
                                    {colorName}
                                  </TableCell>
                                  <TableCell align="right">
                                    {`${item.qty} x $${item.priceSale} = $${(
                                      item.qty * item.priceSale
                                    ).toFixed(2)}`}
                                  </TableCell>
                                </Hidden>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                ) : (
                  <div className={classes.empty}>
                    <Typography variant="subtitle1" color="secondary">
                      You have not selected any items to order.{" "}
                      <Link to="/cart" component={RouterLink} color="primary">
                        Go back to your cart.
                      </Link>
                    </Typography>
                  </div>
                )}
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper elevation={0} className={classes.cartTotalWrapper}>
              <Typography variant="h5" style={{ fontSize: 23 }}>
                Order Summary
              </Typography>
              <Divider className={classes.divider} />
              <List style={{ padding: "10px 20px 20px" }}>
                <ListItem divider disableGutters>
                  <ListItemText primary="Items:" />
                  <Typography>${cart.itemsPrice}</Typography>
                </ListItem>
                <ListItem divider disableGutters>
                  <ListItemText primary="Shipping:" />
                  <Typography>${cart.shippingPrice}</Typography>
                </ListItem>
                <ListItem divider disableGutters>
                  <ListItemText primary="Tax:" />
                  <Typography>${cart.taxPrice}</Typography>
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="Total:" />
                  <Typography color="secondary">${cart.totalPrice}</Typography>
                </ListItem>
              </List>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={selectedItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to="/payment"
                fullWidth
                style={{ marginTop: 16 }}
              >
                Back
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PlaceOrderScreen;
