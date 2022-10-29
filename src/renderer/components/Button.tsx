import React, { ReactNode } from 'react'

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children: ReactNode;
    loading?: boolean;
}

function Button({
    children,
    loading,
    ...props
}: ButtonProps) {
    return (
        <button {...props} className='py-2 w-full bg-slate-200 px-4 rounded-xl font-semibold uppercase hover:bg-orange-200'>
            {children}
        </button>
    )
}

export default Button