import { gql, useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Loading from '../components/Loading';
import NotFoundItem from '../components/NotFoundItem';
import { QRType } from '../constants';
import { SteriCycleFragment, SteriCycleModel } from '../models/steri-cycle.model';
import { UserModel } from '../models/user.model';
import { useClinic } from '../services/clinic.context';
import { useDialog } from '../services/dialog.context';
import useScanner from '../services/use-scanner';
import UserPinDialog from './UserPinDialog';

export const QuerySteriCycleByPk = gql`
    query steri_cycle($id: bigint!) {
        steri_cycle_by_pk(id: $id) {
            ${SteriCycleFragment}
        }
    }
`;

const MutationAddItem = gql`
    mutation insert_item($object: steri_cycle_item_insert_input!) {
        insert_steri_cycle_item_one(object: $object, on_conflict: {
            constraint: steri_cycle_item_pkey,
            update_columns: [deleted_at]
        }) {
            id
        }
    }
`;

function SteriCycleScreen() {
    const [user, setUser] = useState<UserModel | undefined>();
    const [is_cycle_failed, setIsCycleFailed] = useState(false);
    const [show_pin, setShowPin] = useState(false);
    const [notes, setNotes] = useState('');
    const cycle_id = useParams().cycle_id;
    const dialog = useDialog();
    const { clinic } = useClinic();
    const [addItem] = useMutation(MutationAddItem)

    const {
        data,
        loading,
        refetch,
    } = useQuery(QuerySteriCycleByPk, {
        variables: {
            id: cycle_id,
        }
    })

    const cycle = data?.steri_cycle_by_pk as SteriCycleModel;

    const onScan = async (data: {
        type: QRType;
        id: number;
    }) => {
        if (!user || !cycle) {
            return;
        }
        if (data?.type === QRType.SteriLabel) {
            const { id } = data;
            // add this label to the load.
            try {
                const r = await addItem({
                    variables: {
                        object: {
                            steri_cycle_id: cycle.id,
                            steri_label_id: id,
                            user_id: user.id,
                            deleted_at: null,
                        }
                    }
                })
                refetch();
            } catch (e) {
                dialog.showError(e)
            }
        }
    }

    const onSetUser = (user: UserModel) => {
        setUser(user);
        setShowPin(false);
    }

    useScanner({
        is_scanning: !!user,
        onScan: onScan
    })

    const [executeMutation, status] = useMutation(gql`
        mutation insert_steri_cycle($id: bigint!, $set: steri_cycle_set_input!) {
            update_steri_cycle_by_pk(
                pk_columns: {
                    id: $id
                }, _set: $set) {
                ${SteriCycleFragment}
            }
        }
    `);

    if (loading) {
        return <Loading />
    }

    if (!cycle) {
        return <NotFoundItem title='Sorry, this steri cycle was not found' />
    }

    const start = async () => {
        if (!user) {
            return;
        }
        try {
            const r = await executeMutation({
                variables: {
                    id: cycle.id,
                    set: {
                        start_at: 'now()',
                        started_by_user_id: user.id,
                    }
                }
            });
            setUser(undefined);
        } catch (e) {
            dialog.showError(e);
        }
    }

    const finish = async () => {
        if (!user) {
            return;
        }
        try {
            const r = await executeMutation({
                variables: {
                    id: cycle.id,
                    set: {
                        finish_at: 'now()',
                        finished_by_user_id: user.id,
                        is_cycle_failed,
                        notes,
                    }
                }
            });
            setUser(undefined);
        } catch (e) {
            dialog.showError(e);
        }
    }


    const undoFinish = async () => {
        try {
            const r = await executeMutation({
                variables: {
                    id: cycle.id,
                    set: {
                        finish_at: null,
                        finished_by_user_id: null,
                    },
                }
            });
        } catch (e) {
            dialog.showError(e);
        }
    }

    return (
        <div className='my-6 max-w-screen-md mx-auto container'>
            <BackButton href='/cycles' />
            <div className='mt-2 mb-4 flex items-start border-b-2 pb-4'>
                <div className='flex-1'>
                    <p className='text-sm text-gray-500'>{cycle.steri?.name}</p>
                    <p className='font-bold'>#{cycle.cycle_id}</p>
                    {cycle.finish_at ? <p className={`text-sm font-bold ${cycle.status === 'failed' ? 'bg-red-500' : 'bg-green-600'} text-white px-2 w-fit rounded-sm mb-1`}>{cycle.status === 'failed' ? 'Failed' : 'Passed'}</p> : null}
                    <p className='text-sm'>Start: {cycle.start_at ? `${dayjs(cycle.start_at).format('MM/DD/YYYY HH:mm')} - ${cycle.start_user?.name}` : 'Not Started'}</p>
                    <p className='text-sm'>Finish: {cycle.finish_at ? `${dayjs(cycle.finish_at).format('MM/DD/YYYY HH:mm')} - ${cycle.finish_user?.name}` : 'Not finished'}</p>
                    {cycle.notes ? <div className='my-2'>
                        <p className='text-sm text-gray-800 font-semibold'>Notes</p>
                        <p className='text-sm'>{cycle.notes}</p>
                    </div> : null}
                </div>
                <Link to='edit'>Edit</Link>
            </div>
            <div>
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
            </div>
            {/* {!cycle.start_at || !cycle.finish_at ?
                <div className='mb-4 bg-green-100 p-4 shadow-md rounded-md'>
                    <p className='text-center text-xl font-semibold'>
                        {!cycle.start_at ? 'Are you ready to Start?' : 'Are you ready to finish?'}
                    </p>
                    <UserPinControls
                        user={user}
                        setUser={setUser}
                    />
                    {!user ? null : <>
                        {!cycle.start_at ? <Button
                            color='orange'
                            fullWidth
                            onClick={start}
                            label='Start Cycle'
                        /> : <>
                            <div className='my-2 border-b-2 py-2 flex items-center'>
                                <div className='flex-1'>
                                    <p className='text-md font-bold'>Did the cycle fail?</p>
                                </div>
                                <Switch
                                    checked={is_cycle_failed}
                                    onChange={setIsCycleFailed}
                                    className={`${is_cycle_failed ? 'bg-orange-600' : 'bg-gray-200'
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                >
                                    <span className="sr-only">Spore Growth</span>
                                    <span
                                        className={`${is_cycle_failed ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white`}
                                    />
                                </Switch>
                            </div>
                            <textarea
                                placeholder='(Optional) Type any notes here like cycle failures or other issues...'
                                value={notes}
                                rows={4}
                                onChange={v => setNotes(v.target.value)}
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                            <Button
                                color='orange'
                                fullWidth
                                onClick={finish}
                                loading={status.loading}
                                label='Finish Cycle' />
                        </>}
                    </>}
                </div> : null
            } */}
            <div className='grid grid-cols-2 gap-4 mt-4'>
                {
                    (cycle.steri_cycle_items || []).map((item) => <div
                        key={item.id}
                        className='bg-slate-200 rounded-xl p-2'>
                        <p className='text-sm'>#{item.steri_label.id} - {item.steri_label.steri_item.category}</p>
                        <p className='text-lg font-bold'>{item.steri_label.steri_item.name}</p>
                        <p className='text-sm font-semibold'>{item.steri_label.clinic_user.name}</p>
                        <p className='text-sm'>Date: {dayjs(item.steri_label.created_at).format('YYYY-MM-DD HH:mm')}</p>
                        <p className='text-sm'>Exp: {dayjs(item.steri_label.expiry_at).format('YYYY-MM-DD HH:mm')}</p>
                    </div>)
                }
            </div>
            {!!cycle.finish_at && +new Date() - +new Date(cycle.finish_at) < 24 * 60 * 60 * 1000 ? <div>
                <p className='text-sm text-red-500 mb-2'>Made an error in recording your results?
                    Change results up to 24 hours after finishing the cycle.</p>
                <Button
                    onClick={undoFinish}
                >Change Results</Button>
            </div> : null}
        </div >
    )
}

export default SteriCycleScreen