import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useMemo, useState } from 'react';
import { ZsMessageChannel } from '../../shared/ZsMessageChannel';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { SteriItemFragment, SteriItemModel } from '../models/steri-item.model';
import { SteriLabelFragment, SteriLabelModel } from '../models/steri-label.model';
import { useUser } from '../services/user.context';

export const QueryAllSteriItems = gql`
    query steri_item {
        steri_item {
            ${SteriItemFragment}
        }
    }
`;

const MutationInsertLabel = gql`
    mutation insert_label($objects: [steri_label_insert_input!]!) {
        insert_steri_label(objects: $objects) {
            returning {
                ${SteriLabelFragment}
            }
        }
    }
`;

function LabelPrintScreen() {
    const {
        data,
        loading,
    } = useQuery(QueryAllSteriItems)
    const [to_print, setToPrint] = useState<{ [id: number]: number }>({})
    const [insertLabel, insert_label_status] = useMutation(MutationInsertLabel)
    const { user } = useUser();
    const [selected_category, setSelectedCategory] = useState<{
        name: string;
        items: SteriItemModel[]
    }>();

    const items = (data?.steri_item || []) as SteriItemModel[];

    const addItem = (item: SteriItemModel) => {
        setToPrint(p => ({
            ...p,
            [item.id]: (p[item.id] || 0) + 1,
        }))
    }

    const removeItem = (item: SteriItemModel) => {
        setToPrint(p => ({
            ...p,
            [item.id]: Math.max(0, (p[item.id] || 0) - 1),
        }))
    }

    const print = async () => {
        const objects: {
            steri_item_id: number;
            clinic_user_id: number;
        }[] = [];
        items
            .filter(item => to_print[item.id] > 0)
            .forEach(item => {
                for (let i = 0; i < to_print[item.id]; i++) {
                    objects.push({
                        steri_item_id: item.id,
                        clinic_user_id: user.id,
                    })
                }
            })
        const { data } = await insertLabel({
            variables: {
                objects,
            }
        })
        const labels = (data?.insert_steri_label?.returning || []) as SteriLabelModel[]        

        if (!window.electron || !window.electron.ipcRenderer) {
            return;
        }
        window.electron.ipcRenderer.sendMessage('zs-message', [
            ZsMessageChannel.PrintLabel,
            ...labels.map(label => ({
                user: label.clinic_user.name,
                contents: label.steri_item.name,
                date: label.created_at,
                qr: `zs/steri_label/${label.id}`
            }))
        ])
        setToPrint({})
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

    const total_printable_items = useMemo(() => {
        return Object.keys(to_print).reduce((count, key) => count + to_print[+key] || 0, 0)
    }, [to_print])

    return (
        <div className='h-full flex item-stretch overflow-hidden'>
            {loading ? <Loading /> : null}
            <div className='w-1/4 border-r-2 shadow-lg p-4 overflow-y-auto'>
                <p className='text-md font-bold mb-2'>Categories</p>
                {Object.keys(categories).map(category => <div
                    className={`p-4 w-full mb-4 rounded-xl ${selected_category?.name === category ? 'bg-green-100 hover:bg-green-200' : 'bg-slate-200 hover:bg-slate-300'}`}
                    onClick={() => setSelectedCategory(categories[category])}
                    key={category}>{category}</div>)}

            </div>
            <div className='flex-1 relative'>
                <div className='p-4'>
                    <p className='text-md font-bold mb-2'>{selected_category?.name || 'Pick a category'}</p>
                    {selected_category ? <div className='w-full grid grid-cols-4 gap-4 items-start'>
                        {selected_category.items.map(item => <button
                            key={item.id}
                            onClick={() => addItem(item)}
                            className='relative p-4 bg-slate-100 h-full rounded-xl overflow-hidden'
                        >{item.name}{to_print[item.id] > 0 ? <span className='absolute right-0 top-0 w-8 flex items-center justify-center
                    text-xl font-bold h-full bg-green-200'>{to_print[item.id]}</span> : null}
                        </button>)}</div> : null}
                </div>
            </div>
            {total_printable_items > 0 ? <div className='w-1/5 p-4 border-l-2 flex flex-col overflow-hidden'>
                <div className='w-full pb-2'>
                    <Button className='bg-red-200'
                        onClick={print}
                        loading={insert_label_status.loading}>Print <span className='font-bold'>{total_printable_items}</span> Labels</Button>
                </div>
                <div className='overflow-y-auto flex-1'>
                    {items.filter(item => to_print[item.id] > 0).map(item => <button
                        key={item.id}
                        onClick={() => removeItem(item)}
                        className='relative w-full my-2 p-2 bg-slate-100 block rounded-xl overflow-hidden'
                    ><span className='absolute left-0 top-0 w-8 flex items-center justify-center
                text-3xl font-bold h-full bg-red-500'>-</span>{item.name}<span className='absolute right-0 top-0 w-8 flex items-center justify-center
                text-xl font-bold h-full bg-green-200'>{to_print[item.id]}</span></button>)}
                </div>
            </div> : null}
        </div>
    )
}

export default LabelPrintScreen