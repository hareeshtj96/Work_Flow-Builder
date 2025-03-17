import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with actual backend

export const saveWorkflow = async (data) => {
    return axios.post(API_URL, data);
};

export const loadWorkflow = async () => {
    return axios.get(API_URL);
};
