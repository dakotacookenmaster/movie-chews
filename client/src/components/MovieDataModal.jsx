import { Chip, IconButton, Modal, Paper, Typography, useMediaQuery, useTheme } from "@mui/material"
import React from "react"
import { 
    Close,
    Stars,
    MovieFilter,
    Theaters,
    Workspaces,
} from "@mui/icons-material"
import NoImage from "../assets/no-image.png"

const MovieDataModal = ({movie, open, handleClose}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery("(max-width: 900px)")

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display: "flex", justifyContent: "center", overflow: "auto", maxHeight: "95vh", padding: isMobile ? "3vh" : "10vh"}}
        >
            <Paper elevation={9} sx={{ maxWidth: "1300px", width: "100%", height: "fit-content", background: "#000000", padding: theme.spacing(3) }}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Typography variant="h4">{ movie.Title }</Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </div>
                <hr />
                <div style={{display: "flex", flexDirection: isMobile ? "column" : "row", gap: theme.spacing(2)}}>
                    <img 
                        src={ movie.Poster === "N/A" ? NoImage : movie.Poster } 
                        alt={`${movie.Title} poster`}
                        style={{width: isMobile ? "200px" : "auto" }}
                    />
                    <div style={{display: "flex", flexDirection: "column", gap: theme.spacing(1) }}>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: theme.spacing(1)
                        }}>
                            <Chip
                                variant="outlined" 
                                size="medium" 
                                title="Release Year"
                                label={
                                    <Typography sx={{ fontSize: isMobile ? "1rem" : "auto" }} variant="h5">{ movie.Year }</Typography>
                                }
                            />
                            <Chip
                                title="Metascore"
                                label={<Typography 
                                        variant={"h5"}
                                        sx={{ 
                                            display: "flex",
                                            alignItems: "center",
                                            gap: theme.spacing(1),
                                            fontSize: isMobile ? "1rem" : "auto",
                                        }}
                                    >
                                        <Stars />
                                        { movie.Metascore }
                                    </Typography>
                                }
                            >
                            </Chip>
                            <Chip
                                title="IMDb Rating" 
                                color="primary"
                                label={<Typography 
                                        variant="h5"
                                        sx={{ 
                                            display: "flex",
                                            alignItems: "center",
                                            gap: theme.spacing(1),
                                            fontSize: isMobile ? "1rem" : "auto",
                                        }}
                                    >
                                        <MovieFilter />
                                        { movie.imdbRating }
                                    </Typography>
                                }
                                variant="outlined"
                            />
                            <Chip
                                title="Rated" 
                                color="secondary"
                                label={<Typography 
                                        variant="h5"
                                        sx={{ 
                                            display: "flex",
                                            alignItems: "center",
                                            gap: theme.spacing(1),
                                            fontSize: isMobile ? "1rem" : "auto",
                                        }}
                                    >
                                        <Theaters />
                                        { movie.Rated }
                                    </Typography>
                                }
                                variant="outlined"
                            />
                            <Chip
                                title="Genre"
                                color={"warning"}
                                label={<Typography 
                                        variant="h5"
                                        sx={{ 
                                            display: "flex",
                                            alignItems: "center",
                                            gap: theme.spacing(1),
                                            fontSize: isMobile ? "1rem" : "auto",
                                        }}
                                    >
                                        <Workspaces />
                                        { movie.Genre }
                                    </Typography>
                                }
                                variant="filled"
                            />
                        </div>
                        <Typography sx={{fontSize: isMobile ? "1rem" : "1.3rem"}} variant="body1">{ movie.Plot }</Typography>
                        <div style={{display: "flex", gap: theme.spacing(1)}}>
                            <Typography variant="caption" sx={{ 
                                textTransform: "uppercase",
                                color: "gray",
                                fontSize: "1rem"
                            }}>Directed by</Typography>
                            <Typography variant="caption" sx={{
                                fontSize: "1rem"
                            }}>
                                { movie.Director }
                            </Typography>
                        </div>
                        <div style={{display: "flex", gap: theme.spacing(1)}}>
                            <Typography variant="caption" sx={{ 
                                textTransform: "uppercase",
                                color: "gray",
                                fontSize: "1rem"
                            }}>Actors </Typography>
                            <Typography variant="caption" sx={{
                                fontSize: "1rem"
                            }}>
                                { movie.Actors }
                            </Typography>
                        </div>
                        <div style={{display: "flex", gap: theme.spacing(1)}}>
                            <Typography variant="caption" sx={{ 
                                textTransform: "uppercase",
                                color: "gray",
                                fontSize: "1rem"
                            }}>Released</Typography>
                            <Typography variant="caption" sx={{
                                fontSize: "1rem"
                            }}>
                                { movie.Released }
                            </Typography>
                        </div>
                        <div style={{display: "flex", gap: theme.spacing(1)}}>
                            <Typography variant="caption" sx={{ 
                                textTransform: "uppercase",
                                color: "gray",
                                fontSize: "1rem"
                            }}>Runtime </Typography>
                            <Typography variant="caption" sx={{
                                fontSize: "1rem"
                            }}>
                                { movie.Runtime }
                            </Typography>
                        </div>
                        <div style={{display: "flex", gap: theme.spacing(1)}}>
                            <Typography variant="caption" sx={{ 
                                textTransform: "uppercase",
                                color: "gray",
                                fontSize: "1rem"
                            }}>Language </Typography>
                            <Typography variant="caption" sx={{
                                fontSize: "1rem"
                            }}>
                                { movie.Language }
                            </Typography>
                        </div>
                    </div>
                </div>
            </Paper>
        </Modal>
    )
}

export default MovieDataModal