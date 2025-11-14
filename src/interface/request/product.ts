export interface IGetProductsQuery {
	keyword?: string;
	search?: string;
	category?: string;
	brand?: string;
	ordering?: string;
	pageNumber?: number;
	pageSize?: number;
	option?: "all";
}

export interface ICreateProductBody {
	name: string;
	price: number;
	sale?: number;
	images: string[];
	brand: string;
	category: string;
	description: string;
	size: {
		s?: number;
		m?: number;
		l?: number;
		xl?: number;
	};
	colors?: string[];
}

export interface IUpdateProductBody {
	name?: string;
	price?: number;
	sale?: number;
	images?: string[];
	brand?: string;
	category?: string;
	description?: string;
	size?: {
		s?: number;
		m?: number;
		l?: number;
		xl?: number;
	};
	colors?: string[];
}

export interface ICreateReviewBody {
	rating: number;
	comment: string;
}

export interface IGetTopProductsQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface IGetLatestProductsQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface IGetSaleProductsQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface IGetRelatedProductsQuery {
	category?: string;
	excludeId?: string;
}

export interface IGetProductsByPriceQuery {
	sortBy?: "asc" | "desc";
	pageNumber?: number;
	perPage?: number;
}

export interface IFilterProductsQuery {
	keyword?: string;
	categories?: string; // comma-separated
	brands?: string; // comma-separated
	size?: "s" | "m" | "l" | "xl";
	rating?: number;
	priceMin?: number;
	priceMax?: number;
	sort_by?: "latest" | "rating" | "sale" | "priceAsc" | "priceDesc";
	pageNumber?: number;
	perPage?: number;
}

