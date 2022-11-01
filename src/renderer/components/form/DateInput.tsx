import React, { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';
import DatePicker from 'react-date-picker';
import { useController } from 'react-hook-form';

export interface DateInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    control: any;
    name: string;
    label?: string;
    disablePadding?: boolean;
}

function DateInput({
    control,
    name,
    ref,
    disablePadding,
    ...props
}: DateInputProps) {
    const {
        field, fieldState
    } = useController({
        control,
        name,
    })

    return (
        <div className={[
            disablePadding ? '' : 'mb-4',
            'w-full grid grid-cols-3 gap-4'
        ].join(' ')}>
            <DatePicker
            format='yyyy/MM/dd' onChange={field.onChange} value={field.value} />
        </div>
    )
}

export default DateInput