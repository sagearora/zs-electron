import dayjs from 'dayjs';
import React from "react";
import { Link } from 'react-router-dom';
import { SteriCycleModel } from "../models/steri-cycle.model";

export type SteriCycleItemProps = {
    cycle: SteriCycleModel
}

export const SteriCycleItem = ({ cycle }: SteriCycleItemProps) => {
    return <Link className={`flex items-center my-2 p-2 rounded-md ${!cycle.finish_at ? 'bg-orange-100 hover:bg-orange-300' : cycle.status === 'failed' ? 'bg-red-100 hover:bg-red-200' : 'bg-green-100 hover:bg-green-200'}`} to={`/cycles/${cycle.id}`}>
        <div className='flex-1'>
            {cycle.finish_at ? <p className={`text-sm font-bold ${cycle.status === 'failed' ? 'bg-red-500' : 'bg-green-600'} text-white px-2 w-fit rounded-sm mb-1`}>{cycle.status === 'failed' ? 'Failed' : 'Passed'}</p> : null}
            <p className='text-sm font-semibold'>{cycle.steri?.name} {cycle.steri?.serial}</p>
            <p className='text-lg font-bold'>Cycle #{cycle.cycle_id}</p>
            <p className='text-sm'>Start: {cycle.start_at ? dayjs(cycle.start_at).format('MM/DD/YYYY HH:mm') : 'Not Started'}</p>
            <p className='text-sm'>Finish: {cycle.finish_at ? dayjs(cycle.finish_at).format('MM/DD/YYYY HH:mm') : 'Not Finished'}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </Link>
}
