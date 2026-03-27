import { Box, Button, Container, Paper, Typography } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const contentMap = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we handle customer and booking information.",
    contentKey: "privacyPolicyContent"
  },
  cancellation: {
    title: "Cancellation Policy",
    subtitle: "Guidance on booking changes, cancellations, and timing.",
    contentKey: "cancellationPolicyContent"
  },
  brochure: {
    title: "Brochure",
    subtitle: "Explore our latest rental collection and booking guide.",
    contentKey: "brochureContent"
  }
};

const PolicyPage = ({ type }) => {
  const { siteSettings } = useSiteSettings();
  const page = contentMap[type];
  const content = siteSettings?.[page.contentKey] || "";

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: "linear-gradient(180deg, #fffaf5 0%, #ffffff 100%)", minHeight: "70vh" }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          {page.title}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>{page.subtitle}</Typography>

        <Paper sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.9, whiteSpace: "pre-line" }}>
            {content}
          </Typography>

          {type === "brochure" && siteSettings?.brochureUrl && (
            <Button
              component="a"
              href={siteSettings.brochureUrl}
              target="_blank"
              rel="noreferrer"
              startIcon={<DownloadRoundedIcon />}
              variant="contained"
              sx={{ mt: 3 }}
            >
              Download Current Brochure
            </Button>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default PolicyPage;
