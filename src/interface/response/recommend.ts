import { IProduct } from "./product";

export interface IRecommendationResponse {
	success: boolean;
	data: {
		products: IProduct[];
		model: string;
		timestamp: string;
		pagination: {
			page: number;
			pages: number;
			count: number;
			perPage: number;
		};
	};
	message: string;
}

export interface IOutfitProduct {
	_id: string;
	name: string;
	price: number;
	image?: string;
	images?: string[];
}

export interface IOutfit {
	name: string;
	products: IOutfitProduct[];
	style: string;
	totalPrice: number;
	compatibilityScore: number;
	gender: string;
	description: string;
}

export interface IOutfitRecommendationResponse {
	success: boolean;
	data: {
		outfits: IOutfit[];
		model: string;
		timestamp: string;
		pagination: {
			page: number;
			pages: number;
			count: number;
			perPage: number;
		};
	};
	message: string;
}

export interface ISimilarProductsResponse {
	success: boolean;
	data: {
		originalProduct: IProduct;
		similarProducts: IProduct[];
		count: number;
		pagination: {
			page: number;
			pages: number;
			totalCount: number;
			perPage: number;
		};
	};
	message: string;
}

export interface ITrendingProductsResponse {
	success: boolean;
	data: {
		trendingProducts: IProduct[];
		period: string;
		count: number;
		pagination: {
			page: number;
			pages: number;
			totalCount: number;
			perPage: number;
		};
	};
	message: string;
}

export interface IPersonalizedResponse {
	success: boolean;
	data: {
		products: IProduct[];
		userPreferences: Record<string, any>;
		count: number;
	};
	message: string;
}

export interface ITrainModelsResponse {
	success: boolean;
	data: {
		gnn: {
			trained: boolean;
			trainingTime: string;
		};
		hybrid: {
			trained: boolean;
			trainingTime: string;
		};
	};
	message: string;
}

// 9.x 新接口类型
export interface IPersonalizedGNNResponse {
	success: boolean;
	message: string;
	data: IProduct[];
}

export interface IHybridRecommendationV9Response {
	success: boolean;
	message: string;
	data: {
		products: IProduct[];
		pagination: {
			page: number;
			pages: number;
			count: number;
			perPage: number;
		};
	};
}

export interface IOutfitPerfectRecommendationResponse {
	success: boolean;
	message: string;
	data: {
		outfits: IOutfit[];
		model: string;
		timestamp: string;
		pagination: {
			page: number;
			pages: number;
			count: number;
			perPage: number;
		};
	};
}

export interface ITrainGNNIncrementalResponse {
	success: boolean;
	message: string;
	data: {
		gnn: {
			trained: boolean;
			trainingTime: string;
			mode: 'incremental' | string;
		};
	};
}

export interface IModelTrainingResponse {
	status: string;
	model: string;
	task_id: string;
	queued_alpha?: number;
}

export interface IModelRecommendationItem {
	product_id: string;
	name: string;
	score: number;
	reason?: string;
}

export interface IModelRecommendationResponse {
	personalized: IModelRecommendationItem[];
	outfit: Record<string, IModelRecommendationItem[]>;
	outfit_complete_score: number;
}


