import React from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardScreen from './DashboardScreen'
import LabelPrintScreen from './LabelPrintScreen'
import Layout from './Layout'
import SettingsScreen from './SettingsScreen'
import SteriCreateScreen from './SteriCreateScreen'
import SteriCycleEditScreen from './SteriCycleEditScreen'
import SteriCycleListScreen from './SteriCycleListScreen'
import SteriCycleScreen from './SteriCycleScreen'
import SteriCycleStartScreen from './SteriCycleStartScreen'
import SteriEditScreen from './SteriEditScreen'
import SteriListScreen from './SteriListScreen'
import UserCreateScreen from './UserCreateScreen'
import UserEditScreen from './UserEditScreen'
import UserListScreen from './UserListScreen'

function AppRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/'>
                        <Route index element={<DashboardScreen />} />
                    </Route>
                    <Route path='/printlabels' element={<LabelPrintScreen />} />
                    <Route path='/logs' element={<LabelPrintScreen />} />
                    <Route path='/patients' element={<LabelPrintScreen />} />
                    <Route path='/cycles'>
                        <Route path='create' element={<SteriCycleStartScreen />} />
                        <Route path=':cycle_id' element={<SteriCycleScreen />} />
                        <Route path=':cycle_id/edit' element={<SteriCycleEditScreen />} />
                        <Route index element={<SteriCycleListScreen />} />
                    </Route>
                    <Route path='/settings'>
                        <Route path='users'>
                            <Route path='create' element={<UserCreateScreen />} />
                            <Route path=':user_id/edit' element={<UserEditScreen />} />
                            <Route index element={<UserListScreen />} />
                        </Route>
                        <Route path='steri'>
                            <Route path='create' element={<SteriCreateScreen />} />
                            <Route path=':steri_id/edit' element={<SteriEditScreen />} />
                            <Route index element={<SteriListScreen />} />
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