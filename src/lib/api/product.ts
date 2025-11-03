import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
	IGetProductsResponse,
	IGetProductResponse,
	ICreateProductResponse,
	IUpdateProductResponse,
	IDeleteProductResponse,
	ICreateReviewResponse,
	IGetTopProductsResponse,
	IGetLatestProductsResponse,
	IGetSaleProductsResponse,
	IGetRelatedProductsResponse,
	IGetProductsByPriceResponse,
	IFilterProductsResponse,
	IRecommendSizeResponse,
} from "../../interface/response/product";
import {
	IGetProductsQuery,
	ICreateProductBody,
	IUpdateProductBody,
	ICreateReviewBody,
	IGetTopProductsQuery,
	IGetLatestProductsQuery,
	IGetSaleProductsQuery,
	IGetRelatedProductsQuery,
	IGetProductsByPriceQuery,
	IFilterProductsQuery,
} from "../../interface/request/product";

export const getProducts = async (query?: IGetProductsQuery): Promise<IGetProductsResponse> => {
	return await sendGet(`/products`, query);
};

// Get Product By ID
export const getProduct = async (id: string): Promise<IGetProductResponse> => {
	return await sendGet(`/products/${id}`);
};

// Create Product
export const createProduct = async (body: ICreateProductBody): Promise<ICreateProductResponse> => {
	return await sendPost(`/products`, body);
};

// Update Product
export const updateProduct = async (id: string, body: IUpdateProductBody): Promise<IUpdateProductResponse> => {
	return await sendPut(`/products/${id}`, body);
};

// Delete Product
export const deleteProduct = async (id: string): Promise<IDeleteProductResponse> => {
	return await sendDelete(`/products/${id}`);
};

// Create Review
export const createReview = async (id: string, body: ICreateReviewBody): Promise<ICreateReviewResponse> => {
	return await sendPost(`/products/${id}/reviews`, body);
};

// Get Top Products
export const getTopProducts = async (query?: IGetTopProductsQuery): Promise<IGetTopProductsResponse> => {
	return await sendGet(`/products/top`, query);
};

// Get Latest Products
export const getLatestProducts = async (query?: IGetLatestProductsQuery): Promise<IGetLatestProductsResponse> => {
	return await sendGet(`/products/latest`, query);
};

// Get Sale Products
export const getSaleProducts = async (query?: IGetSaleProductsQuery): Promise<IGetSaleProductsResponse> => {
	return await sendGet(`/products/sale`, query);
};

// Get Related Products
export const getRelatedProducts = async (query?: IGetRelatedProductsQuery): Promise<IGetRelatedProductsResponse> => {
	return await sendGet(`/products/related`, query);
};

// Get Products Sorted By Price
export const getProductsByPrice = async (query?: IGetProductsByPriceQuery): Promise<IGetProductsByPriceResponse> => {
	return await sendGet(`/products/price`, query);
};

// Recommend Size
export const recommendSize = async (userId: string): Promise<IRecommendSizeResponse> => {
	return await sendGet(`/products/recommend-size/${userId}`);
};

// Filter Products
export const filterProducts = async (query?: IFilterProductsQuery): Promise<IFilterProductsResponse> => {
	return await sendGet(`/products/filter`, query);
};

