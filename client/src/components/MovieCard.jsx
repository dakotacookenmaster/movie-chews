import React from "react"
import { 
    Card, 
    CardContent, 
    CardMedia, 
    Typography,
    Box,
    IconButton,
    Paper,
    Badge,
} from "@mui/material"

import { 
    FavoriteBorder,
    Favorite,
    Cancel,
    MoreHoriz,
} from "@mui/icons-material"

import NoImage from "../assets/no-image.png"

import { useTheme } from "@mui/material/styles"

const MovieCard = ({movie, position, likes, iLike, isMine, handleLike, handleRemove}) => {
    const theme = useTheme()
    return (
        <Card elevation={6} sx={{
                display: "flex", 
                flex: "1 0 auto",
                background: "#000000",
                position: "relative",
                maxWidth: "500px",
                width: "100%",
                maxHeight: "250px",
            }}>
            <Paper elevation={6} sx={{ 
                position: "absolute", 
                display: "flex", 
                m: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "100%",
                width: "40px", 
                height: "40px",
            }}>
                <Typography variant="h6">#{position}</Typography>
            </Paper>
            <CardMedia
                component="img"
                sx={{ width: 151, height: "fit-content", padding: `${movie.Poster === "N/A" ? "10px" : ""}`}}
                image={movie.Poster === "N/A" ? NoImage : movie.Poster}
                alt="Live from space album cover"
            />
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", overflow: "hidden" }}>
                <CardContent sx={{ flex: "1 1 auto"}}>
                    <Typography 
                        component="div" 
                        variant="h5"
                        sx={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}
                    >
                        { movie.Title }
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        color="text.secondary" 
                        component="div"
                    >
                        { movie.Year }
                    </Typography>
                </CardContent> 
                <Box sx={{
                    display: "flex", 
                    justifyContent: "space-between", 
                    pl: 1, 
                    pb: 1, 
                    pr: 1 
                }}>
                    { isMine && (
                        <IconButton 
                        aria-label="remove"
                        onClick={() => handleRemove(movie.imdbID)}
                        >
                            <Cancel 
                                sx={{ 
                                    height: 38, 
                                    width: 38, 
                                    color: theme.palette.warning.main 
                                }}
                            />
                        </IconButton>
                    )}
                    <IconButton 
                        aria-label="remove"
                    >
                        <MoreHoriz 
                            sx={{ 
                                height: 38, 
                                width: 38, 
                            }}
                        />
                    </IconButton>
                    <IconButton aria-label="like" onClick={() => handleLike(movie.imdbID, likes, iLike)}>
                        <Badge color="primary" badgeContent={likes} max={1000} overlap="circular">
                            {
                                iLike ? (
                                    <Favorite sx={{ height: 38, width: 38, color: theme.palette.warning.main }} />
                                ) : (
                                    <FavoriteBorder sx={{ height: 38, width: 38 }} />
                                )
                            }
                        </Badge>
                    </IconButton>
                </Box>
            </Box>
        </Card>
    )
}

export default MovieCard