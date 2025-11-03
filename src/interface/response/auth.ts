export interface IUser {
	_id: string;
	name: string;
	email: string;
	isAdmin: boolean;
}

export interface IRegisterResponse {
	message: string;
	data: IUser;
}

export interface ILoginResponse {
	message: string;
	data: IUser & {
		token: string;
	};
}

export interface IForgotPasswordResponse {
	message: string;
}

export interface IVerifyCodeResponse {
	message: string;
	data: {
		resetToken: string;
	};
}

export interface IResetPasswordResponse {
	message: string;
}

export interface IResetPasswordByUserIdResponse {
	message: string;
}

