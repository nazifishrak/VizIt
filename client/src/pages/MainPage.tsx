import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Slide,
  Fade,
} from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
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
import React, {
  useState,
  type PropsWithChildren,
  forwardRef,
  useEffect,
} from "react";
import "@fontsource/montserrat/800.css";

const MainPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [videoSrc, setVideoSrc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<number>(1);
  const [videoHistory, setVideoHistory] = useState<
    { src: string; prompt: string }[]
  >([]);
  const [isPaperVisible, setIsPaperVisible] = useState(false);
  const [showBox, setShowBox] = useState(true);

  const togglePaper = () => {
    setIsPaperVisible((prev) => !prev);
    setShowBox(false);
  };

  useEffect(() => {
    let interval: number | null = null;

    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStage((prevStage) => (prevStage === 4 ? 4 : prevStage + 1));
      }, 15000);
    }

    // Clear the interval when loading stops
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);

  const stages = [
    { label: "Generating video animation" },
    { label: "Generating audio script" },
    { label: "Adding voice over" },
    { label: "Finalizing your visualization" },
  ];

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: prompt,
          provider: "openai",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the video.");
      }

      const data = await response.json();
      const videoPath = data.video_path;

      if (!videoPath) {
        throw new Error("Video path not found in the response.");
      }

      const vodSource = {
        type: "vod",
        meta: {
          playbackPolicy: null,
          source: [
            {
              hrn: "Generated Video",
              type: "video/mp4",
              url: `http://localhost:8000/videos/${videoPath}`,
            },
          ],
        },
      };

      setVideoSrc(vodSource);
      const videoUrl = `http://localhost:8000/videos/${videoPath}`;
      setVideoHistory((prev) => [...prev, { src: videoUrl, prompt: prompt }]); // Add to history
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to load the video. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingStage(1); // Reset the loading stage
    }
  };

  return (
    <Box sx={backgroundStyle(!!videoSrc)}>
      {showBox && (
        <Box
          sx={{
            justifyContent: "center",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontFamily: "'Montserrat', sans-serif",
              color: "#ffffff",
              textShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
              fontSize: "14rem",
              marginBottom: 2,
              height: "14rem",
            }}
          >
            VIZ.IT
          </Typography>
          <Typography
            variant="h4"
            sx={{
              marginBottom: 9,
              fontWeight: "bold",
              color: "#ffffff",
              textShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
            }}
          >
            Visual Learning without Boundaries
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={togglePaper}
            sx={{
              ...goButtonStyle,
              color: "black",
              fontSize: "1.25rem",
              padding: "12px 24px",
              background:
                "linear-gradient(135deg, #ff7e5f, #feb47b) !important",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #feb47b, #ff7e5f) !important",
              },
              width: "30% !important",
              margin: "0 auto",
            }}
          >
            Try
          </Button>
        </Box>
      )}
      <Fade in={!showBox} timeout={1000}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontFamily: "'Montserrat', sans-serif",
            color: videoSrc ? "#1765c0" : "#ffffff",
            textShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
            fontSize: videoSrc ? "2rem" : "3rem",
            marginBottom: 2,
            position: "absolute",
            top: "16px",
            left: "40px",
          }}
        >
          VIZ.IT
        </Typography>
      </Fade>
      <Slide
        direction="up"
        in={isPaperVisible}
        mountOnEnter
        unmountOnExit
        timeout={1000}
      >
        <Paper elevation={8} sx={blackBoxStyle(!!videoSrc)}>
          <Typography
            variant="h4"
            sx={{
              marginBottom: 1,
              fontWeight: "bold",
              color: "#ffffff",
              textShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
            }}
          >
            What would you like to get explained?
            
          </Typography>
          {!videoSrc &&(
          <Box sx={{ textAlign: "left" }}>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              - I can generate a visualization and explanation in any language
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                marginBottom: 1,
              }}
            >
              - Ask me something like "Explain intuition behind vector addition
              in Spanish"
            </Typography>
          </Box>
          )}
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
            <Player.Root key={JSON.stringify(videoSrc)} src={getSrc(videoSrc)}>
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
                          width: 35,
                          height: 35,
                          backgroundColor: "transparent",
                          color: "white",
                          border: "none",
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
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
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
                          width: 35,
                          height: 35,
                          backgroundColor: "transparent",
                          color: "white",
                          border: "none",
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
          ) : (
            isLoading && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                  justifyContent: "left",
                  gap: 3,
                  color: "#ffffff",
                }}
              >
                {/* Progress Indicators */}
                {stages.map((stage, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      opacity: 1,
                      transition: "opacity 0.5s ease-in-out",
                    }}
                  >
                    {loadingStage > index + 1 ? (
                      <CheckCircleIcon
                        sx={{
                          color: "#feb47b",
                          fontSize: 28,
                          zIndex: 1,
                          borderRadius: "50%",
                        }}
                      />
                    ) : loadingStage === index + 1 ? (
                      <CircularProgress size={24} sx={{ color: "#03A9F4" }} />
                    ) : (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{ color: "rgba(255, 255, 255, 0.3)" }}
                          variant="determinate"
                          value={0}
                        />
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            marginLeft: 1,
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            borderRadius: "50%",
                            position: "absolute",
                          }}
                        />
                      </>
                    )}
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        color:
                          loadingStage >= index + 1
                            ? "#ffffff"
                            : "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {stage.label}
                    </Typography>
                  </Box>
                ))}

                {/* Progress Bar */}
                <Box
                  sx={{
                    position: "relative",
                    height: "8px",
                    width: "100%",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.2)",
                    overflow: "hidden",
                    marginTop: "20px",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${loadingStage * 25}%`,
                      background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </Box>
              </Box>
            )
          )}
        </Paper>
      </Slide>
      {videoSrc && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            width: "40%",
            paddingLeft: 6,
            paddingTop: 2,
            paddingBottom: 6,
            paddingRight: 6,
            height: "100%",
            overflowY: "auto",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "left",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontFamily: "'Montserrat', sans-serif",
                color: "#ffffff",
                fontSize: "2rem",
                marginBottom: 2,
                height: "2rem",
                width: "100%",
              }}
            >
              HISTORY
            </Typography>
          </Box>
          {[...videoHistory]
            .slice()
            .reverse()
            .map((item, index) => (
              <Box
                key={index}
                sx={{
                  background: "#000",
                  borderRadius: 6,
                  overflow: "hidden",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
                  position: "relative",
                  cursor: "pointer",
                  width: "100%",
                  "&:hover": {
                    boxShadow: "0px 6px 12px rgba(0,0,0,0.5)",
                  },
                }}
                onClick={() => {
                  const vodSource = {
                    type: "vod",
                    meta: {
                      playbackPolicy: null,
                      source: [
                        {
                          hrn: "Generated Video",
                          type: "video/mp4",
                          url: `${item.src}`,
                        },
                      ],
                    },
                  };
                  setVideoSrc(vodSource);
                  setPrompt(item.prompt);
                }}
              >
                {/* Display the prompt */}
                <Typography
                  variant="h6"
                  sx={{
                    margin: 2,
                    color: "#ffffff",
                    wordWrap: "break-word",
                  }}
                >
                  {item.prompt}
                </Typography>

                {/* Video preview */}
                <video
                  src={item.src}
                  muted
                  loop
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
              </Box>
            ))}
        </Box>
      )}
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
