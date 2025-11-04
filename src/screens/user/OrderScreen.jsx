import React, { useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { GrLocation, GrCreditCard, GrProjects, GrUser } from "react-icons/gr";
import { Link as RouterLink } from "react-router-dom";
import { openAdminChatDrawer } from "../../actions/chatActions";
import { useGetOrder, useUpdateOrderToPaid, useCancelOrder } from "../../hooks/api/useOrder";
import {
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
  Button,
} from "@material-ui/core";
import axios from "axios";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import paypalImage from "../../assets/images/paypal.png";
import StripePayment from "../../components/StripePayment";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
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
      color: theme.palette.text.primary,
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
  cartTotal: {
    fontSize: 18,
    marginBottom: 8,
    "&:nth-child(2)": {
      color: theme.palette.secondary.main,
    },
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
  dropdownFormControl: {
    marginTop: theme.spacing(1),
    minWidth: 100,
    "& .MuiInputLabel-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {},
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "& .MuiSelect-root": {
        padding: "12px 30px",
      },
    },
  },
}));

const UserOrderScreen = ({ match, history }) => {
  const classes = useStyles();
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);
  
  const { data: orderResponse, isLoading: loading, error } = useGetOrder(orderId);
  const order = orderResponse?.data?.order;

  const payOrderMutation = useUpdateOrderToPaid();
  const { isLoading: loadingPay, isSuccess: successPay } = payOrderMutation;

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const cancelOrderMutation = useCancelOrder();
  const { isSuccess: successCancel } = cancelOrderMutation;

  const handleOpenChat = () => {
    dispatch(openAdminChatDrawer());
  };

  if (!loading && order) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order?.orderItems.reduce(
        (acc, item) => acc + item.priceSale * item.qty,
        0
      )
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order?.isPaid && !window.paypal) {
      addPayPalScript();
    } else if (!order?.isPaid && window.paypal) {
      setSdkReady(true);
    }
  }, [orderId, order, userInfo]);

  const handleStripePayment = async (paymentIntent) => {
    try {
      await payOrderMutation.mutateAsync({
        id: orderId,
        body: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          payer: {
            email_address: order.user.email,
          },
        }
      });
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const successPaymentHandler = async (paymentResult) => {
    try {
      await payOrderMutation.mutateAsync({
        id: orderId,
        body: paymentResult
      });
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
      } catch (error) {
        console.error("Cancel order failed:", error);
      }
    }
  };

  return loading ? (
    <Loader my={200} />
  ) : error ? (
    <Message mt={100}>{error}</Message>
  ) : (
    order && (
      <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
        <Meta title="Order | FashionShop" />
        <Grid container className={classes.breadcrumbsContainer}>
          <Grid item xs={12}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              style={{ marginBottom: 24 }}
            >
              <Link color="inherit" component={RouterLink} to="/">
                Home
              </Link>
              <Link color="textPrimary" component={RouterLink} to="/order">
                Order Details
              </Link>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Paper elevation={0} className={classes.content}>
          <Grid container spacing={8}>
            <Grid item xs={12} lg={8}>
              <List>
                <ListItem divider>
                  <ListItemText
                    primary={`Order`}
                    secondary={`id: ${order._id}`}
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemIcon>
                    <GrUser fontSize={22} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Receiver"
                    secondary={`${order.user.name}, email: ${order.user.email}`}
                  />
                </ListItem>
                <ListItem divider style={{ flexWrap: "wrap" }}>
                  <ListItemIcon>
                    <GrLocation fontSize={22} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Shipping"
                    secondary={
                      <>
                        {Object.values(order.shippingAddress)
                          .filter((value) => typeof value === "string")
                          .join(", ")}
                        {order.shippingAddress.recipientPhoneNumber && (
                          <Typography variant="body2" component="span">
                            {" "}
                            Recipient's Phone:{" "}
                            {order.shippingAddress.recipientPhoneNumber}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  {order.isDelivered ? (
                    <Message severity="success" mt={8}>
                      Delivered on {new Date(order.updatedAt).toLocaleString()}
                    </Message>
                  ) : (
                    <Message mt={8}>Not Delivered</Message>
                  )}
                </ListItem>

                {/* Processing Status */}
                <ListItem divider style={{ flexWrap: "wrap" }}>
                  <ListItemIcon>
                    <GrProjects fontSize={22} />
                  </ListItemIcon>
                  <ListItemText primary="Processing Status" />
                  {order.isProcessing ? (
                    <Message severity="success" mt={8} mb={8}>
                      Confirmed at {new Date(order.updatedAt).toLocaleString()}
                    </Message>
                  ) : (
                    <Message severity="warning" mt={8} mb={8}>
                      Not Confirmed
                    </Message>
                  )}
                </ListItem>
                <ListItem divider style={{ flexWrap: "wrap" }}>
                  <ListItemIcon>
                    <GrCreditCard fontSize={22} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Payment Method"
                    secondary={order.paymentMethod}
                  />
                  <ListItemAvatar>
                    <img src={paypalImage} alt="" width="80px" height="30px" />
                  </ListItemAvatar>
                  {order.isPaid ? (
                    <Message severity="success" mt={8}>
                      Paid on {new Date(order.updatedAt).toLocaleString()}
                    </Message>
                  ) : (
                    <Message mt={8}>Not Paid</Message>
                  )}
                </ListItem>
                <ListItem className={classes.orderItems}>
                  <ListItemIcon>
                    <GrProjects fontSize={22} />
                  </ListItemIcon>
                  <ListItemText primary="Order Items" />
                  {order.orderItems.length > 0 ? (
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
                            {order.orderItems.map((item) => {
                              const colorName =
                                item.colors && item.colors.name
                                  ? item.colors.name
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
                                        secondary={`Size: ${item.sizeSelected}, Color: ${item.colorSelected}`}
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
                                          Size:{" "}
                                          {item.sizeSelected.toUpperCase()}
                                        </Box>
                                        <Box textAlign="center">
                                          Color: {item.colorSelected}
                                        </Box>
                                        <Box textAlign="center">
                                          {`${item.qty} x ${item.priceSale} = ${
                                            item.qty * item.priceSale
                                          }`}
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
                        Your cart is empty.{" "}
                        <Link to="/" component={RouterLink} color="primary">
                          Shopping now!
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
                    <Typography>${order.itemsPrice}</Typography>
                  </ListItem>
                  <ListItem divider disableGutters>
                    <ListItemText primary="Shipping:" />
                    <Typography>${order.shippingPrice}</Typography>
                  </ListItem>
                  <ListItem divider disableGutters>
                    <ListItemText primary="Tax:" />
                    <Typography>${order.taxPrice}</Typography>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Total:" />
                    <Typography color="secondary">
                      ${order.totalPrice}
                    </Typography>
                  </ListItem>
                </List>
                {/* Payment */}
                {!order.isPaid && (
                  <Box style={{ width: "100%" }}>
                    {order.paymentMethod === "PayPal" && (
                      <>
                        {loadingPay && <Loader />}
                        {!sdkReady ? (
                          <Loader />
                        ) : (
                          <PayPalButton
                            amount={order.totalPrice}
                            onSuccess={successPaymentHandler}
                            style={{ width: "100%" }}
                          />
                        )}
                      </>
                    )}

                    {order.paymentMethod === "Stripe" && (
                      <StripePayment
                        orderId={orderId}
                        totalPrice={order.totalPrice}
                        handleStripePayment={handleStripePayment}
                      />
                    )}

                    {order.paymentMethod === "COD" && (
                      <Box
                        p={2}
                        border="1px solid #ccc"
                        borderRadius={4}
                        textAlign="center"
                      >
                        <Typography variant="h6" gutterBottom>
                          Cash On Delivery (COD)
                        </Typography>
                        <Typography>
                          You will pay when you receive the order.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                {!order.isDelivered &&
                  !order.isCancelled &&
                  !order.isProcessing && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCancelOrder}
                      fullWidth
                      style={{ marginTop: 16 }}
                    >
                      Cancel Order
                    </Button>
                  )}
                {order.isCancelled && (
                  <>
                    <Message severity="error" mt={8}>
                      This order has been cancelled.
                    </Message>
                    {order.paymentMethod !== "COD" && (
                      <Typography variant="body2" color="textSecondary" mt={8}>
                        If you have paid using online methods, please contact
                        admin{" "}
                        <Link
                          component="button"
                          variant="body2"
                          onClick={handleOpenChat}
                          style={{ color: "blue", textDecoration: "underline" }}
                        >
                          here
                        </Link>{" "}
                        to chat with admin.
                      </Typography>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    )
  );
};

export default UserOrderScreen;
