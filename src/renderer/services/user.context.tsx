import React, { createContext, useContext, useEffect, useState } from "react";
import { UserModel } from "../models/user.model";
import NoUserScreen from "../screens/NoUserScreen";
import { useDialog } from "../lib/dialog.context";

const UserContext = createContext<{
    user: UserModel
    endSession: () => void;
}>({} as any);

export type ProvideUserProps = {
    children?: React.ReactNode;
    adminRequired?: boolean;
}

export const ProvideUser = ({
    children,    
    adminRequired,
}: ProvideUserProps) => {
    const saved_user = localStorage.getItem('user')
    const dialog = useDialog();
    const [user, _setUser] = useState<UserModel|undefined>();

    useEffect(() => {
        const saved = saved_user ? JSON.parse(saved_user) as UserModel : undefined
        if (!saved) {
            return
        }
        _setUser(!adminRequired || saved.is_admin ? saved : undefined)
    }, [adminRequired])

    const setUser = (user?: UserModel) => {
        if (!!user && adminRequired && !user.is_admin) {
            dialog.showDialog({
                title: 'Not Authorized',
                message: 'Sorry, only an admin can access this page.',
                buttons: [{children: 'Okay'}],
            })
            localStorage.setItem('user', null)
            return;
        } 
        _setUser(user);
        localStorage.setItem('user', user ? JSON.stringify(user) : null)
    }

    if (!user) {
        return <NoUserScreen setUser={setUser} />
    }

    return <UserContext.Provider value={{
        user,
        endSession: () => setUser(undefined)
    }}>
        {children}
    </UserContext.Provider>
}

export const useUser = () => {
    return useContext(UserContext);
}