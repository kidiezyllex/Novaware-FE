import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  Breadcrumbs,
  Link,
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
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { formatPriceDollar } from "../../utils/formatPrice";

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
    paddingTop: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
    marginTop: 0,
  },
  dataGrid: {
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  imageCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    padding: theme.spacing(1),
    "& img": {
      width: 64,
      height: 64,
      objectFit: "cover",
      borderRadius: theme.shape.borderRadius,
    },
  },
  lineClampTwo: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textAlign: "left",
  },
}));

const ProductListScreen = ({ history }) => {
  const classes = useStyles();

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const { data: productsResponse, isLoading: loading, error } = useGetProducts({
    keyword: keyword || undefined,
    pageNumber: page + 1,
    pageSize,
  });
  const productsData = productsResponse?.data?.products || [];
  const products = productsData.map((product) => ({
    ...product,
    id: product._id,
    image: product.images?.[0] || product.image || "",
  }));
  const totalProducts = productsResponse?.data?.count || 0;

  const deleteProductMutation = useDeleteProduct();
  const { error: errorDelete, isSuccess: successDelete } = deleteProductMutation;

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const imageUrl = params.value;
        return (
          <div className={classes.imageCell}>
            {imageUrl ? (
              <img src={imageUrl} alt={params.row.name || "Product"} />
            ) : (
              <Typography variant="body2">N/A</Typography>
            )}
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" className={classes.lineClampTwo}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary" className={classes.lineClampTwo}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 140,
      align: "right",
      headerAlign: "right",
      valueFormatter: ({ value }) => formatPriceDollar(value),
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
      width: 140,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "sale",
      headerName: "Sale",
      width: 110,
      align: "right",
      headerAlign: "right",
      valueFormatter: ({ value }) => `${value ?? 0} %`,
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
    setPage(0);
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
    <Container disableGutters style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Dashboard | Products" />
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
              <Typography color="textPrimary">Products Management</Typography>
            </Breadcrumbs>
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
        <Message>{error?.message || String(error)}</Message>
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
              pagination
              paginationMode="server"
              page={page}
              pageSize={pageSize}
              rowsPerPageOptions={[12, 24, 36, 48]}
              rowCount={totalProducts}
              onPageChange={(params) => {
                const nextPage = typeof params === "number" ? params : params.page;
                setPage(nextPage);
              }}
              onPageSizeChange={(params) => {
                const nextPageSize =
                  typeof params === "number" ? params : params.pageSize;
                setPageSize(nextPageSize);
                setPage(0);
              }}
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
