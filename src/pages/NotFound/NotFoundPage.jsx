import { Box, Button, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        background: "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)"
      }}
    >
      <Paper sx={{ maxWidth: 620, p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: "center" }}>
        <Typography variant="h1" sx={{ fontWeight: 900, lineHeight: 1, color: "#d97706", mb: 1 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
          Page not found
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          The page you requested does not exist or may have been moved.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Back to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
