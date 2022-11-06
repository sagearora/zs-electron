
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import Button from '../lib/Button'
import TextInput from '../lib/form/TextInput'
import { SteriCycleModel } from '../models/steri-cycle.model'
import { SteriPicker } from './SteriPicker'

export type SteriTemplateFormProps = {
    cycle?: SteriCycleModel;
    loading?: boolean;
    onSave: (d: any) => Promise<void>;
}

type StartFields = {
    cycle_number: number;
    steri_id: { label: string; value: number };
}

const schema = yup.object({
    cycle_number: yup.string().required('Please enter the steri cycle number'),
    steri_id: yup.object().required('Please select a sterilizer'),
}).required();

function SteriCycleForm({
    cycle,
    loading,
    onSave,
}: SteriTemplateFormProps) {
    const { control, handleSubmit, getValues } = useForm<StartFields>({
        resolver: yupResolver(schema),
        defaultValues: cycle ? {
            cycle_number: cycle.cycle_number,
            steri_id: {
                label: `${cycle.steri?.name} - ${cycle.steri?.serial}`,
                value: cycle.steri_id
            },
        } : {}
    });

    const onSubmit: SubmitHandler<StartFields> = async data => {
        const cycle = {
            cycle_number: data.cycle_number,
            steri_id: data.steri_id.value,
        }
        return onSave(cycle);
    }

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}>
            <SteriPicker
                name='steri_id'
                control={control as any}
            />
            <TextInput
                label='Cycle Number #'
                control={control}
                name='cycle_number'
            />
            <Button
                loading={loading}
                type='submit'>{cycle ? 'Save Cycle' : 'Create Cycle'}</Button>
        </form>
    )
}

export default SteriCycleForm