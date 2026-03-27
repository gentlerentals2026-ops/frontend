import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const FaqPage = () => {
  const { siteSettings } = useSiteSettings();
  const faqs = Array.isArray(siteSettings.faqs) ? siteSettings.faqs.filter((item) => item?.question || item?.answer) : [];

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)", minHeight: "70vh" }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          FAQs
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          Answers to common questions about bookings, quotations, and event rentals.
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion key={`${faq.question}-${index}`} sx={{ mb: 1.5, borderRadius: 2, overflow: "hidden" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default FaqPage;
