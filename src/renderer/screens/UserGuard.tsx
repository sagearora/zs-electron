import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProvideUser } from '../services/user.context';
import UserHeader from './UserHeader';

export type UserGuardProps = {
  adminRequired?: boolean;
}

const UserGuard = ({
  adminRequired,
}: UserGuardProps) => {

  return (
    <ProvideUser adminRequired={adminRequired}>
      <UserHeader />
      <Outlet />
    </ProvideUser>
  );
}

export default UserGuard;
