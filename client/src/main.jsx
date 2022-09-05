import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, ThemeProvider } from '@mui/material'
import { ConfirmProvider } from "material-ui-confirm"
import { SnackbarProvider } from 'notistack'

const theme = createTheme({
    palette: {
        mode: "dark",
        warning: {
            main: "#F47174"
        }
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
                <ConfirmProvider>
                    <SnackbarProvider maxSnack={3}>
                        <CssBaseline enableColorScheme />
                        <App />
                    </SnackbarProvider>
                </ConfirmProvider>
        </ThemeProvider>
    </React.StrictMode>
)
