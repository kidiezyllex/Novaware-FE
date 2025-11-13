import { sendGet, sendPost } from "./axios";
import {
	IRecommendationResponse,
	ISimilarProductsResponse,
	ITrendingProductsResponse,
	IPersonalizedResponse,
	IPersonalizedGNNResponse,
	IHybridRecommendationV9Response,
	IOutfitPerfectRecommendationResponse,
	ITrainGNNIncrementalResponse,
	IModelTrainingResponse,
	IModelRecommendationResponse,
} from "../../interface/response/recommend";
import {
	IGetRecommendationsQuery,
	IGetTrendingQuery,
	IGetSimilarProductsQuery,
	IGetPersonalizedQuery,
	IGetOutfitPerfectQuery,
	ITrainGNNRequest,
	ITrainCBFRequest,
	ITrainHybridRequest,
	IGNNRecommendRequest,
	ICBFRecommendRequest,
	IHybridRecommendRequest,
} from "../../interface/request/recommend";

const getMlServiceBaseUrl = () => {
	const base =
		import.meta.env.VITE_RECOMMENDER_API_URL ||
		import.meta.env.VITE_RECSYS_API_URL ||
		import.meta.env.VITE_API_URL ||
		"http://localhost:8000";

	return base.replace(/\/$/, "");
};

const buildMlServiceUrl = (path: string) => `${getMlServiceBaseUrl()}${path}`;

// 9.1 Personalized Products (GNN)
export const getGNNPersonalizedRecommendations = async (
	userId: string,
    query: IGetPersonalizedQuery
): Promise<IPersonalizedGNNResponse> => {
	return await sendGet(`/recommend/gnn/personalize/${userId}`, query);
};

export const getHybridRecommendations = async (
	userId: string,
	query?: IGetRecommendationsQuery
): Promise<IHybridRecommendationV9Response> => {
	return await sendGet(`/recommend/hybrid/${userId}`, query);
};

export const getBestRecommendations = async (userId: string, query?: IGetRecommendationsQuery): Promise<IRecommendationResponse> => {
	return await sendGet(`/recommend/best/${userId}`, query);
};

// 9.3 Outfit Perfect (GNN)
export const getOutfitPerfectRecommendations = async (
	userId: string,
	query: IGetOutfitPerfectQuery
): Promise<IOutfitPerfectRecommendationResponse> => {
	return await sendGet(`/recommend/gnn/outfit-perfect/${userId}`, query);
};

export const getSimilarProducts = async (productId: string, query?: IGetSimilarProductsQuery): Promise<ISimilarProductsResponse> => {
	return await sendGet(`/recommend/similar/${productId}`, query);
};

export const getTrendingProducts = async (query?: IGetTrendingQuery): Promise<ITrendingProductsResponse> => {
	return await sendGet(`/recommend/trending`, query);
};

export const getPersonalizedRecommendations = async (userId: string, query?: IGetPersonalizedQuery): Promise<IPersonalizedResponse> => {
	return await sendGet(`/recommend/personalized/${userId}`, query);
};

// 9.4 Train GNN (Incremental)
export const trainGNNIncremental = async (): Promise<ITrainGNNIncrementalResponse> => {
	return await sendPost(`/recommend/train/gnn-incremental`);
};

export const trainGNNModel = async (body: ITrainGNNRequest): Promise<IModelTrainingResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/gnn/train/`), body);
};

export const trainCBFModel = async (body: ITrainCBFRequest): Promise<IModelTrainingResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/cbf/train/`), body);
};

export const trainHybridModel = async (body: ITrainHybridRequest): Promise<IModelTrainingResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/hybrid/train/`), body);
};

export const getGNNModelRecommendations = async (body: IGNNRecommendRequest): Promise<IModelRecommendationResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/gnn/recommend/`), body);
};

export const getCBFModelRecommendations = async (body: ICBFRecommendRequest): Promise<IModelRecommendationResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/cbf/recommend/`), body);
};

export const getHybridModelRecommendations = async (body: IHybridRecommendRequest): Promise<IModelRecommendationResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/hybrid/recommend/`), body);
};

