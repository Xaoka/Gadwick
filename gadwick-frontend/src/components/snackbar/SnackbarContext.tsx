import React, { createContext, useContext, useState, FunctionComponent } from "react";
import SnackbarComponent from "./Snackbar";

export interface ISnackbarContext {
    isSnackbarOpen: boolean;
    snackbarMessage: ISnackbarMessage | undefined;
    sendSnackbarMessage: (message: string, status: SnackbarMessageStatus) => void;
    closeSnackbar: () => void;
}
type SnackbarMessageStatus = "success" | "info" | "warning" | "error" | undefined;

interface ISnackbarMessage {
    message: string;
    status: SnackbarMessageStatus;
}
/**Creates the snackbar context */
export const SnackbarContext = createContext<ISnackbarContext | undefined>(undefined);

/**Hook for using the snackbar message */
export const useSnackbarMessages = () => useContext(SnackbarContext);

/**Snackbar provider which handles messaging within the app */
export const SnackbarProvider: FunctionComponent<{}> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<ISnackbarMessage | undefined>();

    const onCloseSnackbar = () => {
        setIsOpen(false);
    };
    const onSendSnackbarMessage = async (message: string, status: SnackbarMessageStatus) => {
        if (isOpen) {
            await setIsOpen(false);
        }
        await setMessage({ message, status });
        await setIsOpen(true);
    };
    return <SnackbarContext.Provider
        value={{
            isSnackbarOpen: isOpen,
            snackbarMessage: message,
            sendSnackbarMessage: onSendSnackbarMessage,
            closeSnackbar: onCloseSnackbar
        }}>
        <SnackbarComponent />
        {children}
    </SnackbarContext.Provider>;
};