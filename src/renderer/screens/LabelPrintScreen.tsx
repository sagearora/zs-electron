import { gql, useQuery } from '@apollo/client';
import React, { useMemo, useState } from 'react';
import { ZsMessageChannel } from '../../shared/ZsMessageChannel';
import Loading from '../components/Loading';
import { SteriItemFragment, SteriItemModel } from '../models/steri_item.model';
import { useUser } from '../services/user.context';

export const QueryAllSteriItems = gql`
    query steri_item {
        steri_item {
            ${SteriItemFragment}
        }
    }
`;

function LabelPrintScreen() {
    const {
        data,
        loading,
    } = useQuery(QueryAllSteriItems)
    const { user } = useUser();
    const [selected_category, setSelectedCategory] = useState<{
        name: string;
        items: SteriItemModel[]
    }>();

    const items = (data?.steri_item || []) as SteriItemModel[];

    const addItem = (item: SteriItemModel) => {
        if (!window.electron || !window.electron.ipcRenderer) {
            return;
        }
        const label = {
            qr: `zs/steri/1`,
            contents: item.name,
            user: user.name,
        }
        window.electron.ipcRenderer.sendMessage('zs-message', [
            ZsMessageChannel.PrintLabel,
            [label]
        ])
    }

    const categories = useMemo(() => {
        return items.reduce((all, item) => ({
            ...all,
            [item.category]: {
                name: item.category,
                items: all[item.category] ? [
                    ...all[item.category].items,
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
    return (
        <div className='py-6 h-full flex item-stretch mx-auto container overflow-hidden'>
            {loading ? <Loading /> : null}
            <div className='w-1/3 px-4 overflow-y-auto'>
                <p className='text-md font-bold mb-2'>Categories</p>
                {Object.keys(categories).map(category => <div
                    className={`p-4 w-full mb-4 rounded-xl ${selected_category?.name === category ? 'bg-green-100 hover:bg-green-200' : 'bg-slate-200 hover:bg-slate-300'}`}
                    onClick={() => setSelectedCategory(categories[category])}
                    key={category}>{category}</div>)}
            </div>
            <div className='flex-1 px-4'>
                <p className='text-md font-bold mb-2'>{selected_category?.name || 'Pick a category'}</p>
                {selected_category ? <div className=' w-full grid grid-cols-4 gap-4 items-start'>
                    {selected_category.items.map(item => <button
                        key={item.id}
                        onClick={() => addItem(item)}
                        className='p-4 bg-slate-100 h-full rounded-xl'
                    >{item.name}</button>)}</div> : null}
            </div>
        </div>
    )
}

export default LabelPrintScreen