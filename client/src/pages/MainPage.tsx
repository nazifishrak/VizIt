import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import {
  backgroundStyle,
  blackBoxStyle,
  goButtonStyle,
  textFieldStyle,
} from "../styles/commonStyles.ts";

const MainPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    if (prompt.toLowerCase() === "matrix multiplication") {
      setVideoUrl("../assets/MatrixMultiplication.mp4");
    } else {
      setVideoUrl(null);
      alert("No video available for the given prompt.");
    }
  };

  return (
    <Box sx={backgroundStyle(!!videoUrl)}>
      <Paper elevation={8} sx={blackBoxStyle(!!videoUrl)}>
        <Typography
          variant="h4"
          sx={{
            marginBottom: 3,
            fontWeight: "bold",
            color: "#ffffff",
            textShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
          }}
        >
          What do you want to get explained?
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={textFieldStyle}
          />
          <Button
            variant="contained"
            size="large"
            sx={goButtonStyle}
            onClick={handleSubmit}
          >
            <DoubleArrowIcon sx={{ color: "black" }} />
          </Button>
        </Box>
        {videoUrl && (
          <Box
            sx={{
              marginTop: 4,
              textAlign: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <video
              src={videoUrl}
              controls
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.8)",
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MainPage;
