import { Button, OutlinedInput, useTheme, useMediaQuery } from "@mui/material"
import React from "react"

const LoginScreen = ({ username, setUsername, handleButton }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery("(max-width: 600px)")
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: theme.spacing(1)
            }}>
            <div style={{display: "flex", width: isMobile ? "95%" : "500px", gap: theme.spacing(1), marginTop: theme.spacing(1) }}>
                <OutlinedInput 
                    type="text"
                    placeholder="Enter a display name..."
                    sx={{width: "100%"}}
                    value={username}
                    onChange={(event) => {
                        const { value } = event.target
                        setUsername(value)
                    }}
                />
                <Button variant="contained" onClick={handleButton}>Join</Button>
            </div>
        </div>
    )
}

export default LoginScreen