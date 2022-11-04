import dayjs from 'dayjs'
import React from 'react'
import Loading from '../components/Loading'
import { SteriCycleItemModel } from '../models/steri-cycle-item.model'

export type SteriCycleItemProps = {
    item: SteriCycleItemModel;
    loading?: boolean;
    remove: () => void;
}

function SteriCycleItem({
    item,
    loading,
    remove,
}: SteriCycleItemProps) {

    return (
        <div
            key={item.id}
            className='bg-slate-200 rounded-xl p-2 relative overflow-hidden'>
            {loading && <div className='absolute left-0 top-0 w-full h-full z-10 bg-white/50 flex items-center justify-center'>
                <Loading />
            </div>}
            <button
                onClick={remove}
                className='absolute text-white right-2 top-2 p-2 rounded-full
                                hover:bg-red-600 flex items-center justify-center bg-red-500'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

            </button>
            <p className='text-sm'>#{item.steri_label.id} - {item.steri_label.steri_item.category}</p>
            <p className='text-lg font-bold'>{item.steri_label.steri_item.name}</p>
            <p className='text-sm font-semibold'>{item.steri_label.clinic_user.name}</p>
            <p className='text-sm'>Date: {dayjs(item.steri_label.created_at).format('YYYY-MM-DD HH:mm')}</p>
            <p className='text-sm'>Exp: {dayjs(item.steri_label.expiry_at).format('YYYY-MM-DD HH:mm')}</p>
        </div>
    )
}

export default SteriCycleItem