import { gql, useMutation, useSubscription } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import Button from '../components/Button';
import { QRType } from '../constants';
import { PatientSteriLabelFragment, PatientSteriLabelModel } from '../models/patient_steri_label.model';
import { UserModel } from '../models/user.model';
import { useDialog } from '../services/dialog.context';
import useScanner from '../services/use-scanner';
import UserPinDialog from './UserPinDialog';

export type OpLabelScannerProps = {
    patient_id: number;
    op_id: number;
}

const MutationAddItem = gql`
    mutation insert_item($object: patient_steri_label_insert_input!) {
        insert_patient_steri_label_one(object: $object, on_conflict: {
            constraint: patient_steri_label_pkey,
            update_columns: [deleted_at]
        }) {
            id
        }
    }
`;

const SubscribeItems = gql`
    subscription items($patient_id: bigint!, $start_date: timestamptz) {
        patient_steri_label(where: {
            _and: [
                {patient_id: {_eq: $patient_id}},
                {created_at: {_gt: $start_date}}
            ]
        }, order_by: {created_at: desc}) {
            ${PatientSteriLabelFragment}
        }
    }
`;

function OpLabelScanner({
    patient_id,
    op_id,
}: OpLabelScannerProps) {
    const start_date = useMemo(() => dayjs().startOf('d').toISOString(), [])
    const {
        data,
    } = useSubscription(SubscribeItems, {
        variables: {
            patient_id,
            start_date,
        }
    })
    const dialog = useDialog();
    const [user, setUser] = useState<UserModel | undefined>();
    const [show_pin, setShowPin] = useState(false);
    const [addItem] = useMutation(MutationAddItem)

    const onSetUser = (user: UserModel) => {
        setUser(user);
        setShowPin(false);
    }

    const onScan = async (data: {
        type: QRType;
        id: number;
    }) => {
        if (!user) {
            return;
        }
        if (data?.type === QRType.SteriLabel) {
            const { id } = data;
            // add this label to the load.
            try {
                const r = await addItem({
                    variables: {
                        object: {
                            patient_id,
                            op_id,
                            steri_label_id: id,
                            clinic_user_id: user.id,
                            deleted_at: null,
                        }
                    }
                })
            } catch (e) {
                dialog.showError(e)
            }
        }
    }

    useScanner({
        is_scanning: !!user,
        onScan: onScan
    })

    const items = (data?.patient_steri_label || []) as PatientSteriLabelModel[]

    return (
        <div className='py-4'>
            <UserPinDialog
                show={show_pin}
                onClose={() => setShowPin(false)}
                setUser={onSetUser} />

            {!user ? <Button className={`bg-green-200`} onClick={() => setShowPin(true)}>
                Start Scanning Items
            </Button> : <div className='flex flex-col items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
                <h2 className='text-md font-semibold'>Use the handheld scanner to scan all items going into the sterilizer.</h2>
            </div>}
            <div className='grid grid-cols-2 gap-4 mt-4'>
                {items.map((item) => <div
                    key={item.id}
                    className='bg-slate-200 rounded-xl p-2'>
                    <p className='text-sm'>#{item.steri_label.id} - {item.steri_label.steri_item.category}</p>
                    <p className='text-lg font-bold'>{item.steri_label.steri_item.name}</p>
                    <p className='text-sm font-semibold'>Used By: {item.clinic_user.name}</p>
                    <p className='text-sm'>Operatory: {item.op.name}</p>
                    <p className='text-sm'>Packed On: {dayjs(item.steri_label.created_at).format('YYYY-MM-DD HH:mm')}</p>
                </div>)
                }
            </div>
        </div>
    )
}

export default OpLabelScanner