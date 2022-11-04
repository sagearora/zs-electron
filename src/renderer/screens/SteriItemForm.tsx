import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import * as yup from "yup"
import Button from '../components/Button'
import SwitchInput from '../components/form/SwitchInput'
import TextInput from '../components/form/TextInput'
import { SteriItemModel } from '../models/steri-item.model'

export type TemplateFormProps = {
    steri_item?: SteriItemModel;
    onSave: (v: {
        name: string;
        category: string;
        archived_at: string | null;
        is_count_enabled: boolean;
        total_count: number;
    }) => Promise<void>;
}

const schema = yup.object({
    name: yup.string().required('Please enter a name'),
    category: yup.string().required('Please enter a category (e.g. Exo, Restorative, etc.)'),
}).required();

type SteriItemFields = {
    name: string;
    category: string;
    is_active: boolean;
    is_count_enabled: boolean;
    total_count: number;
}

function SteriItemForm({
    steri_item: steri_item,
    onSave,
}: TemplateFormProps) {
    const { control, handleSubmit } = useForm<SteriItemFields>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: steri_item?.name || '',
            category: steri_item?.category || '',
            is_active: !steri_item?.archived_at,
            is_count_enabled: steri_item ? steri_item.is_count_enabled : true,
            total_count: steri_item?.total_count || 0,
        }
    })

    const is_count_enabled = useWatch({
        control,
        name: 'is_count_enabled',
    })

    const onSubmit: SubmitHandler<SteriItemFields> = async (data) => {
        return onSave({
            name: data.name,
            category: data.category,
            archived_at: data.is_active ? null : (steri_item?.archived_at || 'now()'),
            is_count_enabled: data.is_count_enabled,
            total_count: data.total_count,
        })
    }

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label='Steri Item Name (e.g. Elevator or Restorative Kit)'
                control={control}
                name='name'
            />
            <TextInput
                label='Category'
                control={control}
                name='category'
            />
             <SwitchInput
                label='Keep track of count'
                control={control}
                name='is_count_enabled'
            />
            {is_count_enabled && <TextInput
                label='Total Count'
                type='number'
                control={control}
                name='total_count'
            />}
            <SwitchInput
                label='Item is active'
                control={control}
                name='is_active'
            />
            <Button type='submit'>Save Steri Item</Button>
        </form>
    )
}

export default SteriItemForm