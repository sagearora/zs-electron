import { gql, useSubscription } from '@apollo/client'
import React from 'react'
import { SteriItemFragment, SteriItemModel } from '../models/steri-item.model';

const SubCheckedOut = gql`
  subscription checked_out {
    steri_item(where: {
      total_checked_out: {_gt: 0}
    }) {
      ${SteriItemFragment}
    }
  }
`;

function CheckedOut() {
  const {
    data,
    loading,
  } = useSubscription(SubCheckedOut)

  const items = (data?.steri_item || []) as SteriItemModel[]

  return (
    <div className='py-6'>
      <p className='text-md font-semibold text-center mb-2'>What's checked out?</p>
      <div className='grid grid-cols-4 gap-2'>
        {items.map(item => <div key={item.id} className='bg-slate-200 rounded-xl flex flex-col items-center p-4'>
          <p className='text-2xl'>{item.total_checked_out}/{item.total_count}</p>
          <p className='text-lg font-bold'>{item.name}</p>
          <p className='text-sm text-gray-800'>{item.category}</p>
        </div>)}
      </div>
    </div>
  )
}

export default CheckedOut