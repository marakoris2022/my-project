import { Backdrop, CircularProgress } from "@mui/material";

export default function StaticBackdrop() {
  return (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
