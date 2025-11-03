import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getBrands,
	createBrand,
	updateBrand,
	deleteBrand,
} from '../../lib/api/brand';
import * as BrandTypes from '../../interface/response/brand';
import * as BrandRequestTypes from '../../interface/request/brand';

export const useGetBrands = (query?: BrandRequestTypes.IGetBrandsQuery) => {
	return useQuery<BrandTypes.IGetBrandsResponse, Error>({
		queryKey: ['brands', 'list', query],
		queryFn: () => getBrands(query),
	});
};

export const useGetGroupedBrands = () => {
    return useQuery<BrandTypes.IGetGroupedBrandsResponse, Error>({
        queryKey: ['brands', 'grouped'],
        // lazy import to avoid circular import complaints in some bundlers
        queryFn: async () => {
            const { getGroupedBrands } = await import('../../lib/api/brand');
            return await getGroupedBrands();
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateBrand = () => {
	const queryClient = useQueryClient();

	return useMutation<BrandTypes.ICreateBrandResponse, Error, BrandRequestTypes.ICreateBrandBody>({
		mutationFn: createBrand,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['brands'] });
		},
	});
};

export const useUpdateBrand = () => {
	const queryClient = useQueryClient();

	return useMutation<
		BrandTypes.IUpdateBrandResponse,
		Error,
		{ id: string; body: BrandRequestTypes.IUpdateBrandBody }
	>({
		mutationFn: ({ id, body }) => updateBrand(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['brands'] });
		},
	});
};

export const useDeleteBrand = () => {
	const queryClient = useQueryClient();

	return useMutation<BrandTypes.IDeleteBrandResponse, Error, string>({
		mutationFn: deleteBrand,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['brands'] });
		},
	});
};

