import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserInfo } from '../slices/userSlice';

export interface LoginRequest {
    accountEmail: string;
    accountPassword: string;
}
export interface UserInfoRequest {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    birthDate: string | null;
    biography: null | string;
    profileImg: null | string;
    sex: null | string;
}

export interface ChangePasswordRequest {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface RegisterUserRequest {
    accountEmail: string;
    accountPassword: string;
    confirmAccountPassword: string;
    birthDate: string;
    lastName: string;
    firstName: string;
    accountPhone: string;
}

export interface RegisterAdminRequest {
    accountPhone: string;
    firstName: string;
    lastName: string;
    accountEmail: string;
    birthDate: string;
    accountPassword: string;
    confirmAccountPassword: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://estudyhub.azurewebsites.net/',
        prepareHeaders: (headers) => {
            // Thêm logic để lấy accessToken từ localStorage và đặt vào header Authorization
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                const accessToken = userData ? userData.accessToken : null;
                headers.set('Authorization', `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        loginUser: build.mutation({
            query: (body: LoginRequest) => ({
                url: 'api/account/signin',
                method: 'post',
                body,
            }),
        }),
        getUserInfo: build.query<
            UserInfoRequest,
            { accessToken: string | null; email: string | null }
        >({
            query: (data: { accessToken: string | null; email: string | null }) => {
                return {
                    url: `api/account/${data.email}`,
                    method: 'get',
                    headers: { Authorization: 'Bearer ' + data.accessToken },
                };
            },
        }),
        updateUserInfo: build.mutation<UserInfo, UserInfo>({
            query: ({ id, ...data }: UserInfo) => ({
                url: `api/account/UpdateProfile?accountId=${id}`,
                method: 'put',
                body: {
                    ...data,
                    id,
                },
            }),
            transformResponse: (response) => {
                const data = (response as any).dataObject;
                return {
                    id: data?.id,
                    biography: data?.biography,
                    birthDate: data?.birthDate,
                    firstName: data?.firstName,
                    lastName: data?.lastName,
                    phoneNumber: data?.phoneNumber,
                    profileImg: data?.profileImg,
                    sex: data?.sex,
                };
            },
        }),
        updatePassword: build.mutation<ChangePasswordRequest, ChangePasswordRequest>({
            query: (body: ChangePasswordRequest) => {
                return {
                    url: 'api/account/changePassword',
                    method: 'put',
                    body,
                };
            },
        }),
        registerUser: build.mutation<RegisterUserRequest, RegisterUserRequest>({
            query: (body: RegisterUserRequest) => {
                return {
                    url: 'api/account/signup',
                    method: 'post',
                    body,
                };
            },
        }),
        registerAdmin: build.mutation<
            RegisterAdminRequest,
            { formData: RegisterAdminRequest; role: number }
        >({
            query: ({ formData, role }) => {
                return {
                    url: `api/Account/SignUpStaffAdmin?role=${role}`,
                    method: 'post',
                    body: formData,
                };
            },
        }),
    }),
});

export const {
    useLoginUserMutation,
    useGetUserInfoQuery,
    useUpdateUserInfoMutation,
    useUpdatePasswordMutation,
    useRegisterUserMutation,
    useRegisterAdminMutation,
    endpoints,
} = authApi;
