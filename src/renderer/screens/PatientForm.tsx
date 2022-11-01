import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import Button from '../components/Button'
import DateInput from '../components/form/DateInput'
import SwitchInput from '../components/form/SwitchInput'
import TextInput from '../components/form/TextInput'
import { PatientModel } from '../models/patient.model'

export type PatientFormProps = {
    patient?: PatientModel;
    onSave: (v: {
        name: string;
        dob: string;
        archived_at: string | null;
    }) => Promise<void>;
    loading?: boolean;
}

const schema = yup.object({
    name: yup.string().required('Please enter a name'),
    dob: yup.date().required('Please enter a date of birth'),
}).required();

type PatientFields = {
    name: string;
    dob: Date;
    is_active: boolean;
}

function PatientForm({
    patient,
    onSave,
    loading,
}: PatientFormProps) {
    const { control, handleSubmit } = useForm<PatientFields>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: patient?.name || '',
            dob: patient ? new Date(`${patient.dob}T00:00:00`) : undefined,
            is_active: !patient?.archived_at,
        }
    })

    const onSubmit: SubmitHandler<PatientFields> = async (data) => {
        return onSave({
            name: data.name,
            dob: data.dob.toDateString(),
            archived_at: data.is_active ? null : (patient?.archived_at || 'now()'),
        })
    }

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label='Patient name'
                control={control}
                name='name'
            />
            <DateInput
                label='Date of birth'
                control={control}
                name='dob'
            />
            <SwitchInput
                label='Patient is active'
                control={control}
                name='is_active'
            />
            <Button loading={loading} type='submit'>Save Patient</Button>
        </form>
    )
}

export default PatientForm