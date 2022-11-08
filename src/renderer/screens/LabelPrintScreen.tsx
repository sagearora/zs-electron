import { gql, useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ZsMessageChannel } from '../../shared/ZsMessageChannel';
import Button from '../lib/Button';
import Loading from '../lib/Loading';
import { DefaultExpiryMonths, QRType } from '../constants';
import { SteriItemFragment, SteriItemModel } from '../models/steri-item.model';
import { SteriLabelFragment, SteriLabelModel } from '../models/steri-label.model';
import { UserModel } from '../models/user.model';
import { QueryAllSteriItems } from '../queries';
import { useDialog } from '../lib/dialog.context';
import { createQr } from '../services/qr-service';
import UserPinDialog from './UserPinDialog';


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
    const dialog = useDialog();
    const {
        data,
        loading,
    } = useQuery(QueryAllSteriItems())
    const [is_printing, setIsPrinting] = useState(false);
    const [to_print, setToPrint] = useState<{ [id: number]: number }>({})
    const [insertLabel, insert_label_status] = useMutation(MutationInsertLabel)
    const [selected_category, setSelectedCategory] = useState<{
        name: string;
        items: SteriItemModel[]
    }>();
    const [show_pin, setShowPin] = useState(false);

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

    const print = async (user: UserModel) => {
        if (!user) {
            return;
        }
        setShowPin(false)
        const objects: {
            steri_item_id: number;
            clinic_user_id: number;
            expiry_at: string;
        }[] = [];
        items
            .filter(item => to_print[item.id] > 0)
            .forEach(item => {
                for (let i = 0; i < to_print[item.id]; i++) {
                    objects.push({
                        steri_item_id: item.id,
                        clinic_user_id: user.id,
                        expiry_at: dayjs().add(DefaultExpiryMonths, 'months').toISOString(),
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
        // console.log(labels.map(label => createQr({type: QRType.SteriLabel, id: label.id})))

        setIsPrinting(true);
        const result = await window.electron.ipcRenderer.invoke('zs-message', [
            ZsMessageChannel.PrintLabel,
            ...labels.map(label => ({
                user: label.clinic_user.name,
                contents: label.steri_item.name,
                date: label.created_at,
                expiry: label.expiry_at,
                qr: createQr({
                    type: QRType.SteriLabel,
                    id: label.id,
                }),
                category: label.steri_item.category,
                id: label.id,
            }))
        ])
        setIsPrinting(false);
        if (result !== 'success') {
            dialog.showDialog({
                title: 'Fail to print',
                message: result,
                buttons: [{
                    children: 'Okay'
                }]
            })
        } else {
            setToPrint({})
        }
    }

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

    const total_printable_items = useMemo(() => {
        return Object.keys(to_print).reduce((count, key) => count + to_print[+key] || 0, 0)
    }, [to_print])

    return (
        <div className='h-full flex item-stretch overflow-hidden'>
            <UserPinDialog
                onClose={() => setShowPin(false)}
                setUser={print}
                show={show_pin}
            />
            {loading ? <Loading /> : null}
            <div className='w-1/4 border-r-2 shadow-lg p-4 overflow-y-auto'>
                <p className='text-md font-bold mb-2'>Categories</p>
                {Object.keys(categories).map(category => <button
                    className={`p-4 w-full mb-4 rounded-xl ${selected_category?.name === category ? 'bg-green-100 hover:bg-green-200' : 'bg-slate-200 hover:bg-slate-300'}`}
                    onClick={() => setSelectedCategory(categories[category])}
                    key={category}>{category}</button>)}
                <Link to='/settings/steri-items'>
                    <div className='text-blue-800 py-2 text-center'>Edit Items</div>
                </Link>

            </div>
            <div className='flex-1 relative'>
                <div className='p-4'>
                    <p className='text-md font-bold mb-2'>{selected_category?.name || 'Pick a category'}</p>
                    {selected_category ? <div className='w-full grid grid-cols-3 gap-4 items-start'>
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
                {is_printing ? <div className='flex flex-col justify-center flex-1 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                    <h6 className='text-lg font-bold my-4'>Printing...</h6>
                </div> : <>
                    <div className='w-full pb-2'>
                        <Button className='bg-red-200'
                            onClick={() => setShowPin(true)}
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
                </>}
            </div> : null}
        </div>
    )
}

export default LabelPrintScreen