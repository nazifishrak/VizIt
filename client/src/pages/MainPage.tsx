import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import {
  backgroundStyle,
  blackBoxStyle,
  goButtonStyle,
  textFieldStyle,
} from "../styles/commonStyles.ts";
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";
import {
  LoadingIcon,
  MuteIcon,
  PauseIcon,
  PlayIcon,
  UnmuteIcon,
} from "@livepeer/react/assets";
import React, { useState, type PropsWithChildren, forwardRef } from "react";

const MainPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [videoSrc, setVideoSrc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    try {
      setIsLoading(true);

      // Send POST request to the API endpoint
      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: prompt,
          provider: "openai", // Use the provider as per your backend configuration
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the video.");
      }

      const data = await response.json();

      // Use the video path from the response
      const videoPath = data.video_path;

      if (!videoPath) {
        throw new Error("Video path not found in the response.");
      }

      // Update the video source
      const vodSource = {
        type: "vod",
        meta: {
          playbackPolicy: null,
          source: [
            {
              hrn: "Generated Video",
              type: "video/mp4",
              url: `http://localhost:8000/videos/${videoPath}`, // Construct the full URL to the video
            },
          ],
        },
      };
      setVideoSrc(vodSource);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to load the video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={backgroundStyle(!!videoSrc)}>
      <Paper elevation={8} sx={blackBoxStyle(!!videoSrc)}>
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
        {videoSrc && !isLoading ? (
          <Player.Root src={getSrc(videoSrc)}>
            <Player.Container
              style={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
                backgroundColor: "black",
              }}
            >
              <Player.Video
                title="Agent 327"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
              />

              <Player.LoadingIndicator asChild>
                <Loading />
              </Player.LoadingIndicator>

              <Player.ErrorIndicator matcher="all" asChild>
                <Loading />
              </Player.ErrorIndicator>

              <Player.Controls
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  flexDirection: "column-reverse",
                  gap: 5,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "between",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Player.PlayPauseTrigger
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    >
                      <Player.PlayingIndicator asChild matcher={false}>
                        <PlayIcon />
                      </Player.PlayingIndicator>
                      <Player.PlayingIndicator asChild>
                        <PauseIcon />
                      </Player.PlayingIndicator>
                    </Player.PlayPauseTrigger>

                    <Player.LiveIndicator
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <div
                        style={{
                          backgroundColor: "#ef4444",
                          height: 8,
                          width: 8,
                          borderRadius: 9999,
                        }}
                      />
                      <span style={{ fontSize: 12, userSelect: "none" }}>
                        LIVE
                      </span>
                    </Player.LiveIndicator>

                    <Player.MuteTrigger
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    >
                      <Player.VolumeIndicator asChild matcher={false}>
                        <MuteIcon />
                      </Player.VolumeIndicator>
                      <Player.VolumeIndicator asChild matcher={true}>
                        <UnmuteIcon />
                      </Player.VolumeIndicator>
                    </Player.MuteTrigger>
                    <Player.Volume
                      style={{
                        position: "relative",
                        display: "flex",
                        flexGrow: 1,
                        height: 25,
                        alignItems: "center",
                        maxWidth: 120,
                        touchAction: "none",
                        userSelect: "none",
                      }}
                    >
                      <Player.Track
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          position: "relative",
                          flexGrow: 1,
                          borderRadius: 9999,
                          height: "2px",
                        }}
                      >
                        <Player.Range
                          style={{
                            position: "absolute",
                            backgroundColor: "white",
                            borderRadius: 9999,
                            height: "100%",
                          }}
                        />
                      </Player.Track>
                      <Player.Thumb
                        style={{
                          display: "block",
                          width: 12,
                          height: 12,
                          backgroundColor: "white",
                          borderRadius: 9999,
                        }}
                      />
                    </Player.Volume>
                  </div>
                </div>
                <Seek
                  style={{
                    position: "relative",
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    userSelect: "none",
                    touchAction: "none",
                  }}
                />
              </Player.Controls>
            </Player.Container>
          </Player.Root>
        ) : null}
      </Paper>
    </Box>
  );
};

const Seek = forwardRef<HTMLButtonElement, Player.SeekProps>(
  ({ children, ...props }, forwardedRef) => (
    <Player.Seek ref={forwardedRef} {...props}>
      <Player.Track
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          position: "relative",
          flexGrow: 1,
          borderRadius: 9999,
          height: 2,
        }}
      >
        <Player.SeekBuffer
          style={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 9999,
            height: "100%",
          }}
        />
        <Player.Range
          style={{
            position: "absolute",
            backgroundColor: "white",
            borderRadius: 9999,
            height: "100%",
          }}
        />
      </Player.Track>
      <Player.Thumb
        style={{
          display: "block",
          width: 12,
          height: 12,
          backgroundColor: "white",
          borderRadius: 9999,
        }}
      />
    </Player.Seek>
  )
);

const Loading = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <div
        {...props}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          backgroundColor: "black",
          backdropFilter: "blur(10px)",
          textAlign: "center",
        }}
        ref={forwardedRef}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <LoadingIcon
            style={{
              width: "32px",
              height: "32px",
              animation: "spin infinite 1s linear",
            }}
          />
        </div>
      </div>
    );
  }
);
export default MainPage;
