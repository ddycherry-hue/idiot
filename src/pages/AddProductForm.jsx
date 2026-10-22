import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import { createProduct } from "../api/products";


export function AddProductForm() {

    const queryClient = useQueryClient();
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setTitle('')
            setPrice('')
            alert('успешно создан продукт')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate({ title, price: Number(price), category: 'phones', rating: 0 })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название" />
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Цена" type="number"/>
            <button disabled={isPending}>{isPending ? 'Сохраняем...' : 'Добавить'}</button>
            {isError && <p>Ошибка: {error.message}</p>}
        </form>
    )
}