import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, MusicNote } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const Footer = () => {
  const { siteSettings } = useSiteSettings();
  const socialLinks = [
    { key: "facebook", url: siteSettings.facebookUrl, icon: <Facebook /> },
    { key: "instagram", url: siteSettings.instagramUrl, icon: <Instagram /> },
    { key: "twitter", url: siteSettings.twitterUrl, icon: <Twitter /> },
    { key: "tiktok", url: siteSettings.tiktokUrl, icon: <MusicNote /> }
  ];

  return (
    <Box sx={{ backgroundColor: siteSettings.footerBackgroundColor || "#000000", color: "#bfc3d0", padding: "50px 20px 20px" }}>
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
            src={siteSettings.logoUrl || "/logo.png"}
            alt={`${siteSettings.siteName || "Gentle Rentals"} Logo`}
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
          <Typography component={RouterLink} to="/" sx={{ mb: 1, display: "block", color: "inherit", textDecoration: "none" }}>Home</Typography>
          <Typography component={RouterLink} to="/about" sx={{ mb: 1, display: "block", color: "inherit", textDecoration: "none" }}>About Us</Typography>
          <Typography component={RouterLink} to="/contact" sx={{ mb: 1, display: "block", color: "inherit", textDecoration: "none" }}>Contact Us</Typography>
          <Typography component={RouterLink} to="/products" sx={{ mb: 1, display: "block", color: "inherit", textDecoration: "none" }}>Equipments</Typography>
        </Grid>

        {/* COMMUNITY */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Community
          </Typography>
          <Typography component={RouterLink} to="/faqs" sx={{ mb: 1, display: "block", color: "inherit", textDecoration: "none" }}>FAQS</Typography>
          <Typography component={RouterLink} to="/privacy-policy" sx={{ mb: 1, display: "block", color: "inherit", textDecoration: "none" }}>Privacy Policy</Typography>
          <Typography component={RouterLink} to="/cancellation-policy" sx={{ mb: 1, display: "block", color: "inherit", textDecoration: "none" }}>Cancellation Policy</Typography>
          <Typography component={RouterLink} to="/brochure" sx={{ mb: 1, display: "block", color: "inherit", textDecoration: "none" }}>Brochure</Typography>
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
            {socialLinks.map((item) => (
              <IconButton
                key={item.key}
                component={item.url ? "a" : "button"}
                href={item.url || undefined}
                target={item.url ? "_blank" : undefined}
                rel={item.url ? "noreferrer" : undefined}
                disabled={!item.url}
                sx={{ color: "#bfc3d0" }}
              >
                {item.icon}
              </IconButton>
            ))}
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
        ©2026 {siteSettings.siteName || "Gentle Rentals Ventures"}. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
