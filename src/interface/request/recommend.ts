export interface IGetRecommendationsQuery {
	k?: number;
	pageNumber?: number;
	perPage?: number;
}

export interface IGetTrendingQuery {
	k?: number;
	days?: number;
	pageNumber?: number;
	perPage?: number;
}

export interface IGetSimilarProductsQuery {
	k?: number;
	pageNumber?: number;
	perPage?: number;
}

export interface IGetPersonalizedQuery {
    k?: number;
    productId: string;
}

export interface IGetOutfitPerfectQuery extends IGetRecommendationsQuery {
	productId: string;
	gender?: string;
}

export interface ITrainGNNRequest {
	force_retrain: boolean;
}

export interface ITrainCBFRequest {
	force_retrain: boolean;
}

export interface ITrainHybridRequest {
	force_retrain: boolean;
	alpha?: number;
}

export interface IRecommendRequestBase {
	user_id: string;
	current_product_id: string;
	top_k_personal: number;
	top_k_outfit: number;
}

export interface IGNNRecommendRequest extends IRecommendRequestBase {}

export interface ICBFRecommendRequest extends IRecommendRequestBase {}

export interface IHybridRecommendRequest extends IRecommendRequestBase {
	alpha?: number;
}

