import React, { createContext, useContext, useState } from "react";
import { UserModel } from "../models/user.model";
import NoUserRouter from "../screens/NoUserRouter";

const UserContext = createContext<{
    user: UserModel
    endSession: () => void;
}>({} as any);

export type ProvideUserProps = {
    children?: React.ReactNode
}

export const ProvideUser = ({
    children,    
}: ProvideUserProps) => {
    const saved_user = localStorage.getItem('user')
    const [user, _setUser] = useState<UserModel|undefined>(saved_user ? JSON.parse(saved_user) : undefined);

    const setUser = (user?: UserModel) => {
        _setUser(user);
        localStorage.setItem('user', user ? JSON.stringify(user) : null)
    }

    if (!user) {
        return <NoUserRouter setUser={setUser} />
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