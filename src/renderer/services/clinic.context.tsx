import { gql, useSubscription } from "@apollo/client";
import React, { createContext, ReactNode, useContext } from "react";
import { ClinicFragment, ClinicModel } from "../models/clinic.model";

const ClinicContext = createContext<{
    clinic: ClinicModel
}>({} as any);

export type ProvideClinicProps = {
    LoadingScreen: ReactNode;
    children?: React.ReactNode
}

const SubscriptionClinic = gql`
    subscription clinic {
        clinic {
            ${ClinicFragment}
        }
    }
`;

export const ProvideClinic = ({
    children,
    LoadingScreen
}: ProvideClinicProps) => {
    const { data, loading } = useSubscription(SubscriptionClinic);
    const clinics = (data?.clinic || []) as ClinicModel[];


    if (loading) {
        return <>{LoadingScreen}</>
    }

    if (clinics.length === 0) {
        return null;
    }

    const clinic = clinics[0];
    return <ClinicContext.Provider value={{
        clinic,
    }}>
        {children}
    </ClinicContext.Provider>
}

export const useClinic = () => {
    return useContext(ClinicContext);
}