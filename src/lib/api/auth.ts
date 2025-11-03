import axios from "axios";
import { sendPost, sendPut } from "./axios";
import {
	IRegisterResponse,
	ILoginResponse,
	IForgotPasswordResponse,
	IVerifyCodeResponse,
	IResetPasswordResponse,
	IResetPasswordByUserIdResponse,
} from "../../interface/response/auth";
import {
	IRegisterBody,
	ILoginBody,
	IForgotPasswordBody,
	IVerifyCodeBody,
	IResetPasswordBody,
	IResetPasswordByUserIdBody,
} from "../../interface/request/auth";

// Register
export const register = async (body: IRegisterBody): Promise<IRegisterResponse> => {
	return await sendPost(`/auth/register`, body);
};

// Login
export const login = async (body: ILoginBody): Promise<ILoginResponse> => {
	return await sendPost(`/auth/login`, body);
};

// Forgot Password
export const forgotPassword = async (body: IForgotPasswordBody): Promise<IForgotPasswordResponse> => {
	return await sendPost(`/auth/forgot-password`, body);
};

// Verify Code
export const verifyCode = async (body: IVerifyCodeBody): Promise<IVerifyCodeResponse> => {
	return await sendPost(`/auth/verify-code`, body);
};

// Reset Password (with resetToken in Authorization header)
export const resetPassword = async (body: IResetPasswordBody, resetToken?: string): Promise<IResetPasswordResponse> => {
	const baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
	const config: any = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (resetToken) {
		config.headers["Authorization"] = `Bearer ${resetToken}`;
	}

	const response = await axios.put(`${baseURL}/auth/reset-password`, body, config);
	return response?.data;
};

// Reset Password By User ID
export const resetPasswordByUserId = async (body: IResetPasswordByUserIdBody): Promise<IResetPasswordByUserIdResponse> => {
	return await sendPost(`/auth/reset-password-by-user-id`, body);
};

