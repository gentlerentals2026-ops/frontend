import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AboutService } from "../../services/about/About";

const defaultForm = {
  heroTitle: "",
  heroSubtitle: "",
  story: "",
  mission: "",
  vision: "",
  phone: "",
  email: "",
  address: "",
  values: ""
};

const AboutPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.appState);
  const isAdmin = isAuthenticated && user?.role === "admin";
  const [about, setAbout] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadAbout = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await AboutService.getAbout();
        const payload = response.data;
        setAbout(payload);
        setForm({
          heroTitle: payload.heroTitle || "",
          heroSubtitle: payload.heroSubtitle || "",
          story: payload.story || "",
          mission: payload.mission || "",
          vision: payload.vision || "",
          phone: payload.phone || "",
          email: payload.email || "",
          address: payload.address || "",
          values: (payload.values || []).join(", ")
        });
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load about content.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAbout();
  }, []);

  const valuesList = useMemo(() => (about?.values || []).filter(Boolean), [about]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");
      const response = await AboutService.updateAbout(form);
      setAbout(response.data);
      setForm({
        heroTitle: response.data.heroTitle || "",
        heroSubtitle: response.data.heroSubtitle || "",
        story: response.data.story || "",
        mission: response.data.mission || "",
        vision: response.data.vision || "",
        phone: response.data.phone || "",
        email: response.data.email || "",
        address: response.data.address || "",
        values: (response.data.values || []).join(", ")
      });
      setSuccess(response.message || "About content updated.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save about content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
      {isLoading ? (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>Loading about page...</Typography>
      ) : (
        <>
          <Paper
            sx={{
              p: { xs: 3, md: 5 },
              mb: 4,
              borderRadius: 3,
              color: "#fff",
              background:
                "linear-gradient(140deg, rgba(15,23,42,0.96) 0%, rgba(194,65,12,0.92) 48%, rgba(251,191,36,0.88) 100%)"
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5 }}>
              {about?.heroTitle}
            </Typography>
            <Typography sx={{ maxWidth: 760, fontSize: "1.08rem", lineHeight: 1.8, color: "rgba(255,255,255,0.88)" }}>
              {about?.heroSubtitle}
            </Typography>
          </Paper>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, height: "100%" }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                  Our Story
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.9, mb: 3 }}>
                  {about?.story}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Mission</Typography>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>{about?.mission}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Vision</Typography>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>{about?.vision}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Stack spacing={3}>
                <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                    Core Values
                  </Typography>
                  <Stack spacing={1.5}>
                    {valuesList.map((value) => (
                      <Box key={value} sx={{ px: 2, py: 1.25, borderRadius: 3, bgcolor: "#fff7ed", color: "#9a3412" }}>
                        {value}
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                    Contact Details
                  </Typography>
                  <Stack spacing={1.25}>
                    <Typography><strong>Phone:</strong> {about?.phone}</Typography>
                    <Typography><strong>Email:</strong> {about?.email}</Typography>
                    <Typography><strong>Address:</strong> {about?.address}</Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>

          {isAdmin && (
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mt: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Admin About Editor
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 3 }}>
                Update the public About page content from here.
              </Typography>

              <Box component="form" onSubmit={handleSave}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Hero Title" name="heroTitle" value={form.heroTitle} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Hero Subtitle" name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline minRows={4} label="Story" name="story" value={form.story} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth multiline minRows={3} label="Mission" name="mission" value={form.mission} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth multiline minRows={3} label="Vision" name="vision" value={form.vision} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Address" name="address" value={form.address} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Values"
                      helperText="Separate multiple values with commas"
                      name="values"
                      value={form.values}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Button type="submit" variant="contained" sx={{ mt: 3, backgroundColor: "orange" }} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save About Content"}
                </Button>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default AboutPage;
