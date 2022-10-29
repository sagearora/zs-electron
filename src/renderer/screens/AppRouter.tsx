import React from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardScreen from './DashboardScreen'
import LabelPrintScreen from './LabelPrintScreen'
import SettingsScreen from './SettingsScreen'
import UserCreateScreen from './UserCreateScreen'
import UserEditScreen from './UserEditScreen'
import UserLayout from './UserLayout'
import UserListScreen from './UserListScreen'

function AppRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path='/'>
                        <Route index element={<DashboardScreen />} />
                    </Route>
                    <Route path='/labelprint' element={<LabelPrintScreen />} />
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

export default AppRouter