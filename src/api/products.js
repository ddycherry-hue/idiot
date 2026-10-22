import axios from "axios";

export const api = axios.create({ baseURL: 'http://localhost:3001'})

export const getProducts = async ({ q, category, sort, order }) => {
    const { data } = await api.get('/products', {
        params: {
            q: q || undefined,
            category: category || undefined,
            _sort: sort,
            _order: order
        }
    })

    return data;
}

export const createProduct = (product) => api.post('/products', product).then((r) => r.data)
export const replaceProduct = ({ id, ...product }) => api.put(`/products/${id}`, product).then((r) => r.data)
export const patchProduct = ({ id, ...changes }) => api.patch(`/products/${id}`, changes).then((r) => r.data)

export const getProduct = (id) => api.get(`/products/${id}`).then((r) => r.data)
