import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { get } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL || " http://localhost:3001/";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Admin", "Banner", "Project", "Career", "Faq", "Media"],
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),
    adminRegister: builder.mutation({
      query: (credentials) => ({
        url: "/admin/register",
        method: "POST",
        body: credentials,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
    }),
    getAdminProfile: builder.query({
      query: () => "/admin/profile",
      providesTags: ["Admin"],
    }),
    updateAdminProfile: builder.mutation({
      query: (data) => ({
        url: "/admin/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    changeAdminPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/change-password",
        method: "PUT",
        body: data,
      }),
    }),

    getAdminSideBanner: builder.query({
      query: () => ({
        url: "/banners/banner",
        method: "GET",
      }),
      providesTags: ["Banner"],
    }),

    // toggleProject: builder.mutation({
    //   query: (id) => ({
    //     url: `/projects/toggle/${id}`,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["Project"],
    // }),
    getViewAnalytics: builder.query({
      query: () => "/view/get-view-count",
    }),

    createGeneralSetting: builder.mutation({
      query: (formData) => ({
        url: "/genral-setting/general-settings",
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: ["Admin"],
    }),
    getGeneralSettingQuery: builder.query({
      query: () => ({
        url: "/genral-setting/general-settings",
        method: "GET",
      }),

      providesTags: ["Admin"],
    }),
  

    

   

    getAllPosts: builder.query({
      query: (params) => ({
        url: "/media/get-all-media-posts",
        method: "GET",
        params, // 🔥 yahin se query string jayegi
      }),
      providesTags: ["Media"],
    }),

    createMediaPostMutation: builder.mutation({
      query: (formData) => ({
        url: "/media/create-post",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Media"],
    }),

    updateMediaPost: builder.mutation({
      query: ({ id, data }) => ({
        url: `/media/update-post/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Media"],
    }),

    toggleMediaPostStatus: builder.mutation({
      query: (id) => ({
        url: `/media/toogle-media-staus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Media"],
    }),

    deleteMediaPost: builder.mutation({
      query: (id) => ({
        url: `/media/delete-post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Media"],
    }),
    excelImportEnquiries: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("excelFile", file); // 👈 IMPORTANT

        return {
          url: `/excel-enquiry/create-excel-eqnuiry`,
          method: "POST",
          body: formData,
        };
      },
    }),

    getExcelEnquiries: builder.query({
      query: () => ({
        url: `/excel-enquiry/get-excel-enquiry`,
        method: "GET",
      }),
    }),
    searchEnquiries: builder.query({
      query: () => ({
        url: `/excel-enquiry/search?q=${encodeURIComponent(q)}`,
        method: "GET",
      }),
    }),
    getData: builder.query({
      query: ({ url, params }) => ({
        url,
        method: "GET",
        params,
      }),

      // 👇 yahan se tag attach hoga
      providesTags: (_, __, args) => {
        console.log("🔥 PROVIDATE TAG ARGUMENTS:", args);

        return args.tag ? [args.tag] : [];
      },
    }),

    createData: builder.mutation({
      query: ({ url, body }) => ({
        url,
        method: "POST",
        body,
      }),

      // 👇 jis tag ko pass karoge wo refresh hoga
      invalidatesTags: (_, __, args) => {
        console.log("🔥 INVALIDATE TAG ARGUMENTS:", args);

        return args.tag ? [args.tag] : [];
      },
    }),
    updateData: builder.mutation({
      query: ({ url, body }) => ({
        url,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_, __, { tag }) => (tag ? [tag] : []),
    }),

    patchData: builder.mutation({
      query: ({ url, body }) => ({
        url,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_, __, { tag }) => (tag ? [tag] : []),
    }),
    deleteData: builder.mutation({
      query: ({ url }) => {
        console.log("delete-url", url);

        return {
          url,
          method: "DELETE",
        };
      },

      invalidatesTags: (_, __, { tag }) => (tag ? [tag] : []),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminRegisterMutation,
  useAdminLogoutMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangeAdminPasswordMutation,

  useGetAdminSideBannerQuery,
  
  useGetViewAnalyticsQuery,
  useCreateGeneralSettingMutation,
  useGetGeneralSettingQueryQuery,
  
 
 
  useGetAllPostsQuery,
  useCreateMediaPostMutationMutation,
  useUpdateMediaPostMutation,
  useDeleteMediaPostMutation,
  useToggleMediaPostStatusMutation,
  useExcelImportEnquiriesMutation,
  useGetExcelEnquiriesQuery,
  useSearchEnquiriesQuery,
  useGetDataQuery,
  useCreateDataMutation,
  useDeleteDataMutation,
  useUpdateDataMutation,
  usePatchDataMutation
} = adminApi;
