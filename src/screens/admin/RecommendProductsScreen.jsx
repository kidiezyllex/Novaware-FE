import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import {
  useTrainGNNModel,
  useTrainCBFModel,
  useTrainHybridModel,
  useGNNModelRecommendations,
  useCBFModelRecommendations,
  useHybridModelRecommendations,
} from "../../hooks/api/useRecommend";

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
  paper: {
    padding: theme.spacing(3),
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
  },
  formContainer: {
    marginTop: theme.spacing(3),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: "flex",
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  resultsContainer: {
    marginTop: theme.spacing(3),
  },
  recommendationCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  tabPanel: {
    border: `1px solid ${theme.palette.divider}`,
    borderTop: "none",
  },
  matrixContainer: {
    marginTop: theme.spacing(3),
    width: "100%",
  },
  matrixTableContainer: {
    marginTop: theme.spacing(2),
    maxHeight: 600,
    overflowX: "auto",
    overflowY: "auto",
    width: "100%",
    "&::-webkit-scrollbar": {
      height: 8,
      width: 8,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.palette.grey[100],
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.grey[400],
      borderRadius: 4,
      "&:hover": {
        backgroundColor: theme.palette.grey[500],
      },
    },
  },
  matrixTable: {
    minWidth: "max-content",
  },
  matrixCell: {
    textAlign: "center",
    fontFamily: "monospace",
    fontSize: "0.75rem",
    padding: theme.spacing(1),
  },
  matrixHeaderCell: {
    position: "sticky",
    left: 0,
    zIndex: 2,
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600,
    borderRight: `2px solid ${theme.palette.divider}`,
    fontSize: "0.75rem",
    padding: theme.spacing(1),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`model-tabpanel-${index}`}
      aria-labelledby={`model-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const RecommendProductsScreen = () => {
  const classes = useStyles();
  const history = useHistory();
  const [tabValue, setTabValue] = useState(0);
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [topKPersonal, setTopKPersonal] = useState(10);
  const [topKOutfit, setTopKOutfit] = useState(5);
  const [alpha, setAlpha] = useState(0.5);
  const [trainingResults, setTrainingResults] = useState({
    gnn: null,
    cbf: null,
    hybrid: null,
  });

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  // Training hooks
  const trainGNN = useTrainGNNModel();
  const trainCBF = useTrainCBFModel();
  const trainHybrid = useTrainHybridModel();

  // Recommendation hooks
  const getGNNRecommendations = useGNNModelRecommendations();
  const getCBFRecommendations = useCBFModelRecommendations();
  const getHybridRecommendations = useHybridModelRecommendations();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getCurrentModelType = () => {
    switch (tabValue) {
      case 0:
        return "gnn";
      case 1:
        return "cbf";
      case 2:
        return "hybrid";
      default:
        return "gnn";
    }
  };

  const handleTrain = async (modelType) => {
    try {
      let result;
      switch (modelType) {
        case "gnn":
          result = await trainGNN.mutateAsync({ force_retrain: true });
          break;
        case "cbf":
          result = await trainCBF.mutateAsync({ force_retrain: true });
          break;
        case "hybrid":
          result = await trainHybrid.mutateAsync({
            force_retrain: true,
            alpha: alpha,
          });
          break;
        default:
          return;
      }
      setTrainingResults((prev) => ({
        ...prev,
        [modelType]: result,
      }));
      toast.success(`${modelType.toUpperCase()} model training completed!`);
    } catch (error) {
      toast.error(error?.message || `Failed to train ${modelType.toUpperCase()} model`);
    }
  };

  const handleGetRecommendations = async (modelType) => {
    if (!userId || !productId) {
      toast.error("Please enter both User ID and Product ID");
      return;
    }

    try {
      const requestData = {
        user_id: userId,
        current_product_id: productId,
        top_k_personal: topKPersonal,
        top_k_outfit: topKOutfit,
      };

      let result;
      switch (modelType) {
        case "gnn":
          result = await getGNNRecommendations.mutateAsync(requestData);
          break;
        case "cbf":
          result = await getCBFRecommendations.mutateAsync(requestData);
          break;
        case "hybrid":
          result = await getHybridRecommendations.mutateAsync({
            ...requestData,
            alpha: alpha,
          });
          break;
        default:
          return;
      }
      toast.success("Recommendations retrieved successfully!");
    } catch (error) {
      toast.error(error?.message || `Failed to get ${modelType.toUpperCase()} recommendations`);
    }
  };

  const renderMatrix = (matrixData) => {
    if (!matrixData || !matrixData.data || !matrixData.user_ids || !matrixData.product_ids) {
      return null;
    }

    const { data, user_ids, product_ids, description, row_label, col_label } = matrixData;
    
    // Chỉ hiển thị một số cột đầu và cuối
    const maxDisplayCols = 3; // Số cột hiển thị ở đầu và cuối
    const totalCols = product_ids.length;
    const showEllipsis = totalCols > maxDisplayCols * 2;
    
    // Các cột cần hiển thị
    const firstCols = product_ids.slice(0, maxDisplayCols);
    const lastCols = showEllipsis ? product_ids.slice(-maxDisplayCols) : [];
    
    // Hàm để lấy giá trị từ row dựa trên col index
    const getRowValue = (row, colIdx) => {
      return row[colIdx];
    };

    return (
      <Box className={classes.matrixContainer}>
        <Typography variant="h5" gutterBottom>
          {description || "User-Item Interaction Matrix"}
        </Typography>
        <Typography variant="caption" color="textSecondary" gutterBottom>
          Shape: {matrixData.shape?.[0]} x {matrixData.shape?.[1]} | 
          Displaying: {user_ids.length} rows x {showEllipsis ? `${maxDisplayCols} + ... + ${maxDisplayCols}` : totalCols} columns
        </Typography>
        <TableContainer 
          component={Paper} 
          className={classes.matrixTableContainer}
        >
          <Table 
            className={classes.matrixTable} 
            size="small" 
            stickyHeader
            aria-label="matrix table"
          >
            <TableHead>
              <TableRow>
                <TableCell 
                  className={classes.matrixHeaderCell} 
                  style={{ minWidth: 120 }} 
                  component="th"
                  scope="row"
                >
                  {row_label || "User ID"}
                </TableCell>
                {/* Hiển thị các cột đầu */}
                {firstCols.map((productId, idx) => (
                  <TableCell 
                    key={idx} 
                    className={classes.matrixCell} 
                    style={{ minWidth: 100 }}
                    align="center"
                  >
                    {productId.substring(0, 10)}...
                  </TableCell>
                ))}
                {/* Hiển thị "..." nếu có nhiều cột */}
                {showEllipsis && (
                  <TableCell 
                    className={classes.matrixCell} 
                    style={{ minWidth: 60 }} 
                    align="center"
                  >
                    ...
                  </TableCell>
                )}
                {/* Hiển thị các cột cuối */}
                {lastCols.map((productId, idx) => (
                  <TableCell 
                    key={`last-${idx}`} 
                    className={classes.matrixCell} 
                    style={{ minWidth: 100 }}
                    align="center"
                  >
                    {productId.substring(0, 10)}...
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIdx) => (
                <TableRow key={rowIdx} hover>
                  <TableCell 
                    className={classes.matrixHeaderCell} 
                    style={{ minWidth: 120 }}
                    component="th"
                    scope="row"
                  >
                    {user_ids[rowIdx]?.substring(0, 12)}...
                  </TableCell>
                  {/* Hiển thị giá trị các cột đầu */}
                  {firstCols.map((_, idx) => {
                    const value = getRowValue(row, idx);
                    return (
                      <TableCell 
                        key={idx} 
                        className={classes.matrixCell}
                        align="center"
                      >
                        {value === 0 ? "0.0" : value.toFixed(1)}
                      </TableCell>
                    );
                  })}
                  {/* Hiển thị "..." nếu có nhiều cột */}
                  {showEllipsis && (
                    <TableCell 
                      className={classes.matrixCell} 
                      align="center"
                    >
                      ...
                    </TableCell>
                  )}
                  {/* Hiển thị giá trị các cột cuối */}
                  {lastCols.map((_, idx) => {
                    const actualIdx = totalCols - maxDisplayCols + idx;
                    const value = getRowValue(row, actualIdx);
                    return (
                      <TableCell 
                        key={`last-${idx}`} 
                        className={classes.matrixCell}
                        align="center"
                      >
                        {value === 0 ? "0.0" : value.toFixed(1)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderTabContent = (modelType) => {
    const isTraining =
      (modelType === "gnn" && trainGNN.isLoading) ||
      (modelType === "cbf" && trainCBF.isLoading) ||
      (modelType === "hybrid" && trainHybrid.isLoading);

    const isGettingRecommendations =
      (modelType === "gnn" && getGNNRecommendations.isLoading) ||
      (modelType === "cbf" && getCBFRecommendations.isLoading) ||
      (modelType === "hybrid" && getHybridRecommendations.isLoading);

    const recommendations =
      (modelType === "gnn" && getGNNRecommendations.data) ||
      (modelType === "cbf" && getCBFRecommendations.data) ||
      (modelType === "hybrid" && getHybridRecommendations.data);

    const trainingResult = trainingResults[modelType];
    const matrixData = trainingResult?.matrix_data;

    return (
      <div className={classes.tabPanel}>
        <Paper className={classes.paper}>
          {matrixData && renderMatrix(matrixData)}

          <Divider style={{ margin: "24px 0" }} />

          <Typography variant="h5" gutterBottom>
            Get Recommendations
          </Typography>

          <div className={classes.formContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="User ID"
                  variant="outlined"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={classes.formField}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Product ID"
                  variant="outlined"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className={classes.formField}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Top K Personal"
                  variant="outlined"
                  type="number"
                  value={topKPersonal}
                  onChange={(e) => setTopKPersonal(parseInt(e.target.value) || 10)}
                  className={classes.formField}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Top K Outfit"
                  variant="outlined"
                  type="number"
                  value={topKOutfit}
                  onChange={(e) => setTopKOutfit(parseInt(e.target.value) || 5)}
                  className={classes.formField}
                  inputProps={{ min: 1, max: 50 }}
                />
              </Grid>
              {modelType === "hybrid" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Alpha (0-1)"
                    variant="outlined"
                    type="number"
                    value={alpha}
                    onChange={(e) => setAlpha(parseFloat(e.target.value) || 0.5)}
                    className={classes.formField}
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                    helperText="Weight for hybrid model (0 = CBF, 1 = GNN)"
                  />
                </Grid>
              )}
            </Grid>

            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleGetRecommendations(modelType)}
                disabled={isGettingRecommendations || !userId || !productId}
              >
                {isGettingRecommendations ? (
                  <>
                    <CircularProgress size={20} style={{ marginRight: 8 }} />
                    Loading...
                  </>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </div>
          </div>

          {recommendations && (
            <div className={classes.resultsContainer}>
              <Typography variant="h6" gutterBottom style={{ marginTop: 24 }}>
                Recommendations
              </Typography>

              {recommendations.personalized && recommendations.personalized.length > 0 && (
                <Card className={classes.recommendationCard}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Personalized Recommendations ({recommendations.personalized.length})
                    </Typography>
                    {recommendations.personalized.map((item, index) => (
                      <Box key={index} style={{ marginBottom: 8 }}>
                        <Typography variant="body2">
                          <strong>{index + 1}.</strong> {item.name || item.product_id}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Product ID: {item.product_id} | Score: {item.score?.toFixed(4) || "N/A"}
                        </Typography>
                        {item.reason && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            Reason: {item.reason}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {recommendations.outfit && Object.keys(recommendations.outfit).length > 0 && (
                <Card className={classes.recommendationCard}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Outfit Recommendations
                    </Typography>
                    {recommendations.outfit_complete_score !== undefined && (
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Outfit Complete Score: {recommendations.outfit_complete_score.toFixed(4)}
                      </Typography>
                    )}
                    {Object.entries(recommendations.outfit).map(([category, items], catIndex) => (
                      <Box key={catIndex} style={{ marginTop: 16 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {category} ({items.length})
                        </Typography>
                        {items.map((item, index) => (
                          <Box key={index} style={{ marginBottom: 8, marginLeft: 16 }}>
                            <Typography variant="body2">
                              <strong>{index + 1}.</strong> {item.name || item.product_id}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Product ID: {item.product_id} | Score: {item.score?.toFixed(4) || "N/A"}
                            </Typography>
                            {item.reason && (
                              <Typography variant="caption" color="textSecondary" display="block">
                                Reason: {item.reason}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {(!recommendations.personalized || recommendations.personalized.length === 0) &&
                (!recommendations.outfit || Object.keys(recommendations.outfit).length === 0) && (
                  <Typography variant="body2" color="textSecondary" style={{ padding: 16, textAlign: 'center' }}>
                    No recommendations available
                  </Typography>
                )}
            </div>
          )}
        </Paper>
      </div>
    );
  };

  return (
    <Container disableGutters style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Dashboard | Recommend Products" />
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
              <Typography color="textPrimary">Recommend Products</Typography>
            </Breadcrumbs>
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="GNN Model" />
                <Tab label="CBF Model" />
                <Tab label="Hybrid Model" />
              </Tabs>
              <Box>
                {(() => {
                  const currentModelType = getCurrentModelType();
                  const isTraining =
                    (currentModelType === "gnn" && trainGNN.isLoading) ||
                    (currentModelType === "cbf" && trainCBF.isLoading) ||
                    (currentModelType === "hybrid" && trainHybrid.isLoading);
                  return (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleTrain(currentModelType)}
                      disabled={isTraining}
                      style={{ marginRight: 16 }}
                    >
                      {isTraining ? (
                        <>
                          <CircularProgress size={20} style={{ marginRight: 8 }} />
                          Training...
                        </>
                      ) : (
                        "Train Model"
                      )}
                    </Button>
                  );
                })()}
              </Box>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {renderTabContent("gnn")}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {renderTabContent("cbf")}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {renderTabContent("hybrid")}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecommendProductsScreen;

