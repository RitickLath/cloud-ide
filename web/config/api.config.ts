import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 1000 * 60 * 5, // 5 minutes
  withCredentials: true,
})

export default axiosInstance
