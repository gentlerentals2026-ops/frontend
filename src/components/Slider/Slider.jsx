import { Box, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";

export default function Slider() {
  // List of background images
  const images = [
    "https://plus.unsplash.com/premium_photo-1679280550151-4c56e920b277?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY5fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1722768331920-eeedb2e1c73f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDkxfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1714520270545-937450f41506?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1754407189758-fde7fb4394ad?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D",
  ];

  const [index, setIndex] = useState(0);

  // Auto change background every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  });

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "80vh", md: "100vh" },
        backgroundImage: `url(${images[index]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s ease-in-out",  // smooth fade
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1))",
          top: 0,
          left: 0,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          color: "white",
          maxWidth: { xs: "90%", md: "50%" },
          ml: { xs: 3, md: 6 },
          zIndex: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            lineHeight: 1.2,
            fontSize: { xs: "2rem", md: "3.5rem" },
          }}
        >
          EVENTS AND EQUIPMENT
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            lineHeight: 1.2,
            fontSize: { xs: "2rem", md: "3.5rem" },
            mb: 3,
          }}
        >
          RENTAL SERVICE.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            lineHeight: 1.7,
            mb: 3,
          }}
        >
          We aim to be your one stop rental company for all your party rental
          items. We are committed to expanding our inventory to meet diverse
          requirements of our customers across Nigeria. Our team is always
          ready to provide professional advice to ensure that our customers'
          events are successful.
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "black",
            fontWeight: "bold",
            borderRadius: "30px",
            px: 4,
            py: 1.4,
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
          }}
        >
          READ MORE
        </Button>
      </Box>
    </Box>
  );
}
