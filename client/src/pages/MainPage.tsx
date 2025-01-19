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
  SettingsIcon,
  UnmuteIcon,
} from "@livepeer/react/assets";
import * as Popover from "@radix-ui/react-popover";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import React, {
  useState,
  type CSSProperties,
  type PropsWithChildren,
  forwardRef,
} from "react";

const MainPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [videoSrc, setVideoSrc] = useState<
    null | { src: string; type: string }[]
  >(null);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    if (prompt.toLowerCase() === "matrix multiplication") {
      setVideoSrc([
        { src: "../assets/MatrixMultiplication.mp4", type: "video/mp4" },
      ]);
    } else {
      setVideoSrc(null);
      alert("No video available for the given prompt.");
    }
  };

  const vodSource = {
    type: "vod",
    meta: {
      playbackPolicy: null,
      source: [
        {
          hrn: "MP4 (Local Video)",
          type: "video/mp4",
          url: "http://localhost:3000/MatrixMultiplication.mp4",
        },
      ],
    },
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
        {videoSrc ? (
          <Player.Root src={getSrc(vodSource)}>
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
                  <Settings />
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

const Settings = React.forwardRef(
  (
    { style }: { style?: CSSProperties },
    ref: React.Ref<HTMLButtonElement> | undefined
  ) => {
    return (
      <Popover.Root>
        <Popover.Trigger ref={ref} asChild>
          <button
            type="button"
            style={style}
            aria-label="Playback settings"
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsIcon
              style={{
                width: 25,
                height: 25,
              }}
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            style={{
              width: 250,
              borderRadius: 5,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(12px)",
              padding: 10,
            }}
            side="top"
            alignOffset={-70}
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                }}
              >
                Settings
              </p>
              <Player.LiveIndicator
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
                matcher={false}
              >
                <label
                  style={{
                    fontSize: 12,
                  }}
                  htmlFor="qualitySelect"
                >
                  Quality
                </label>
                <Player.RateSelect name="rateSelect">
                  <Player.SelectTrigger
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: 30,
                      minWidth: 120,
                      fontSize: 12,
                      gap: 5,
                      padding: 10,
                      borderRadius: 5,
                      outline: "white solid 1px",
                    }}
                    aria-label="Playback speed"
                  >
                    <Player.SelectValue placeholder="Select a speed..." />
                    <Player.SelectIcon>
                      <ChevronDownIcon style={{ width: 14, height: 14 }} />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent
                      style={{
                        borderRadius: 5,
                        backgroundColor: "black",
                      }}
                    >
                      <Player.SelectViewport style={{ padding: 5 }}>
                        <Player.SelectGroup>
                          <RateSelectItem value={0.5}>0.5x</RateSelectItem>
                          <RateSelectItem value={1}>1x</RateSelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.RateSelect>
              </Player.LiveIndicator>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                  }}
                  htmlFor="qualitySelect"
                >
                  Quality
                </label>
                <Player.VideoQualitySelect name="qualitySelect">
                  <Player.SelectTrigger
                    style={{
                      minWidth: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: 30,
                      fontSize: 12,
                      gap: 5,
                      padding: 10,
                      borderRadius: 5,
                      outline: "white solid 1px",
                    }}
                    aria-label="Playback quality"
                  >
                    <Player.SelectValue placeholder="Select a quality..." />
                    <Player.SelectIcon>
                      <ChevronDownIcon style={{ width: 14, height: 14 }} />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent
                      style={{
                        borderRadius: 5,
                        backgroundColor: "black",
                      }}
                    >
                      <Player.SelectViewport style={{ padding: 5 }}>
                        <Player.SelectGroup>
                          <VideoQualitySelectItem value="auto">
                            Auto (HD+)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="1080p">
                            1080p (HD)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="360p">
                            360p
                          </VideoQualitySelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.VideoQualitySelect>
              </div>
            </div>
            <Popover.Close
              style={{
                borderRadius: 9999,
                height: 20,
                width: 20,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: 5,
                right: 5,
              }}
              aria-label="Close"
            >
              <XIcon />
            </Popover.Close>
            <Popover.Arrow
              style={{
                fill: "white",
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }
);

const RateSelectItem = forwardRef<HTMLDivElement, Player.RateSelectItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Player.RateSelectItem
        style={{
          fontSize: 12,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          paddingRight: 35,
          paddingLeft: 25,
          position: "relative",
          userSelect: "none",
          height: 30,
        }}
        {...props}
        ref={forwardedRef}
      >
        <Player.SelectItemText>{children}</Player.SelectItemText>
        <Player.SelectItemIndicator
          style={{
            position: "absolute",
            left: 0,
            width: 25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckIcon style={{ width: 14, height: 14 }} />
        </Player.SelectItemIndicator>
      </Player.RateSelectItem>
    );
  }
);

const VideoQualitySelectItem = forwardRef<
  HTMLDivElement,
  Player.VideoQualitySelectItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <Player.VideoQualitySelectItem
      style={{
        fontSize: 12,
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        paddingRight: 35,
        paddingLeft: 25,
        position: "relative",
        userSelect: "none",
        height: 30,
      }}
      {...props}
      ref={forwardedRef}
    >
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator
        style={{
          position: "absolute",
          left: 0,
          width: 25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon style={{ width: 14, height: 14 }} />
      </Player.SelectItemIndicator>
    </Player.VideoQualitySelectItem>
  );
});

export default MainPage;
