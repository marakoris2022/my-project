// PokemonMapCard.tsx

import { Box, CardMedia, Typography } from "@mui/material";

interface PokemonMapCardProps {
  lastButton: string;
  imageFront: string;
  imageBack: string;
  name: string;
  top: number;
  left: number;
}

const PokemonMapCard: React.FC<PokemonMapCardProps> = ({
  lastButton,
  imageFront,
  imageBack,
  name,
  top,
  left,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        borderRadius: "7px",
        padding: "5px",
        overflow: "hidden",
        background: "#f0ffff3d",
        border: "solid 1px gray",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          maxWidth: "80px",
          fontSize: "14px",
        }}
      >
        {name.toUpperCase()}
      </Typography>
      <CardMedia
        component="img"
        image={
          lastButton === "down" || lastButton === "left"
            ? imageFront
            : imageBack
        }
        alt={name}
        sx={{
          width: "80px",
          height: "80px",
        }}
      />
    </Box>
  );
};

export default PokemonMapCard;
