import axios, {AxiosResponse, InternalAxiosRequestConfig} from 'axios';

let BASE_URL;
if(process.env.NODE_ENV === "development")
    BASE_URL = "http://localhost:5005/api";
else BASE_URL = '/api';

export const Api = axios.create({
    baseURL: BASE_URL
});