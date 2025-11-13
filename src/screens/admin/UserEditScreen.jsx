import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useGetUserById, useUpdateUser } from "../../hooks/api/useUser";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Breadcrumbs,
  Link,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    paddingTop: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
    marginTop: 0,
  },
  formContainer: {
    padding: theme.spacing(3),
    marginTop: 0,
  },
  form: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: theme.spacing(3),
    display: "flex",
    gap: theme.spacing(2),
    justifyContent: "flex-end",
  },
}));

const UserEditScreen = () => {
  const classes = useStyles();
  const { userId } = useParams();
  const history = useHistory();
  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const { data: userResponse, isLoading: loading, error } = useGetUserById(userId);
  const user = userResponse?.data?.user;

  const updateUserMutation = useUpdateUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        age: user.age || "",
        height: user.height || "",
        weight: user.weight || "",
        isAdmin: user.isAdmin || false,
      });
    }
  }, [user]);

  useEffect(() => {
    if (updateUserMutation.isSuccess) {
      toast.success("Update user successfully!");
      history.push("/admin/users");
    } else if (updateUserMutation.error) {
      toast.error(
        updateUserMutation.error.message || "An error occurred while updating the user"
      );
    }
  }, [updateUserMutation.isSuccess, updateUserMutation.error, history]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateBody = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender || undefined,
        age: formData.age ? Number(formData.age) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        isAdmin: formData.isAdmin,
      };

      // Remove undefined values
      Object.keys(updateBody).forEach(
        (key) => updateBody[key] === undefined && delete updateBody[key]
      );

      await updateUserMutation.mutateAsync({
        id: userId,
        body: updateBody,
      });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <Container disableGutters style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Dashboard | Edit User" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <div>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              style={{ marginBottom: 24 }}
            >
              <Link color="inherit" component={RouterLink} to="/admin/orderstats">
                Dashboard
              </Link>
              <Link color="inherit" component={RouterLink} to="/admin/users">
                Users Management
              </Link>
              <Typography color="textPrimary">Edit User</Typography>
            </Breadcrumbs>
          </div>
        </Grid>
      </Grid>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.message || String(error)}</Message>
      ) : (
        <Grid container>
          <Grid item xs={12}>
            <Paper className={classes.formContainer} elevation={0}>
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 0, max: 150 }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Height (cm)"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 0 }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ min: 0 }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="isAdmin"
                            checked={formData.isAdmin}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label="Is Admin"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Box className={classes.buttonContainer}>
                  <Button
                    variant="outlined"
                    color="default"
                    onClick={() => history.push("/admin/users")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={updateUserMutation.isLoading}
                  >
                    {updateUserMutation.isLoading ? "Updating..." : "Update User"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default UserEditScreen;

