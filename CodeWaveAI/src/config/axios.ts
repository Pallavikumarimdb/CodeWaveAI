import axios from 'axios';

// Create an instance of axios with default settings
const instance = axios.create({
    baseURL: process.env.BACKEND_URL, // Set your backend URL here
    timeout: 10000, // Optional: Set a timeout for requests
});

// Optionally, you can add interceptors here for request/response handling

export default instance; 