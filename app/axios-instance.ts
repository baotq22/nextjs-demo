import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://64f71db49d77540849531dc0.mockapi.io/',
    headers: {
        'Content-Type': 'application/json',
    }
})