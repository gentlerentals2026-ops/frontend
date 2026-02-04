import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, MusicNote } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#000", color: "#bfc3d0", padding: "50px 20px 20px" }}>
      <Grid
        container
        spacing={4}
        sx={{
          maxWidth: "1300px",
          margin: "auto",
        }}
      >
        {/* LEFT SECTION - LOGO + CONTACT */}
        <Grid item xs={12} md={4}>
          <img
            src="/logo.png"
            alt="Posh Rentals Logo"
            style={{ width: "140px", marginBottom: "10px" }}
          />

          <Typography sx={{ color: "#fff", fontStyle: "italic", mb: 2 }}>
            "We've got your event(s) covered"
          </Typography>

          <Typography><strong>Phone:</strong> +2348148928379, +2348148928379</Typography>
          <Typography><strong>Mail:</strong> gentlerentals@gmail.com</Typography>
          <Typography>
            <strong>Address:</strong> No 23 , Okuokuokor road off fresh ville road,Okpe Delta State
          </Typography>
        </Grid>

        {/* USEFUL LINKS */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Useful Link
          </Typography>
          <Typography sx={{ mb: 1 }}>Home</Typography>
          <Typography sx={{ mb: 1 }}>About Us</Typography>
          <Typography sx={{ mb: 1 }}>Contact Us</Typography>
          <Typography sx={{ mb: 1 }}>Equipments</Typography>
        </Grid>

        {/* COMMUNITY */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Community
          </Typography>
          <Typography sx={{ mb: 1 }}>FAQS</Typography>
          <Typography sx={{ mb: 1 }}>Privacy Policy</Typography>
          <Typography sx={{ mb: 1 }}>Cancellation Policy</Typography>
          <Typography sx={{ mb: 1 }}>Brochure</Typography>
        </Grid>

        {/* NEWSLETTER */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Subscribe For Our Newsletters
          </Typography>

          {/* Input + Button Box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ff4a00",
              borderRadius: "40px",
              padding: "8px",
              mb: 2,
              flexDirection: { xs: "column", sm: "row" },
              width: "100%",
              gap: { xs: 1.5, sm: 0 },
            }}
          >
            <TextField
              placeholder="Your Email Address"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  color: "#fff",
                  px: 2,
                },
              }}
              sx={{
                flex: 1,
                width: "100%",
              }}
            />

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#268cff",
                borderRadius: "40px",
                padding: "10px 25px",
                width: { xs: "100%", sm: "auto" },
                textAlign: "center",
              }}
            >
              Subscribe
            </Button>
          </Box>

          {/* SOCIAL ICONS */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton sx={{ color: "#bfc3d0" }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: "#bfc3d0" }}>
              <Instagram />
            </IconButton>
            <IconButton sx={{ color: "#bfc3d0" }}>
              <Twitter />
            </IconButton>
            <IconButton sx={{ color: "#bfc3d0" }}>
              <MusicNote />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* COPYRIGHT */}
      <Typography
        sx={{
          textAlign: "center",
          marginTop: "40px",
          color: "#777",
          fontSize: "14px",
        }}
      >
        ©2026 Gentle Rentals Ventures. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
