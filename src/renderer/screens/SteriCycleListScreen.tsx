import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { LargeInt, PageLimit } from '../constants';
import { SteriCycleFragment, SteriCycleModel } from '../models/steri-cycle.model';
import { SteriCycleItem } from './SteriCycleItem';

export const QuerySteriCycleList = gql`
query list_steri_cycle($cursor: bigint!, $limit: Int!) { 
    steri_cycle(limit: $limit, where: {
        id: {_lt: $cursor}
    } order_by: {id: desc}) {
        ${SteriCycleFragment}
    }
}
`

function SteriCycleListScreen() {
    const [has_more, setHasMore] = useState(true);
    const {
        loading,
        data,
        fetchMore,
    } = useQuery(QuerySteriCycleList, {
        variables: {
            cursor: LargeInt,
            limit: PageLimit,
        },
        onCompleted: (d) => {
            setHasMore(d.steri_cycle?.length % PageLimit === 0);
        }
    })

    const cycles = (data?.steri_cycle || []) as SteriCycleModel[];

    const loadMore = () => {
        if (cycles.length > 0) {
            fetchMore({
                variables: {
                    cursor: cycles[cycles.length - 1].id,
                    limit: PageLimit,
                }
            })
        }
    }

    return (
        <div className='my-6 max-w-screen-md mx-auto container'>
            <div className='flex items-center mb-4'>
                <p className='ml-2 font-bold text-gray-500'>Cycles</p>
                <div className='flex-1' />
                <Link to='/cycles/create'>+ Start a Cycle</Link>
            </div>
            {cycles.map(cycle => <SteriCycleItem
                cycle={cycle}
                key={cycle.id}
            />)}
            {has_more ? <Button
                loading={loading} onClick={loadMore}>Fetch More</Button> : null}

        </div>
    )
}

export default SteriCycleListScreen