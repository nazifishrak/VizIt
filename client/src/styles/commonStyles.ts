import { CSSObject } from "@emotion/react";

export const goButtonStyle: CSSObject = {
  background: "linear-gradient(45deg, #1a73e8, #2575fc)",
  color: "#fff",
  fontWeight: "bold",
  padding: "12px 25px",
  borderRadius: "50px",
  boxShadow: "0px 8px 20px rgba(26, 115, 232, 0.5)",
  textTransform: "uppercase",
  transition: "all 0.3s ease",
  animation: "flashing 2s infinite",
  "&:hover": {
    background: "linear-gradient(45deg, #1765c0, #1a73e8)",
    boxShadow: "0px 10px 25px rgba(26, 115, 232, 0.8)",
  },
  "&:active": {
    boxShadow: "0px 5px 15px rgba(26, 115, 232, 0.6)",
  },
  "@keyframes flashing": {
    "0%": {
      background: "linear-gradient(45deg, #1a73e8, #2575fc)",
      boxShadow: "0px 8px 20px rgba(26, 115, 232, 0.5)",
    },
    "50%": {
      background: "linear-gradient(45deg, #2575fc, #1a73e8)",
      boxShadow: "0px 8px 30px rgba(26, 115, 232, 0.7)",
    },
    "100%": {
      background: "linear-gradient(45deg, #1a73e8, #2575fc)",
      boxShadow: "0px 8px 20px rgba(26, 115, 232, 0.5)",
    },
  },
};

export const textFieldStyle: CSSObject = {
  width: "100%",
  backgroundColor: "#1e1e2f",
  borderRadius: "8px",
  color: "#fff",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.6)",
  input: {
    color: "#fff",
    padding: "12px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#444",
      borderRadius: "8px",
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: "#888",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1a73e8",
      boxShadow: "0px 0px 10px #1a73e8",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#bbb",
    opacity: 1,
  },
};

export const blackBoxStyle = (videoSrc: boolean): CSSObject => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  paddingTop: videoSrc ? 0 : 4,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: videoSrc ? 0 : 4,
  backgroundColor: "#1e1e2f",
  borderRadius: videoSrc ? 0 : 3,
  boxShadow: "0px 4px 20px rgba(0,0,0,0.8)",
  boxSizing: "border-box",
  width: videoSrc ? "60%" : "auto",
  height: videoSrc ? "100%" : "auto",
});

export const backgroundStyle = (videoSrc: boolean): CSSObject => ({
  display: "flex",
  height: "100vh",
  background: "linear-gradient(135deg, #6a11cb, #2575fc, #1e3a8a)",
  backgroundSize: "300% 300%",
  animation: "moveBackground 20s infinite",
  alignItems: "center",
  justifyContent: videoSrc ? "flex-start" : "center",
  "@keyframes moveBackground": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
});
