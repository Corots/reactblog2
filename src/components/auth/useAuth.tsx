import { type } from "@testing-library/user-event/dist/types/setup/directApi";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { Iarticle } from "../rowArticles";


interface IRefreshResponse {
  access_token: string;
}

interface IRefreshRequest {
  refresh_token : string;
  token : string
}




const CheckApi = async<T extends {}> (axiosPromise: (access_token : string) => Promise<AxiosResponse<T, any>>  ) => {
  // const [info, setInfo] = useState<T>();
  // const [error, setError] = useState<null | Error>(null);
  // const [loading, setLoading] = useState<boolean>(true);


    const getInfo = async () => {
      try {
        const access_token = localStorage.getItem("access_token");

        if (!access_token) {
          throw new Error("No authentication token found");
        }
        
        console.log('before response', axiosPromise);
        const response = await axiosPromise(access_token)
        console.log('after response');

      
          return (response);
        }
      catch (error: any) {
        if (error.isAxiosError && error.response?.status === 401) {
          const access_token = localStorage.getItem("access_token");
          const refresh_token = localStorage.getItem("refresh_token");

          if (!refresh_token || !access_token) {
            throw new Error("No refresh or access token found");
          }
          
          const finalSearchParams : IRefreshRequest = 
          {
            refresh_token : refresh_token,
            token : access_token,
          }
          
          const refreshResponse : AxiosResponse<IRefreshResponse, any>   = await axios.get("https://myawesomeapp.me/api/refresh_token", { params: finalSearchParams }  );


          if (!refreshResponse.status) {
            throw new Error("Failed to refresh token");
          }

          localStorage.setItem("access_token", refreshResponse.data.access_token);

          const newPromise = axiosPromise(refreshResponse.data.access_token)
          console.log('Here is new request!', newPromise)
          const newResponse = await newPromise

          if (!newResponse.status) {
            throw new Error("Failed to get information");
          }

          return (newResponse);

        } else {
          console.log('Other error catched')
        }
      }


  };

  return getInfo();
};


export default CheckApi

