import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { LargeInt, PageLimit } from "../constants";
import { PatientFragment, PatientModel } from "../models/patient.model";
import { SteriModel } from "../models/steri.model";

export const QueryPatientList = gql`
query list_patient($cursor: bigint!, $limit: Int!) { 
    patient(limit: $limit, where: {
        id: {_lt: $cursor}
    } order_by: {id: desc}) {
        ${PatientFragment}
    }
}
`

function PatientListScreen() {
    const [has_more, setHasMore] = useState(true);
    const {
        loading,
        data,
        fetchMore,
    } = useQuery(QueryPatientList, {
        variables: {
            cursor: LargeInt,
            limit: PageLimit,
        },
        onCompleted: (d) => {
            setHasMore(d.steri_cycle?.length % PageLimit === 0);
        }
    })

    const patients = (data?.patient || []) as PatientModel[];

    const loadMore = () => {
        if (patients.length > 0) {
            fetchMore({
                variables: {
                    cursor: patients[patients.length - 1].id,
                    limit: PageLimit,
                }
            })
        }
    }

    return <div className='my-6 max-w-screen-md mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/' />
            <p className='ml-2 font-bold text-gray-500'>Patients</p>
            <div className='flex-1' />
            <Link
                to='create'
            >+ Add Patient</Link>
        </div>
        {patients.map(patient => <Link
            className="flex items-center border-b-2 p-2 hover:bg-slate-200"
            to={`${patient.id}/edit`}
            key={patient.id}
        >
            <div className='flex-1'>
                <p className={`text-md ${patient.archived_at ? 'line-through text-gray-700' : ''}`}>{patient.name}</p>
                <p className={`text-sm ${patient.archived_at ? 'line-through text-gray-700' : ''}`}>{patient.dob}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>)}
        {has_more ? <Button
            loading={loading} onClick={loadMore}>Fetch More</Button> : null}

    </div>
}

export default PatientListScreen;