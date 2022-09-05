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
} from "@mui/icons-material"
import { debounce } from "lodash"
import MovieOptionCard from "./MovieOptionCard"
import MovieCard from "./MovieCard"
import { useConfirm } from "material-ui-confirm"
import { useSnackbar } from "notistack"

const MovieLoader = ({ socket }) => {
    const confirm = useConfirm()
    const theme = useTheme()
    const [movies, setMovies] = useState([])
    const [data, setData] = useState([])
    const isMobile = useMediaQuery("(max-width: 800px)")
    const { enqueueSnackbar } = useSnackbar();

    const handleSearch = (event) => {
        const { value } = event.target
        socket.emit("search", {"search": value }, (data) => {
            if(data.Response === "True") {
                setData(data.Search)
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
            console.log(response)
            enqueueSnackbar(response, { variant: "success" })
        })
    }
    
    const handleLeave = () => {
        socket.emit("leave")
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
                console.log(response)
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
                <Button variant="contained" onClick={handleLeave} sx={{ml: theme.spacing(1)}}>Leave</Button>
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
                                    data.filter(datum => datum.Type === "movie").map((datum, index) => {
                                        return (
                                            <MovieOptionCard
                                                key={datum.imdbID}
                                                movie={datum}
                                                handleAdd={handleAdd}
                                            />
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
                                        return <MovieCard 
                                            key={movie.imdbID} 
                                            movie={movie}
                                            iLike={movie.likes.includes(socket.userId) }
                                            likes={movie.likes.length}
                                            isMine={movie.addedBy === socket.userId}
                                            position={index + 1}
                                            handleLike={handleLike}
                                            handleRemove={handleRemove}
                                        />
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