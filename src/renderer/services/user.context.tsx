import React, { createContext, useContext, useEffect, useState } from "react";
import { UserModel } from "../models/user.model";
import NoUserScreen from "../screens/NoUserScreen";
import { useDialog } from "../lib/dialog.context";
import dayjs from "dayjs";

const UserContext = createContext<{
    user: UserModel;
    expiry: Date;
    endSession: () => void;
}>({} as any);

export type ProvideUserProps = {
    children?: React.ReactNode;
    adminRequired?: boolean;
}

const ExpirySeconds = 60 * 10 // 10 minutes

export const ProvideUser = ({
    children,
    adminRequired,
}: ProvideUserProps) => {
    const dialog = useDialog();
    const [expiry, setExpiry] = useState<Date>()
    const [user, _setUser] = useState<UserModel | undefined>();

    useEffect(() => {
        const saved_user = localStorage.getItem('user')
        const saved = saved_user ? JSON.parse(saved_user) as {
            expiry: string;
            user: UserModel
        } : undefined
        if (!saved || !saved.user || dayjs().isAfter(dayjs(saved.expiry))) {
            return
        }
        if (adminRequired && !saved.user.is_admin) {
            return
        }
        _setUser(saved.user)
        setExpiry(new Date(saved.expiry))
    }, [adminRequired])

    const setUser = (user?: UserModel) => {
        if (!!user && adminRequired && !user.is_admin) {
            dialog.showSimpleDialog('Admin Required', 'Only an admin user can access this section of the app.')
            return;
        }
        _setUser(user);
        const expiry = dayjs().add(ExpirySeconds, 'seconds').toDate()
        setExpiry(expiry)
        localStorage.setItem('user', user ? JSON.stringify({
            expiry: expiry.toISOString(),
            user
        }) : null)
    }

    if (!user) {
        return <NoUserScreen setUser={setUser} />
    }

    return <UserContext.Provider value={{
        user,
        expiry,
        endSession: () => setUser(undefined)
    }}>
        {children}
    </UserContext.Provider>
}

export const useUser = () => {
    return useContext(UserContext);
}