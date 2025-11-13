import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUsers, useDeleteUser } from "../../hooks/api/useUser";
import { Link as RouterLink, useHistory } from "react-router-dom";
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
import { toast } from "react-toastify";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSearch,
} from "react-icons/ai";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
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
    paddingTop: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
    marginTop: 0,
  },
  dataGrid: {
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    textAlign: "center",
    "& .MuiDataGrid-columnHeader": {
      "& .MuiDataGrid-menuIcon": {
        display: "none !important",
      },
      "& .MuiDataGrid-iconButtonContainer": {
        display: "none !important",
      },
      "& .MuiDataGrid-sortIcon": {
        display: "none !important",
      },
      "& .MuiSvgIcon-root": {
        display: "none !important",
      },
    },
  },
}));

const UserListScreen = ({ history: historyProp }) => {
  const classes = useStyles();
  const history = useHistory();

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);

  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  
  const { data: usersResponse, isLoading: loading, error } = useGetUsers({
    keyword: keyword || undefined,
    pageNumber: page + 1,
    perPage: pageSize,
  });
  const usersData = usersResponse?.data?.users || [];
  const users = usersData.map((user) => ({
    ...user,
    id: user._id || user.id,
    interaction_history_length: Array.isArray(user.interaction_history) 
      ? user.interaction_history.length 
      : 0,
    outfit_history_length: Array.isArray(user.outfit_history) 
      ? user.outfit_history.length 
      : 0,
  }));
  const totalUsers = usersResponse?.data?.count || 0;

  const deleteUserMutation = useDeleteUser();
  const { error: errorDelete, isSuccess: successDelete } = deleteUserMutation;

  const handleOpenEditModal = (userId) => {
    history.push(`/admin/user/${userId}/edit`);
  };

  const columns = [
    { field: "email", headerName: "Email", flex: 0.25, minWidth: 200, sortable: false },
    { field: "name", headerName: "Name", flex: 0.2, minWidth: 150, sortable: false },
    {
      field: "gender",
      headerName: "Gender",
      flex: 0.1,
      minWidth: 80,
      sortable: false,
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "age",
      headerName: "Age",
      flex: 0.08,
      minWidth: 10,
      type: "number",
      sortable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "height",
      headerName: "Height",
      flex: 0.1,
      minWidth: 80,
      type: "number",
      sortable: false,
      valueFormatter: (params) => params.value ? `${params.value} cm` : "-",
    },
    {
      field: "weight",
      headerName: "Weight",
      flex: 0.1,
      minWidth: 80,
      type: "number",
      sortable: false,
      valueFormatter: (params) => params.value ? `${params.value} kg` : "-",
    },
    {
      field: "interaction_history_length",
      headerName: "Interactions",
      flex: 0.12,
      minWidth: 100,
      type: "number",
      sortable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "outfit_history_length",
      headerName: "Outfits",
      flex: 0.12,
      minWidth: 100,
      type: "number",
      sortable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      headerName: "Action",
      align: "right",
      headerAlign: "right",
      sortable: false,
      width: 120,
      renderCell: (params) => {
        const id = params.row.id || params.row._id || "";
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AiOutlineEdit />}
              className={classes.button}
              onClick={() => handleOpenEditModal(id)}
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
      toast.success("Người dùng đã được xóa!");
    } else if (errorDelete) {
      toast.error(errorDelete.message || String(errorDelete));
    }
  }, [successDelete, errorDelete]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await deleteUserMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };
  return (
    <Container disableGutters style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Dashboard | Users" />
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
              <Typography color="textPrimary">Users Management</Typography>
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
                placeholder="Search users..."
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
              rows={users}
              columns={columns}
              pagination
              paginationMode="server"
              page={page}
              pageSize={pageSize}
              rowsPerPageOptions={[12, 24, 36, 48]}
              rowCount={totalUsers}
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
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
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

export default UserListScreen;