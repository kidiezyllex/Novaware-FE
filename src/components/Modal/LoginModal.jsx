import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";
import { useLogin } from "../../hooks/api/useAuth";
import { useGetUserById } from "../../hooks/api/useUser";
import { useForm, FormProvider } from "react-hook-form";
import { VscEyeClosed, VscEye, VscClose } from "react-icons/vsc";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import cookies from "js-cookie";
import { USER_LOGIN_SUCCESS } from "../../constants/userConstants";
import { socialLogin, handleSocialLoginCallback } from "../../actions/userActions";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import logo from "../../assets/images/logo.png";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import InputController from "../../components/InputController";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    ...theme.mixins.customize.centerFlex(),
    height: "auto",
    fontFamily: "Inter, sans-serif",
  },
  container: {
    height: "auto",
    width: "500px",
    border: "1px solid #f50057",

    backgroundColor: theme.palette.background.paper,
    overflow: "hidden",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.5), 0px 5px 15px rgba(0,0,0,0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    outline: "none",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  content: {
    position: "relative",
    ...theme.mixins.customize.flexMixin("flex-start", "center", "column"),
    padding: "24px 20%",
    height: "100%",
    [theme.breakpoints.down("xs")]: {
      padding: "24px 10%",
    },
  },
  form: {
    paddingTop: theme.spacing(6),
  },
  backIcon: {
    position: "absolute",
    top: 5,
    left: 0,
  },
  logo: {
    width: "120px",
    marginTop: 8,
  },
  socialButtonsContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    gap: theme.spacing(2),
  },
  socialButton: {
    borderRadius: "10px",
    backgroundColor: "#f50057",
    color: "white",
    fontSize: "13px",
    padding: "5px 10px",
    "&:hover": {
      backgroundColor: "#c42e4f",
      color: "white",
    },
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
}));

const LoginModal = ({
  open,
  onClose,
  redirect = "/",
  setRegisterModalOpen,
  setForgotPasswordModalOpen,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const methods = useForm();
  const { handleSubmit } = methods;

  const dispatch = useDispatch();
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();

  const loginMutation = useLogin();
  const { isLoading: loading, error, isSuccess, data: loginResponse } = loginMutation;
  const [currentUserId, setCurrentUserId] = useState(null);
  const hasRedirected = useRef(false);
  
  // Lấy chi tiết user sau khi đăng nhập thành công
  const { data: userDetails, isLoading: isLoadingUserDetails } = useGetUserById(currentUserId || "");
  
  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  // Reset state khi modal đóng
  useEffect(() => {
    if (!open) {
      setCurrentUserId(null);
      hasRedirected.current = false;
    }
  }, [open]);

  // Xử lý sau khi đăng nhập thành công
  useEffect(() => {
    if (isSuccess && loginResponse?.data) {
      const { _id, token } = loginResponse.data;
      
      // Lưu token vào localStorage và cookies
      localStorage.setItem("access_token", token);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("token", JSON.stringify({ token }));
      cookies.set("accessToken", token);
      
      // Lưu currentUserId
      localStorage.setItem("currentUserId", _id);
      setCurrentUserId(_id);
      
      // Lưu userInfo vào localStorage (để tương thích với code cũ)
      const userInfoToStore = {
        _id,
        name: loginResponse.data.name,
        email: loginResponse.data.email,
        isAdmin: loginResponse.data.isAdmin,
        token,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfoToStore));
      
      // Dispatch Redux action để cập nhật state
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: userInfoToStore,
      });
    }
  }, [isSuccess, loginResponse, dispatch]);

  // Xử lý sau khi lấy được chi tiết user
  useEffect(() => {
    if (userDetails?.data?.user && currentUserId && !hasRedirected.current) {
      hasRedirected.current = true;
      onClose();
      toast.success("Đăng nhập thành công");
      
      const isAdmin = userDetails.data.user.isAdmin || false;
      if (isAdmin) {
        history.push("/admin/orderstats");
      } else {
        if (redirect) {
          history.push(redirect);
        } else {
          history.push("/");
        }
      }
    }
  }, [userDetails, currentUserId, onClose, dispatch, history, redirect]);

  const submitHandler = async ({ email, password }) => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error?.message || error?.error || "Đăng nhập thất bại";
      toast.error(errorMessage);
    }
  };

  const handleCreateAccountClick = (e) => {
    e.preventDefault();
    onClose();
    setRegisterModalOpen(true);
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    onClose();
    setForgotPasswordModalOpen(true);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isSocialLoginCallback = searchParams.has("success");
    if (isSocialLoginCallback) {
      dispatch(handleSocialLoginCallback(searchParams)).then((result) => {
        if (result.success) {
          onClose();
          history.push("/");
        } else {
          console.error(result.error);
        }
      });
    }
  }, [location, dispatch, onClose, history]);

  return (
    <ThemeProvider theme={theme}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={classes.root} square>
            <Grid container component={Paper} className={classes.container}>
              <Grid item sm={12} md={12}>
                <Box className={classes.content}>
                  <IconButton
                    className={classes.closeIcon}
                    onClick={onClose}
                    aria-label="close"
                  >
                    <VscClose />
                  </IconButton>
                  <img src={logo} alt="" className={classes.logo} />
                  <FormProvider {...methods}>
                    <form
                      className={classes.form}
                      onSubmit={handleSubmit(submitHandler)}
                    >
                      <FormControl fullWidth style={{ marginBottom: 16 }}>
                        <InputController
                          name="email"
                          label="Email"
                          required
                          rules={{
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          }}
                        />
                      </FormControl>
                      <FormControl fullWidth style={{ marginBottom: 8 }}>
                        <InputController
                          type={showPassword ? "text" : "password"}
                          name="password"
                          label="Password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  {showPassword ? <VscEye /> : <VscEyeClosed />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          required
                          rules={{
                            minLength: {
                              value: 6,
                              message:
                                "Password must be more than 6 characters",
                            },
                          }}
                        />
                      </FormControl>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={1}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              color="secondary"
                            />
                          }
                          label="Remember Me"
                        />
                        <Link
                          component={RouterLink}
                          onClick={handleForgotPasswordClick}
                        >
                          Forgot password?
                        </Link>
                      </Box>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        className="!rounded-none !h-10"
                      >
                        Login
                      </Button>
                    </form>
                  </FormProvider>
                  <Box my={4}>
                    New customer?{" "}
                    <Link
                      component={RouterLink}
                      onClick={handleCreateAccountClick}
                    >
                      Create Account
                    </Link>
                  </Box>

                  {(loading || isLoadingUserDetails) && <Loader my={0} />}
                  {error && <Message mt={0}>{error}</Message>}
                  <p>Or login with</p>
                  <Box className={classes.socialButtonsContainer}>
                    <Button
                      className={classes.socialButton}
                      color="secondary"
                      onClick={() => dispatch(socialLogin("google"))}
                      startIcon={<FaGoogle />}
                    >
                      Google
                    </Button>
                    <Button
                      className={classes.socialButton}
                      color="secondary"
                      onClick={() => dispatch(socialLogin("facebook"))}
                      startIcon={<FaFacebook />}
                    >
                      Facebook
                    </Button>
                    <Button
                      className={classes.socialButton}
                      color="secondary"
                      onClick={() => dispatch(socialLogin("twitter"))}
                      startIcon={<FaTwitter />}
                    >
                      Twitter
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default LoginModal;