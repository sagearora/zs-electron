import dayjs from 'dayjs';
import React from "react";
import { Link } from 'react-router-dom';
import { SteriCycleModel } from "../models/steri-cycle.model";

export type SteriCycleItemProps = {
    cycle: SteriCycleModel
}

export const SteriCycleListItem = ({ cycle }: SteriCycleItemProps) => {
    return <Link className={`flex items-center my-2 p-2 rounded-xl ${!cycle.finish_at ? 'bg-orange-100 hover:bg-orange-300' : cycle.status === 'failed' ? 'bg-red-100 hover:bg-red-200' : 'bg-green-100 hover:bg-green-200'}`} to={`/cycles/${cycle.id}`}>
        <div className='flex-1'>
            <p className='text-sm font-semibold'>{cycle.steri?.name} {cycle.steri?.serial}</p>
            <p className='text-lg font-bold'>Cycle #{cycle.cycle_number}</p>
            {cycle.finish_at ? <p className={`text-lg font-bold ${cycle.status === 'failed' ? 'bg-red-500' : 'bg-green-600'} text-white px-2 w-fit rounded-lg mt-1`}>{
                cycle.status === 'failed' ? 'Failed' : 'Passed'} {dayjs(cycle.finish_at).format('YYYY-MM-DD HH:mm')}</p> : <p 
                className='text-white bg-orange-500 px-2 w-fit rounded-lg mt-1'>
                    {cycle.status}</p>}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </Link>
}
