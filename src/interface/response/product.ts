export interface IProductSize {
	s?: number;
	m?: number;
	l?: number;
	xl?: number;
}

export interface IProductReview {
	_id?: string;
	user?: string;
	name?: string;
	rating: number;
	comment: string;
	createdAt?: string;
}

export interface IProduct {
	_id: string;
	name: string;
	price: number;
	sale?: number;
	images: string[];
	brand: string;
	category: string;
	description: string;
	size: IProductSize;
	countInStock: number;
	colors?: string[];
	rating?: number;
	numReviews?: number;
	reviews?: IProductReview[];
	createdAt?: string;
	updatedAt?: string;
}

export interface IGetProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetProductResponse {
	message: string;
	data: {
		product: IProduct;
	};
}

export interface ICreateProductResponse {
	message: string;
	data: {
		product: IProduct;
	};
}

export interface IUpdateProductResponse {
	message: string;
	data: {
		product: IProduct;
	};
}

export interface IDeleteProductResponse {
	message: string;
}

export interface ICreateReviewResponse {
	message: string;
}

export interface IGetTopProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetLatestProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetSaleProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetRelatedProductsResponse {
	message: string;
	data: {
		products: IProduct[];
	};
}

export interface IGetProductsByPriceResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IFilterProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

