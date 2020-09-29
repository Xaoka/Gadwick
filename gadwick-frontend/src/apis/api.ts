import Axios from 'axios';

export default async function serverAPI<T extends object>(): Promise<T>
{
    const response = await Axios.get(`http://localhost:3003/features`);
    return response.data;
}