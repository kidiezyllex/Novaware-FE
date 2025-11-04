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
}

export interface IGetOutfitPerfectQuery extends IGetRecommendationsQuery {
	productId: string;
}

