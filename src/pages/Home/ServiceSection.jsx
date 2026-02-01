import { Box, Typography, Grid, Paper } from "@mui/material";
import WindowIcon from "@mui/icons-material/Window";
import PhoneIcon from "@mui/icons-material/Phone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShieldIcon from "@mui/icons-material/Shield";

export default function ServicesSection() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#e9f1f2",
        py: { xs: 6, md: 10 },
        px: { xs: 3, md: 10 },
      }}
    >
      {/* HEADER */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" sx={{ color: "gray", fontWeight: 600 }}>
            WELCOME
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mt: 1,
              lineHeight: 1.3,
              fontSize: { xs: "1.8rem", md: "2.6rem" },
            }}
          >
            We Provide Quality
            <br /> Rental Services to You
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.7,
              color: "#444",
            }}
          >
            We provide quality services by offering well-maintained rental
            equipment, exceptional customer care, and seamless booking experiences.
          </Typography>
        </Grid>
      </Grid>

      {/* SPACING */}
      <Box sx={{ height: 20 }} />

      {/* SERVICE BOXES */}
      <Grid
        container
        spacing={3}
        justifyContent="center"   // 🔥 Centers items on mobile
        alignItems="center"
      >
        {[
          {
            icon: <WindowIcon sx={{ fontSize: 55 }} />,
            label: "Tents",
            bg: "white",
          },
          {
            icon: <PhoneIcon sx={{ fontSize: 55, color: "#122" }} />,
            label: "24/7 Customer Care Service",
            bg: "#cbe255",
          },
          {
            icon: <LocalShippingIcon sx={{ fontSize: 55 }} />,
            label: "We Deliver To You",
            bg: "white",
          },
          {
            icon: <ShieldIcon sx={{ fontSize: 55 }} />,
            label: "We Guarantee Satisfaction",
            bg: "white",
          },
        ].map((item, index) => (
          <Grid
            key={index}
            item
            xs={12}
            sm={6}
            md={3}
            sx={{
              display: "flex",
              justifyContent: "center",   // 🔥 Center each box inside the grid item
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: 230,                // 🔥 Fixed width for perfect centering
                height: 230,               // 🔥 Perfect square
                borderRadius: 2,
                backgroundColor: item.bg,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                p: 3,
              }}
            >
              {item.icon}
              <Typography sx={{ mt: 2, fontWeight: 600 }}>
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
