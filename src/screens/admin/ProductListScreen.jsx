import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetProducts, useDeleteProduct } from "../../hooks/api/useProduct";
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
  InputAdornment,
} from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  button: {
    padding: "6px 0",
    minWidth: "30px",
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
  dataGrid: {
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    textAlign: "center",
  },
}));

const ProductListScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const { data: productsResponse, isLoading: loading, error } = useGetProducts(keyword ? { keyword, option: 'all' } : { option: 'all' });
  const productsData = productsResponse?.data?.products || [];
  const products = productsData.map((product) => ({ ...product, id: product._id }));

  const deleteProductMutation = useDeleteProduct();
  const { error: errorDelete, isSuccess: successDelete } = deleteProductMutation;

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "category",
      headerName: "Category",
      width: 160,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "sale",
      headerName: "Sale",
      width: 110,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: "countInStock",
      headerName: "Stock",
      width: 110,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "action",
      headerName: "Action",
      align: "right",
      headerAlign: "right",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const id = params.getValue(params.id, "_id") || "";
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AiOutlineEdit />}
              className={classes.button}
              component={RouterLink}
              to={`/admin/product/${id}/edit`}
            />
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: 8 }}
              className={classes.button}
              startIcon={<AiOutlineDelete />}
              onClick={() => deleteHandler(id)}
            />
          </>
        );
      },
    },
  ];

  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    if (successDelete) {
      toast.success("Sản phẩm đã được xóa!");
    } else if (errorDelete) {
      toast.error(errorDelete.message || String(errorDelete));
    }
  }, [successDelete, errorDelete]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProductMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Meta title="Dashboard | Products" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <div>
            <Typography
              variant="h5"
              component="h1"
              style={{ textAlign: "center" }}
            >
              Product Management
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              mb={2}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search products..."
                value={keyword}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AiOutlineSearch />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AiOutlinePlus />}
                component={RouterLink}
                to="/admin/product/create"
              >
                Create Product
              </Button>
            </Box>
            <div style={{ clear: "both" }}></div>{" "}
          </div>
        </Grid>
      </Grid>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Grid container>
          <Grid
            item
            xs={12}
            component={Paper}
            className={classes.dataGrid}
            elevation={0}
          >
            <DataGrid
              rows={products}
              columns={columns}
              pageSize={12}
              autoHeight
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ProductListScreen;
