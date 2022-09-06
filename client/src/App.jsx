import './App.css'
import { io } from "socket.io-client"
import { useEffect, useState } from 'react'
import logo from "./assets/logo-white-no-background.svg"
import LoginScreen from './components/LoginScreen'
import { useSnackbar } from 'notistack';
import MovieLoader from './components/MovieLoader'
import { Box } from '@mui/system'
import { CircularProgress } from '@mui/material'

const socket = io("http://10.14.2.11:3000", { 
    autoConnect: false,
    transports: ['websocket']
})

const App = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [username, setUsername] = useState("")
    const [isConnected, setIsConnected] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [connectedWithSession, setConnectedWithSession] = useState(false)

    useEffect(() => {
        // Connection Logic
        const sessionId = localStorage.getItem("sessionId")

        if(sessionId) {
            socket.auth = { sessionId }
            setIsConnecting(true)
            socket.connect()
        }

        socket.on("connect", () => {
            setIsConnected(true)
        })

        socket.on("session", (payload) => {
            const { sessionId, userId } = payload
            socket.auth = {...socket.auth, sessionId}
            socket.userId = userId
            
            localStorage.setItem("sessionId", sessionId)

            setIsConnecting(false)
            setConnectedWithSession(true)
        })

        socket.on("exception", (payload) => {
            enqueueSnackbar(payload.message, {
                variant: "error"
            })
        })

        socket.on("leave", (payload) => {
            setConnectedWithSession(false)
            localStorage.removeItem("sessionId")
            socket.disconnect()
        })

        socket.on("userJoined", (payload) => {
            enqueueSnackbar(payload, { variant: "info" })
        })

        socket.on("userLeft", (payload) => {
            enqueueSnackbar(payload, { variant: "info" })
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
            setConnectedWithSession(false)
            setIsConnecting(false)
        })

        // Teardown
        return () => {
            socket.off('connect')
            socket.off("disconnect")
            socket.off("exception")
            socket.off('movieUpdate')
        }
    }, [])

    return (
        <div style={{display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}>
            <img src={logo} alt="Movie Chews logo" width="400px" />
            { isConnecting && (
                <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                </Box>
            )}
            { !connectedWithSession && !isConnecting && (
                    <LoginScreen username={username} setUsername={setUsername} handleButton={() => {
                        socket.auth = { username }
                        setIsConnecting(true)
                        setTimeout(() => {}, 5000)
                        socket.connect()
                    }} />
            )}
            {
                isConnected && connectedWithSession && !isConnecting && (
                    <MovieLoader socket={socket} />
                )
            }
        </div>
    )
}

export default App
