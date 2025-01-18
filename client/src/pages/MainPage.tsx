import React from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import {
  backgroundStyle,
  blackBoxStyle,
  goButtonStyle,
  textFieldStyle,
} from "../styles/commonStyles.ts";

const MainPage: React.FC = () => {
  return (
    <Box sx={backgroundStyle}>
      <Paper elevation={8} sx={blackBoxStyle}>
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
            sx={textFieldStyle}
          />
          <Button variant="contained" size="large" sx={goButtonStyle}>
            <DoubleArrowIcon sx={{ color: "black" }} />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MainPage;
