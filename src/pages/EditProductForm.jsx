import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getProduct, patchProduct } from "../api/products"

export function EditProductForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProduct(id),
    })

    const [form, setForm] = useState({ title: '', price: '', category: 'phones', rating: '' })

    useEffect(() => {
        if (product) {
            setForm({
                title: product.title,
                price: String(product.price),
                category: product.category,
                rating: String(product.rating),
            })
        }
    }, [product])

    const { mutate, isPending, isError, error: saveError } = useMutation({
        mutationFn: patchProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['product', id] })
            navigate('/')
        },
    })

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate({
            id,
            title: form.title,
            price: Number(form.price),
            category: form.category,
            rating: Number(form.rating),
        })
    }

    if (isLoading) return <p>Загрузка...</p>
    if (error) return <p>Ошибка: {error.message}</p>

    return (
        <form onSubmit={handleSubmit}>
            <input value={form.title} onChange={set('title')} placeholder="Название" required />
            <input value={form.price} onChange={set('price')} placeholder="Цена" type="number" min="0" required />
            <select value={form.category} onChange={set('category')}>
                <option value="phones">Телефоны</option>
                <option value="laptops">Ноутбуки</option>
                <option value="audio">Аудио</option>
            </select>
            <input value={form.rating} onChange={set('rating')} placeholder="Рейтинг" type="number" min="0" max="5" step="0.1" />
            <button disabled={isPending}>{isPending ? 'Сохраняем...' : 'Сохранить'}</button>
            <button type="button" onClick={() => navigate('/')}>Отмена</button>
            {isError && <p>Ошибка: {saveError.message}</p>}
        </form>
    )
}
