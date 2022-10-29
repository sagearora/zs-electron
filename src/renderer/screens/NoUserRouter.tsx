import React from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { UserModel } from '../models/user.model'
import Layout from './Layout'
import NoUserScreen from './NoUserScreen'
import SettingsScreen from './SettingsScreen'
import UserCreateScreen from './UserCreateScreen'
import UserEditScreen from './UserEditScreen'
import UserListScreen from './UserListScreen'

export type NoUserRouterProps = {
    setUser: (user: UserModel) => void;
}

function NoUserRouter({ 
    setUser
}: NoUserRouterProps) {
    return (
        <HashRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/'>
                        <Route index element={<NoUserScreen setUser={setUser} />} />
                    </Route>
                    <Route path='/settings'>
                        <Route path='users'>
                            <Route path='create' element={<UserCreateScreen />} />
                            <Route path=':user_id/edit' element={<UserEditScreen />} />
                            <Route index element={<UserListScreen />} />
                        </Route>
                        <Route index element={<SettingsScreen />} />
                    </Route>
                    <Route path='*' element={<Navigate to='/' />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default NoUserRouter