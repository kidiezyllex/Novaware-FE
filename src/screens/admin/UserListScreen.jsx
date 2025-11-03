import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUsers, useDeleteUser } from "../../hooks/api/useUser";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import UserEditModal from './UserEditModal';

const useStyles = makeStyles((theme) => ({
  maincontainer: {
    marginTop: theme.spacing(-10),
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
    paddingBottom: 10,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  users: {
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
  },
}));

const UserListScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const onMobile = useMediaQuery("(max-width:740px)");
  const { userInfo } = useSelector((state) => state.userLogin);
  
  const { data: usersResponse, isLoading: loading, error } = useGetUsers();
  const usersData = usersResponse?.data?.users || [];
  const users = usersData.map((user) => ({ ...user, id: user._id }));

  const deleteUserMutation = useDeleteUser();
  const { isSuccess: successDelete } = deleteUserMutation;

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleOpenEditModal = (userId) => {
    setSelectedUserId(userId);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUserId(null);
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.2, hide: onMobile },
    { field: "name", headerName: "Name", flex: 0.2, hide: onMobile },
    { field: "email", headerName: "Email", flex: 0.3 },
    {
      field: "isAdmin",
      headerName: "Admin",
      flex: 0.1,
      type: "boolean",
    },
    {
      field: "action",
      headerName: "Action",
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

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  useEffect(() => {
    if (successDelete) {
      toast.success("Người dùng đã được xóa!");
    }
  }, [successDelete]);

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
    <Container maxWidth="xl" className={classes.maincontainer}>
      <Meta title="Dashboard | Users" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            style={{ textAlign: "center" }}
          >
            User Management
          </Typography>
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
            className={classes.users}
            elevation={0}
          >
            <DataGrid rows={users} columns={columns} pageSize={10} autoHeight />
          </Grid>
        </Grid>
      )}
      <UserEditModal
        userId={selectedUserId}
        open={openEditModal}
        handleClose={handleCloseEditModal}
      />
    </Container>
  );
};

export default UserListScreen;