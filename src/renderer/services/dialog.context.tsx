import React, { createContext, useContext, useState } from "react";
import ModalDialog, { DialogProps } from "../components/ModalDialog";
import { parseServerError } from "./parse-server-error";

export type ProvideDialogProps = {
    children?: React.ReactNode;
}

const DialogContext = createContext<{
    showDialog: (_: DialogProps) => void;
    showError: (error: any) => void;
}>({} as any);

export const ProvideDialog = ({
    children,
}: ProvideDialogProps) => {
    const [open, setOpen] = useState<DialogProps | false>(false)

    const showDialog = (dialog: DialogProps) => {
        setOpen(dialog);
    }

    const showError = (error: any) => {
        const { message } = parseServerError(error);
        setOpen({
            title: 'Error',
            message: message || 'Unknown error',
            buttons: [{
                children: 'Okay',
            }],
        })
    }

    return <DialogContext.Provider value={{
        showDialog,
        showError,
    }}>
        {open ? <ModalDialog
            dialog={open}
            onClose={() => setOpen(false)}
        /> : null}
        {children}
    </DialogContext.Provider>
}


export const useDialog = () => {
    return useContext(DialogContext);
}