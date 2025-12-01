import React from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

interface ViewerControlsProps {
  currentIndex: number;
  totalSnapshots: number;
  onPrevious: () => void;
  onNext: () => void;
  description?: string;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  currentIndex,
  totalSnapshots,
  onPrevious,
  onNext,
  description,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSnapshots - 1;
  const progress = ((currentIndex + 1) / totalSnapshots) * 100;

  return (
    <Box
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "#252526",
        px: 2,
        py: 1.5,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* Previous Button */}
        <Button
          variant="outlined"
          size="small"
          onClick={onPrevious}
          disabled={isFirst}
          startIcon={<ChevronLeftIcon />}
          sx={{
            borderColor: "grey.700",
            color: "grey.300",
            "&:hover": {
              borderColor: "grey.500",
              bgcolor: "rgba(255,255,255,0.05)",
            },
            "&.Mui-disabled": {
              borderColor: "grey.800",
              color: "grey.600",
            },
          }}
        >
          Prev
        </Button>

        {/* Center Info */}
        <Box sx={{ flex: 1, textAlign: "center", minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: "grey.200", fontWeight: 500 }}>
            {currentIndex + 1}{" "}
            <Typography component="span" sx={{ color: "grey.600" }}>
              /
            </Typography>{" "}
            {totalSnapshots}
          </Typography>
          {description && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "grey.500",
                mt: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {/* Next Button */}
        <Button
          variant="contained"
          size="small"
          onClick={onNext}
          disabled={isLast}
          endIcon={<ChevronRightIcon />}
          sx={{
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            "&.Mui-disabled": {
              bgcolor: "grey.800",
              color: "grey.600",
            },
          }}
        >
          Next
        </Button>
      </Stack>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mt: 1.5,
          height: 4,
          borderRadius: 2,
          bgcolor: "grey.800",
          "& .MuiLinearProgress-bar": {
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
};
