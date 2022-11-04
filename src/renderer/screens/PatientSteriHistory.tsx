import { gql, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import { constants } from 'original-fs'
import React, { useState } from 'react'
import Loading from '../components/Loading'
import NotFoundItem from '../components/NotFoundItem'
import { PatientSteriLabelFragment, PatientSteriLabelModel } from '../models/patient_steri_label.model'


export const QueryPatientSteriLabel = gql`
query list_patient_steri_label(
    $patient_id: bigint!,
    $start_date: timestamptz!, 
    $end_date: timestamptz!, 
) { 
    patient_steri_label(
        where: {
            _and: [
                {patient_id: {_eq: $patient_id}},
                {created_at: {_gte: $start_date}},
                {created_at: {_lt: $end_date}}
            ]
        },
        order_by: {id: desc}) {
        ${PatientSteriLabelFragment}
    }
}
`

export type PatientSteriHistoryProps = {
    patient_id: number;
}

function PatientSteriHistory({
    patient_id,
}: PatientSteriHistoryProps) {
    const [date, setDate] = useState(new Date())
    const {
        data,
        loading,
    } = useQuery(QueryPatientSteriLabel, {
        variables: {
            patient_id,
            start_date: dayjs(date).subtract(1, 'month').toISOString(),
            end_date: date.toISOString(),
        }
    })

    const items = (data?.patient_steri_label || []) as PatientSteriLabelModel[]

    return (
        <div className="">
            <p className="text-sm font-semibold text-gray-800">Steri History</p>
            {loading && <Loading />}
            <div className='grid grid-cols-2 gap-4 mt-4'>
                {items.map((item) => <div
                    key={item.id}
                    className='bg-slate-200 rounded-xl p-2'>
                    <p className='text-sm'>#{item.steri_label.id} - {item.steri_label.steri_item.category}</p>
                    <p className='text-lg font-bold'>{item.steri_label.steri_item.name}</p>
                    <p className='text-sm font-semibold'>Used By: {item.clinic_user.name}</p>
                    <p className='text-sm'>Operatory: {item.op.name}</p>
                    <p className='text-sm'>Packed On: {dayjs(item.steri_label.created_at).format('YYYY-MM-DD HH:mm')}</p>
                </div>)}
            </div>
            {items.length === 0 && !loading && <NotFoundItem
                title='No steri items used'
                noBack
            />}
        </div>
    )
}

export default PatientSteriHistory