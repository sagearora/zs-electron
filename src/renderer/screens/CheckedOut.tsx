import React from 'react'

function CheckedOut() {
  return (
    <div className='py-4'>
        <p className='text-md font-semibold text-center'>What's checked out?</p>
        <div className='bg-slate-100 rounded-xl p-2 my-2'>
            <p className='text-md font-bold'>Op 1</p>
            <div className='border-b-2 py-2'>
                <p className='text-md font-bold'>Restorative Kit</p>
                <p className='text-sm text-gray-800'>Out By: Lyneigha Grummett</p>
                <p className='text-sm text-gray-800'>When: Oct 12th 7:09 PM</p>
            </div>
            <div className='border-b-2 py-2'>
                <p className='text-md font-bold'>Restorative Kit</p>
                <p className='text-sm text-gray-800'>Out By: Lyneigha Grummett</p>
                <p className='text-sm text-gray-800'>When: Oct 12th 7:09 PM</p>
            </div>
        </div>
    </div>
  )
}

export default CheckedOut