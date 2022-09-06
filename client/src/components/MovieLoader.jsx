import { React, useState, useEffect } from "react"
import { 
    OutlinedInput, 
    useTheme, 
    InputAdornment,
    IconButton,
    Typography,
    Button,
    useMediaQuery
} from "@mui/material"
import { 
    Slideshow,
    Cancel,
    HeartBroken,
    Logout
} from "@mui/icons-material"
import { debounce } from "lodash"
import MovieOptionCard from "./MovieOptionCard"
import MovieCard from "./MovieCard"
import { useConfirm } from "material-ui-confirm"
import { useSnackbar } from "notistack"
import MovieDataModal from "./MovieDataModal"

const MovieLoader = ({ socket }) => {
    const confirm = useConfirm()
    const theme = useTheme()
    const [movies, setMovies] = useState([])
    const [data, setData] = useState([])
    const isMobile = useMediaQuery("(max-width: 800px)")
    const { enqueueSnackbar } = useSnackbar()
    const [openModal, setOpenModal] = useState(null)

    const handleSearch = (event) => {
        const { value } = event.target
        socket.emit("search", {"search": value }, (data) => {
            if(data) {
                const movieIds = movies.map(movie => movie.imdbID)
                data = data.filter(datum => !movieIds.includes(datum.imdbID)).filter(datum => datum.Type === "movie")
                setData(data)
            }
        })
    }

    const findAllMovies = () => {
        socket.emit("findAllMovie", (data) => {
          setMovies(data)
        })
    }

    const handleAdd = (movie) => {
        socket.emit("createMovie", movie, (response) => {
            setData(prevData => prevData.filter(prevData => prevData.imdbID !== movie.imdbID))
            enqueueSnackbar(response, { variant: "success" })
        })
    }
    
    const handleLeave = async () => {
        try {
            await confirm({
                title: <Typography variant="h5" sx={{ display: "flex", gap: theme.spacing(1), alignItems: "center" }}>Leave the room? <Logout sx={{color: theme.palette.warning.main }}/></Typography>,
                description: "If you leave, all of your selections will be removed."
            })
            socket.emit("leave")
        } catch(error) {}
    }

    const handleRemove = async (imdbID) => {
        try {
            await confirm({
                title: <Typography
                    variant="h5"
                    component="div"
                    sx={{ display: "flex", alignItems: "center", gap: theme.spacing(1) }}
                >
                    Remove?
                    <Cancel sx={{color: theme.palette.warning.main }} />
                </Typography>,
                description: "This action is permanent and cannot be undone."
            })
            socket.emit("removeMovie", { "imdbID": imdbID}, (response) => {
                enqueueSnackbar(response, { variant: "info" })
            })
        } catch(error) {}
    }

    const handleLike = async (imdbID, movieLikes, iLike) => {
        if(movieLikes === 1 && iLike) {
            try {
                await confirm({
                    title: <Typography 
                        variant="h5"
                        component="div"
                        sx={{display: "flex", alignItems: "center", gap: theme.spacing(1) }}
                    >
                        Dislike? 
                        <HeartBroken sx={{color: theme.palette.warning.main }} />
                    </Typography>,
                    description: "Are you sure you want to dislike this? If you do, the card will be permanently removed."
                })
                socket.emit("like", { "imdbID": imdbID }, (response) => {

                })
            } catch(error) {}
        } else {
            socket.emit("like", { "imdbID": imdbID }, (response) => {
            })
        }
    }

    useEffect(() => {
        findAllMovies()

        socket.on('movieUpdate', (payload) => {
            setMovies(payload)
        })

        // socket

    }, [])

    return (
        <>
            <div style={{ marginTop: theme.spacing(1), display: "flex"}}>
                <OutlinedInput 
                    type="text" 
                    name="movie"
                    id="searchInput"
                    onChange={debounce((event) => handleSearch(event), 200)}
                    placeholder="Search movies..."
                    sx={{width: "100%"}}
                    autoComplete="off"
                    startAdornment={
                        <InputAdornment position="start">
                            <Slideshow />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={() => {
                                document.getElementById("searchInput").value = ""
                                setData([]) 
                            }}>
                                <Cancel />
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <Button variant="contained" onClick={handleLeave} sx={{ml: theme.spacing(1)}}>Leave<Logout sx={{ml: theme.spacing(1)}} /></Button>
            </div>
            <div style={{ width: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", gap: theme.spacing(1), justifyContent: "center" }}>
                { data.length ? (
                    <div style={{width: "100%", display: "flex", justifyContent: isMobile || !movies.length ? "center" : "right"}}>
                        <div style={{width: "100%", maxWidth: "500px"}}>
                            <Typography variant="h5" sx={{mt: theme.spacing(2)}}>Search Queue</Typography>
                            <div style={{ 
                                display: "flex", 
                                width: "100%",
                                flexDirection: "column", 
                                gap: theme.spacing(1),
                                marginTop: theme.spacing(1),
                                maxHeight: isMobile ? "100%" : "calc(100vh - 270px)",
                                overflow: "auto",
                            }}>
                                { 
                                    data.map((datum, index) => {
                                        return (
                                            <div key={datum.imdbID}>
                                                <MovieOptionCard
                                                    movie={datum}
                                                    handleAdd={handleAdd}
                                                    openModal={() => setOpenModal(datum.imdbID)}
                                                />
                                                <MovieDataModal 
                                                    movie={datum}
                                                    open={openModal === datum.imdbID}
                                                    handleClose={() => setOpenModal(null)}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                { movies.length ? (
                    <div style={{width: "100%", display: "flex", justifyContent: isMobile || !data.length ? "center" : "left"}}>
                        <div style={{width: "100%", maxWidth: "500px"}}>
                            <Typography variant="h5" sx={{mt: theme.spacing(2)}}>Movie Queue</Typography>
                            <div style={{ 
                                display: "flex", 
                                width: "100%",
                                flexDirection: "column", 
                                gap: theme.spacing(1),
                                marginTop: theme.spacing(1),
                                maxHeight: isMobile ? "100%" : "calc(100vh - 270px)",
                                overflow: "auto",
                            }}>
                                { 
                                    movies.map((movie, index) => {
                                        return (
                                            <>
                                                <MovieCard 
                                                    key={movie.imdbID} 
                                                    movie={movie}
                                                    iLike={movie.likes.includes(socket.userId) }
                                                    likes={movie.likes.length}
                                                    isMine={movie.addedBy === socket.userId}
                                                    position={index + 1}
                                                    handleLike={handleLike}
                                                    handleRemove={handleRemove}
                                                    openModal={() => setOpenModal(movie.imdbID)}
                                                />
                                                <MovieDataModal 
                                                    movie={movie}
                                                    open={openModal === movie.imdbID}
                                                    handleClose={() => setOpenModal(null)}
                                                />
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default MovieLoader