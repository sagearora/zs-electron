import { useQuery } from "@apollo/client";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { SteriItemModel } from "../models/steri-item.model";
import { QueryAllSteriItems } from "../queries";


function SteriItemListScreen() {
    const {
        loading,
        data,
    } = useQuery(QueryAllSteriItems())

    const items = (data?.steri_item || []) as SteriItemModel[];
    const categories = useMemo(() => {
        return items.reduce((all, item) => ({
            ...all,
            [item.category.toLowerCase()]: {
                name: item.category,
                items: all[item.category.toLowerCase()] ? [
                    ...all[item.category.toLowerCase()].items,
                    item,
                ] : [item],
            }
        }), {} as {
            [id: string]: {
                name: string;
                items: SteriItemModel[]
            }
        })
    }, [items])

    return <div className='my-6 max-w-screen-md mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/settings' />
            <p className='ml-2 font-bold text-gray-500'>Steri Items</p>
            <div className='flex-1' />
            <Link
                to='create'
            >+ Add Item</Link>
        </div>
        {Object.keys(categories).map((category: string) => <div
            className="mb-6"
            key={category}>
            <p className="text-sm font-semibold">{category.toLocaleUpperCase()}</p>

            {categories[category].items.map(item => <Link
                className="flex items-center border-b-2 p-2 hover:bg-slate-200"
                to={`${item.id}/edit`}
                key={item.id}>
                <div className={`flex-1 ${item.archived_at ? 'line-through text-gray-700' : ''}`}>
                    <p className='text-lg'>{item.name}</p>
                    <p className='text-sm text-gray-800'>{item.is_count_enabled ? `Count: ${item.total_count}` : ''}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </Link>)}
        </div>)}

    </div>
}

export default SteriItemListScreen;
