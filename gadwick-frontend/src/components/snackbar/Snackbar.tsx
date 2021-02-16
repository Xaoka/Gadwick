import { Snackbar } from "@material-ui/core";
import { useSnackbarMessages } from "./SnackbarContext";
import React from "react";
import Alert from '@material-ui/lab/Alert';


/** Snackbar message which uses the snackbar context api */
const SnackbarComponent = () => {
    const { isSnackbarOpen, closeSnackbar, snackbarMessage } = useSnackbarMessages()!;

    return <Snackbar open={isSnackbarOpen} onClose={closeSnackbar} data-component-name={`snackbar-${snackbarMessage?.status}`}
        autoHideDuration={3500} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={closeSnackbar} severity={snackbarMessage?.status || undefined} >
            {snackbarMessage?.message || ""}
        </Alert>
    </Snackbar>;
};

export default SnackbarComponent;