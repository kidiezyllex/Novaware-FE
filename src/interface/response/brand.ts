export interface IBrand {
	_id: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface IGetBrandsResponse {
	message: string;
	data: {
		brands: IBrand[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface ICreateBrandResponse {
	message: string;
	data: {
		brand: IBrand;
	};
}

export interface IUpdateBrandResponse {
	message: string;
	data: {
		brand: IBrand;
	};
}

export interface IDeleteBrandResponse {
	message: string;
}

export interface IGroupedBrandItem {
    _id: string;
    name: string;
}

export interface IBrandGroup {
    letter: string;
    brands: IGroupedBrandItem[];
}

export interface IGetGroupedBrandsResponse {
    message: string;
    data: {
        groups: IBrandGroup[];
    };
}

