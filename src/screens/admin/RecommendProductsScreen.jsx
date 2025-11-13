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
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
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
    paddingTop: theme.spacing(3),
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
      toast.success(`${modelType.toUpperCase()} model training started! Task ID: ${result.task_id}`);
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

    return (
      <div className={classes.tabPanel}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Train {modelType.toUpperCase()} Model
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleTrain(modelType)}
            disabled={isTraining}
            style={{ marginTop: 16 }}
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

          <Divider style={{ margin: "24px 0" }} />

          <Typography variant="h6" gutterBottom>
            Get Recommendations
          </Typography>

          <div className={classes.formContainer}>
            <TextField
              fullWidth
              label="User ID"
              variant="outlined"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={classes.formField}
              required
            />
            <TextField
              fullWidth
              label="Product ID"
              variant="outlined"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className={classes.formField}
              required
            />
            <TextField
              fullWidth
              label="Top K Personal"
              variant="outlined"
              type="number"
              value={topKPersonal}
              onChange={(e) => setTopKPersonal(parseInt(e.target.value) || 10)}
              className={classes.formField}
              inputProps={{ min: 1, max: 100 }}
            />
            <TextField
              fullWidth
              label="Top K Outfit"
              variant="outlined"
              type="number"
              value={topKOutfit}
              onChange={(e) => setTopKOutfit(parseInt(e.target.value) || 5)}
              className={classes.formField}
              inputProps={{ min: 1, max: 50 }}
            />
            {modelType === "hybrid" && (
              <TextField
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
            )}

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

