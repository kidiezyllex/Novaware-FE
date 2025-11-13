import { useQuery, useMutation } from '@tanstack/react-query';
import {
	getGNNPersonalizedRecommendations,
	getHybridRecommendations,
	getBestRecommendations,
	getOutfitPerfectRecommendations,
	trainGNNIncremental,
	trainGNNModel,
	trainCBFModel,
	trainHybridModel,
	getGNNModelRecommendations,
	getCBFModelRecommendations,
	getHybridModelRecommendations,
} from '../../lib/api/recommend';
import * as RecommendTypes from '../../interface/response/recommend';
import * as RecommendRequestTypes from '../../interface/request/recommend';

export const useGNNPersonalizedProducts = (userId: string, query: RecommendRequestTypes.IGetPersonalizedQuery) => {
    return useQuery<RecommendTypes.IPersonalizedGNNResponse, Error>({
        queryKey: ['recommend', 'gnn-personalize', userId, query],
        queryFn: () => getGNNPersonalizedRecommendations(userId, query),
        enabled: !!userId && !!query?.productId,
    });
};

export const useGetHybridRecommendations = (userId: string, query?: RecommendRequestTypes.IGetRecommendationsQuery) => {
	return useQuery<RecommendTypes.IHybridRecommendationV9Response, Error>({
		queryKey: ['recommend', 'hybrid', userId, query],
		queryFn: () => getHybridRecommendations(userId, query),
		enabled: !!userId,
	});
};

export const useGetOutfitRecommendations = (userId: string, gender?: string) => {
    return useQuery<RecommendTypes.IOutfitPerfectRecommendationResponse, Error>({
        queryKey: ['recommend', 'outfit', userId, gender],
        queryFn: () => getOutfitPerfectRecommendations(userId, { productId: '', gender }),
        enabled: !!userId,
    });
};

export const useGetBestRecommendations = (userId: string, query?: RecommendRequestTypes.IGetRecommendationsQuery) => {
	return useQuery<RecommendTypes.IRecommendationResponse, Error>({
		queryKey: ['recommend', 'best', userId, query],
		queryFn: () => getBestRecommendations(userId, query),
		enabled: !!userId,
	});
};

export const useGNNOutfitPerfect = (userId: string, query: RecommendRequestTypes.IGetOutfitPerfectQuery) => {
	return useQuery<RecommendTypes.IOutfitPerfectRecommendationResponse, Error>({
		queryKey: ['recommend', 'gnn-outfit-perfect', userId, query],
		queryFn: () => getOutfitPerfectRecommendations(userId, query),
		enabled: !!userId && !!query.productId,
	});
};

export const useTrainGNNIncremental = () => {
	return useMutation<RecommendTypes.ITrainGNNIncrementalResponse, Error>({
		mutationFn: trainGNNIncremental,
	});
};

export const useTrainGNNModel = () => {
	return useMutation<RecommendTypes.IModelTrainingResponse, Error, RecommendRequestTypes.ITrainGNNRequest>({
		mutationFn: trainGNNModel,
	});
};

export const useTrainCBFModel = () => {
	return useMutation<RecommendTypes.IModelTrainingResponse, Error, RecommendRequestTypes.ITrainCBFRequest>({
		mutationFn: trainCBFModel,
	});
};

export const useTrainHybridModel = () => {
	return useMutation<RecommendTypes.IModelTrainingResponse, Error, RecommendRequestTypes.ITrainHybridRequest>({
		mutationFn: trainHybridModel,
	});
};

export const useGNNModelRecommendations = () => {
	return useMutation<RecommendTypes.IModelRecommendationResponse, Error, RecommendRequestTypes.IGNNRecommendRequest>({
		mutationFn: getGNNModelRecommendations,
	});
};

export const useCBFModelRecommendations = () => {
	return useMutation<RecommendTypes.IModelRecommendationResponse, Error, RecommendRequestTypes.ICBFRecommendRequest>({
		mutationFn: getCBFModelRecommendations,
	});
};

export const useHybridModelRecommendations = () => {
	return useMutation<RecommendTypes.IModelRecommendationResponse, Error, RecommendRequestTypes.IHybridRecommendRequest>({
		mutationFn: getHybridModelRecommendations,
	});
};

