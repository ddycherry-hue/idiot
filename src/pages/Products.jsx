import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { getProducts } from "../api/products"

export default function ProductsPage() {

    const [searchParams, setSearchParams] = useSearchParams();

    const filters = {
        q: searchParams.get('q') ?? '',
        category: searchParams.get('category') ?? '',
        sort: searchParams.get('sort') ?? 'price',
        order: searchParams.get('order') ?? 'asc'
    }

    const updateFilters = (key, value) => {
        const next = new URLSearchParams(searchParams)
        value ? next.set(key, value) : next.delete(key);
        setSearchParams(next, { replace: true })
    }

    // поиск: локальное состояние + debounce, чтобы не слать запрос на каждую букву
    const [search, setSearch] = useState(filters.q)

    useEffect(() => {
        if (search === filters.q) return
        const t = setTimeout(() => updateFilters('q', search.trim()), 400)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    // синхронизация при изменении q извне (назад/вперёд в браузере)
    useEffect(() => {
        setSearch(filters.q)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.q])

    const { data = [], isLoading, isFetching, error } = useQuery({
        queryKey: ['products', filters], // параметры - часть ключа
        queryFn: () => getProducts(filters),
        placeholderData: keepPreviousData // не мигать пустым экраном
    })

    if (isLoading) return <p>Загрузка...</p>
    if (error) return <p>Ошибка: {error.message}</p>

    return (
        <div>
            <input
                type="search"
                placeholder="Поиск"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select value={filters.category} onChange={(e) => updateFilters('category', e.target.value)}>
                <option value=''>Все</option>
                <option value='phones'>Телефоны</option>
                <option value="laptops">Ноутбуки</option>
                <option value='audio'>Аудио</option>
            </select>

            <select
                value={`${filters.sort}-${filters.order}`}
                onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    const next = new URLSearchParams(searchParams)
                    next.set('sort', sort)
                    next.set('order', order)
                    setSearchParams(next, { replace: true })
                }}
            >
                <option value='price-asc'>Сначала дешевые</option>
                <option value='price-desc'>Сначала дорогие</option>
                <option value='rating-desc'>По рейтингу</option>
            </select>

            {isFetching && <small> Обновляем...</small>}

            {data.length === 0 && <p>Ничего не найдено</p>}

            <ul>
                {data.map((p) => (
                    <li key={p.id}>
                        {p.title} - {p.price} ★{p.rating}{' '}
                        <Link to={`/edit/${p.id}`}>Изменить</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
