import React from 'react';
import Div100vh from 'react-div-100vh';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useClinic } from '../services/clinic.context';
import { useUser } from '../services/user.context';

const UserLayout = () => {
  const navigate = useNavigate();
  const {
    clinic,
  } = useClinic()
  const {
    user,
    endSession
  } = useUser()

  const endSessionRoute = () => {
    navigate('/')
    endSession();
  }

  return (
    <Div100vh>
      <div className='h-full flex flex-col overflow-hidden'>
        <header className='flex items-center p-4 shadow-lg border-b-2'>
          <div>ZenSteri</div>
          <div className='flex-1 text-center font-semibold'>{clinic.name}</div>
          <div>
            <Link to='/settings'>Settings</Link>
          </div>
          <div>
            <Button onClick={endSessionRoute}>End Session ({user.name})</Button>
          </div>
        </header>
        <div className='flex-1 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </Div100vh>
  );
}

export default UserLayout;
