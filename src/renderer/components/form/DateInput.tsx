import React, { DetailedHTMLProps, forwardRef, InputHTMLAttributes, MouseEventHandler } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useController } from 'react-hook-form';

interface CustomInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    value: string;
    label?: string;
    name: string;
    error?: string;
    onClick?: MouseEventHandler<HTMLInputElement>;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({ 
    label,
    name,
    error,
    onClick,
    ...props
 }, ref) => (
    <>
        <label
            htmlFor={name}
            className={[
                "block text-gray-700 text-sm font-bold mb-2",
                error && 'text-red-500'
            ].join(' ')}>
            {label}
        </label>
        <input
            {...props}
            ref={ref}
            onFocus={onClick ? () => onClick({} as any) : undefined}
            className={[
                "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                error && 'border-red-500',
            ].join(' ')}
            id={name} />
        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
    </>
));

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
            'w-full'
        ].join(' ')}>
            <DatePicker
                selected={field.value}
                onChange={field.onChange}
                customInput={<CustomInput
                    value={field.value}
                    name={name}
                    error={fieldState.error?.message}
                    {...props}
                />}
            />
        </div>
    )
}

export default DateInput