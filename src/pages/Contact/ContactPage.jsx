import { Alert, Box, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AboutService } from "../../services/about/About";
import { ContactService } from "../../services/contact/Contact";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

const ContactPage = () => {
  const { siteSettings } = useSiteSettings();
  const [about, setAbout] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadAbout = async () => {
      try {
        setIsLoading(true);
        const response = await AboutService.getAbout();
        setAbout(response.data);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load contact details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAbout();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");
      const response = await ContactService.submitMessage(form);
      setSuccess(response.message || "Message sent successfully.");
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError.message || "Unable to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: 3,
          background:
            "linear-gradient(150deg, rgba(12,74,110,0.96) 0%, rgba(37,99,235,0.90) 44%, rgba(14,165,233,0.82) 100%)",
          color: "#fff"
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5 }}>
          Contact Us
        </Typography>
        <Typography sx={{ maxWidth: 720, lineHeight: 1.8, color: "rgba(255,255,255,0.88)" }}>
          Reach out for bookings, availability checks, or questions about event rental packages.
        </Typography>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, height: "100%" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              Let’s talk about your event
            </Typography>
            {isLoading ? (
              <Typography sx={{ color: "text.secondary" }}>Loading contact details...</Typography>
            ) : (
              <Stack spacing={2}>
                <Typography><strong>Phone:</strong> {about?.phone}</Typography>
                <Typography><strong>Email:</strong> {about?.email}</Typography>
                <Typography><strong>Address:</strong> {about?.address}</Typography>
                <Typography sx={{ color: "text.secondary", pt: 1 }}>
                  We usually respond to inquiries as quickly as possible, especially for active bookings.
                </Typography>
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
              Send a Message
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Full Name" name="name" value={form.name} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Subject" name="subject" value={form.subject} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: siteSettings.addToCartColor,
                  "&:hover": { backgroundColor: siteSettings.addToCartColor }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactPage;
