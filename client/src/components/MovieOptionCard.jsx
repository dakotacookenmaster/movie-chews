import React from "react"
import { 
    Card, 
    CardContent, 
    CardMedia, 
    Typography,
    Box,
    IconButton,
} from "@mui/material"

import { 
    MoreHoriz,
    QueuePlayNext,
} from "@mui/icons-material"

import NoImage from "../assets/no-image.png"

const MovieOptionCard = ({movie, handleAdd}) => {
    return (
        <Card sx={{
            display: "flex", 
            flex: "0 0 auto", 
            background: "#000000",
            maxWidth: "500px",
            maxHeight: "250px",
        }}>
            <CardMedia
                component="img"
                sx={{ width: 151, height: "fit-content", padding: `${movie.Poster === "N/A" ? "10px" : ""}`}}
                image={movie.Poster === "N/A" ? NoImage : movie.Poster}
                alt={`${movie.Title} ${movie.Type} ${movie.Year} poster`}
            />
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", overflow: "hidden" }}>
                <CardContent sx={{ flex: "1 0 auto"}}>
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
                    <IconButton 
                        aria-label="more"
                    >
                        <MoreHoriz 
                            sx={{ 
                                height: 38, 
                                width: 38, 
                            }}
                        />
                    </IconButton>
                    <IconButton 
                        aria-label="add"
                        onClick={() => handleAdd(movie)}
                    >
                        <QueuePlayNext 
                            sx={{ 
                                height: 38, 
                                width: 38, 
                            }}
                        />
                    </IconButton>
                </Box>
            </Box>
        </Card>
    )
}

export default MovieOptionCard