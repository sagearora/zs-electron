import { gql, useApolloClient, useMutation, useSubscription } from '@apollo/client';
import React, { useState } from 'react';
import SteriLabel from '../../components/SteriLabel';
import { QRType } from '../../constants';
import Button from '../../lib/Button';
import { useDialog } from '../../lib/dialog.context';
import Loading from '../../lib/Loading';
import { SteriStatus } from '../../models/steri-cycle.model';
import { SteriItemFragment } from '../../models/steri-item.model';
import { SteriLabelFragment, SteriLabelModel } from '../../models/steri-label.model';
import { UserModel } from '../../models/user.model';
import useScanner from '../../services/use-scanner';
import UserPinDialog from '../UserPinDialog';

export type OpLabelScannerProps = {
    appointment_id: number;
    patient_name: string;
}

const MutationUpdateSteriLabel = gql`
    mutation update_steri_label($id: bigint!, $steri_item_id: bigint!, $inc_by: Int!, $set: steri_label_set_input!) {
        update_steri_label_by_pk(pk_columns: {id: $id}, _set: $set) {
            ${SteriLabelFragment}
        }
        update_steri_item_by_pk(
            pk_columns: {id: $steri_item_id}, 
            _inc: {total_checked_out: $inc_by}
        ) {
            ${SteriItemFragment}
        }
    }
`;

const SubscribeItems = gql`
    subscription items($appointment_id: bigint!) {
        steri_label(where: {
            appointment_id: {_eq: $appointment_id}
        }, order_by: {checkout_at: desc}) {
            ${SteriLabelFragment}
        }
    }
`;

function AppointmentItemScanner({
    appointment_id,
    patient_name,
}: OpLabelScannerProps) {
    const {
        data,
        loading,
    } = useSubscription(SubscribeItems, {
        variables: {
            appointment_id,
        }
    })
    const apollo = useApolloClient();
    const dialog = useDialog();
    const [user, setUser] = useState<UserModel | undefined>();
    const [show_pin, setShowPin] = useState(false);
    const [updateLabel] = useMutation(MutationUpdateSteriLabel)
    const [loading_label, setLoadingLabel] = useState<{ [id: number]: boolean }>({});

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
                const { data: steri_label_data } = await apollo.query({
                    query: gql`query steri_label($id: bigint!) {
                        steri_label_by_pk(id: $id) {
                            id
                            steri_item_id
                            steri_cycle {
                                id
                                cycle_id
                                status
                            }
                            appointment_id
                        }
                    }`,
                    variables: {
                        id,
                    }
                })
                const steri_label = steri_label_data?.steri_label_by_pk;
                if (!steri_label) {
                    dialog.showSimpleDialog('Invalid Label', 'Sorry this item could not be found. You will have to re-sterilize this package.')
                    return;
                }
                if (!steri_label.steri_cycle || steri_label.steri_cycle.status as SteriStatus !== 'finished') {
                    dialog.showSimpleDialog('Not Sterilized', `This item does not have a successful sterilization record. Please re-sterilize.`)
                    return;
                }
                if (steri_label.appointment_id) {
                    dialog.showSimpleDialog('Already Used', `This item has been checked out before for an appointment. Please re-sterilize.`)
                    return;
                }
                const { data } = await updateLabel({
                    variables: {
                        id,
                        steri_item_id: steri_label.steri_item_id,
                        inc_by: 1,
                        set: {
                            appointment_id,
                            appointment_user_id: user.id,
                            checkout_at: 'now()'
                        }
                    }
                })
                const item = data?.update_steri_label_by_pk as SteriLabelModel;
                if (!item) {
                    dialog.showToast({
                        message: `Failed to add item`,
                        type: 'error',
                    });
                    return;
                }
                dialog.showToast({
                    message: `Added ${item.steri_item.name} to ${patient_name}`,
                    type: "success",
                });
            } catch (e) {
                dialog.showError(e)
            }
        }
    }

    useScanner({
        is_scanning: !!user,
        onScan: onScan
    })

    const items = (data?.steri_label || []) as SteriLabelModel[]


    const removeLabel = async (steri_label: SteriLabelModel) => {
        setLoadingLabel(l => ({
            ...l,
            [steri_label.id]: true,
        }))
        try {
            await updateLabel({
                variables: {
                    id: steri_label.id,
                    steri_item_id: steri_label.steri_item_id,
                    inc_by: -1,
                    set: {
                        appointment_id: null,
                        appointment_user_id: null,
                        checkout_at: null,
                    }
                }
            })
        } catch (e) {
            dialog.showError(e)
        } finally {
            setLoadingLabel(l => ({
                ...l,
                [steri_label.id]: false,
            }))
        }
    }

    return (
        <div className='py-4'>
            <UserPinDialog
                show={show_pin}
                onClose={() => setShowPin(false)}
                setUser={onSetUser} />

            {!user ? <Button className={`bg-green-200`} onClick={() => setShowPin(true)}>
                <div className='flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                    </svg>
                    Scan Items Out For Appointment
                </div>
            </Button> : <div className='flex flex-col items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
                <h2 className='text-md font-semibold'>Use the handheld scanner to scan all items needed for this appointment.</h2>
                <Button onClick={() => setUser(undefined)}>End Scanning</Button>
            </div>}
            {loading && <Loading />}
            <div className='grid grid-cols-2 gap-4 mt-4'>
                {items.map((item) => <SteriLabel
                    item={item}
                    loading={loading_label[item.id]}
                    remove={() => removeLabel(item)}
                    key={item.id} />)
                }
            </div>
        </div>
    )
}

export default AppointmentItemScanner