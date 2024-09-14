import { Backdrop, CircularProgress } from "@mui/material";

export default function StaticBackdrop() {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
