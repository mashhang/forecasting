// lib/getApiUrl.ts
const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL_API === "false";

const API_URL = useLocal
  ? process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:5001"
  : process.env.NEXT_PUBLIC_PROD_API_URL || "https://loa-forecasting.vercel.app";

const getApiUrl = () => API_URL;

export default getApiUrl;
