import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetBrands, useDeleteBrand, useCreateBrand, useUpdateBrand } from "../../hooks/api/useBrand";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
} from "@material-ui/core";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import SnackbarMessage from "../../components/SnackbarMessage";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  button: {
    padding: "6px 6px",
    height: "35px",
    minWidth: "35px",
    "& .MuiButton-startIcon": {
      margin: 0,
    },
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  createButton: {
    backgroundColor: theme.palette.secondary.main,
    height: "40px",
    width: "90px",
    fontSize: "13px",
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  dataGrid: {
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
  },
}));

const BrandListScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [brandName, setBrandName] = useState("");
  const [editMode, setEditMode] = useState(null);

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const { data: brandsResponse, isLoading: loading, error } = useGetBrands();
  const brandsData = brandsResponse?.data?.brands || [];
  const brands = brandsData.map((brand) => ({ ...brand, id: brand._id }));

  const deleteBrandMutation = useDeleteBrand();
  const { error: errorDelete, isSuccess: successDelete } = deleteBrandMutation;

  const createBrandMutation = useCreateBrand();
  const { isLoading: loadingCreate, error: errorCreate, isSuccess: successCreate } = createBrandMutation;

  const updateBrandMutation = useUpdateBrand();
  const { isSuccess: successUpdate } = updateBrandMutation;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    if (successCreate) {
      toast.success("Brand created successfully!");
      setBrandName("");
    }
    if (successUpdate) {
      toast.success("Brand updated successfully!");
    }
    if (successDelete) {
      toast.success("Brand deleted successfully!");
    }
  }, [successDelete, successCreate, successUpdate]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteBrandMutation.mutateAsync(id);
      } catch (error) {
        toast.error("Failed to delete brand");
      }
    }
  };

  const createBrandHandler = async () => {
    if (brandName) {
      try {
        await createBrandMutation.mutateAsync({ name: brandName });
        setBrandName("");
      } catch (error) {
        console.error("Failed to create brand:", error);
      }
    } else {
      alert("Please enter a brand name");
    }
  };

  const saveHandler = async (id, name) => {
    try {
      await updateBrandMutation.mutateAsync({ id, body: { name } });
      setEditMode(null);
    } catch (error) {
      console.error("Failed to update brand:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 2, minWidth: 180 },
    {
      field: "name",
      headerName: "Name",
      flex: 1.8,
      minWidth: 250,
      renderCell: (params) => {
        return editMode === params.id ? (
          <TextField
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            variant="outlined"
            size="small"
          />
        ) : (
          params.value
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" width="100%" height="100%">
          {editMode === params.id ? (
            <IconButton
              color="primary"
              onClick={() => saveHandler(params.id, brandName)}
            >
              <AiOutlineEdit />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AiOutlineEdit />}
              className={classes.button}
              onClick={() => {
                setEditMode(params.id);
                setBrandName(params.row.name);
              }}
            />
          )}
          <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: 8 }}
            className={classes.button}
            startIcon={<AiOutlineDelete />}
            onClick={() => deleteHandler(params.id)}
          />
        </Box>
      ),
    },
  ];

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <SnackbarMessage />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <div>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              style={{ marginBottom: 16 }}
            >
              Brand Management
            </Typography>
          </div>
        </Grid>
      </Grid>
      {loading || loadingCreate ? (
        <Loader />
      ) : error || errorCreate ? (
        <Message>{error || errorCreate}</Message>
      ) : (
        <Grid container spacing={2}>
          {/* Create Brand Section */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-start" mt={2}>
              <TextField
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
                variant="outlined"
                size="small"
                fullWidth
                style={{ marginRight: "10px" }}
              />
              <Button
                variant="contained"
                className={`${classes.createButton}`}
                onClick={createBrandHandler}
              >
                Create
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            component={Paper}
            className={classes.dataGrid}
            elevation={0}
          >
            <DataGrid
              rows={brands}
              columns={columns}
              pageSize={10}
              autoHeight
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
              disableSelectionOnClick
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default BrandListScreen;
