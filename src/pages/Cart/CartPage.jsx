import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { QuotationService } from "../../services/quotation/Quotation";
import { jsPDF } from "jspdf";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation
} from "../../services/api/cartApi";

const formatPrice = (price) => Number(price || 0).toLocaleString("en-NG");

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.appState);
  const { siteSettings } = useSiteSettings();
  const { data: cartResponse, isLoading: isLoadingCart } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [quoteForm, setQuoteForm] = useState({
    eventDate: "",
    rentalDays: 1,
    eventLocation: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    notes: ""
  });

  const items = cartResponse?.data?.items || [];
  const totalItems = cartResponse?.data?.totalItems || 0;
  const subtotal = cartResponse?.data?.subtotal || 0;

  const handleQuoteFormChange = (event) => {
    const { name, value } = event.target;
    setQuoteForm((current) => ({ ...current, [name]: value }));
  };

  const generatePdf = (quotation) => {
    const doc = new jsPDF();
    let currentY = 20;

    doc.setFontSize(18);
    doc.text("Gentle Rentals Quotation", 14, currentY);
    currentY += 10;

    doc.setFontSize(11);
    doc.text(`Quote No: ${quotation.quoteNumber}`, 14, currentY);
    currentY += 7;
    doc.text(`Customer: ${user?.fullName || ""}`, 14, currentY);
    currentY += 7;
    doc.text(`Email: ${user?.email || ""}`, 14, currentY);
    currentY += 7;
    doc.text(`Phone: ${user?.phone || ""}`, 14, currentY);
    currentY += 7;
    doc.text(`Event Date: ${quoteForm.eventDate || "Not specified"}`, 14, currentY);
    currentY += 7;
    doc.text(`Rental Days: ${quoteForm.rentalDays || 1}`, 14, currentY);
    currentY += 7;
    doc.text(`Return Date: ${quotation.returnDate || "Not specified"}`, 14, currentY);
    currentY += 7;
    doc.text(`Location: ${quoteForm.eventLocation || "Not specified"}`, 14, currentY);
    currentY += 7;
    doc.text(`Emergency Contact: ${quoteForm.emergencyContactName || "Not specified"}`, 14, currentY);
    currentY += 7;
    doc.text(`Emergency Phone: ${quoteForm.emergencyContactPhone || "Not specified"}`, 14, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.text("Items", 14, currentY);
    currentY += 8;

    items.forEach((item, index) => {
      const line = `${index + 1}. ${item.title} - Qty ${item.quantity} x N${formatPrice(item.unitPrice)} = N${formatPrice(
        item.unitPrice * item.quantity
      )}`;
      doc.text(line, 14, currentY);
      currentY += 7;
    });

    currentY += 4;
    doc.text(`Total Items: ${totalItems}`, 14, currentY);
    currentY += 7;
    doc.text(`Subtotal: N${formatPrice(subtotal)}`, 14, currentY);
    currentY += 10;

    if (quoteForm.notes) {
      doc.text("Notes:", 14, currentY);
      currentY += 7;
      const splitNotes = doc.splitTextToSize(quoteForm.notes, 180);
      doc.text(splitNotes, 14, currentY);
    }

    doc.save(`${quotation.quoteNumber}.pdf`);
  };

  const handleGenerateQuotation = async () => {
    try {
      setIsGenerating(true);
      setError("");
      setSuccess("");

      const payload = {
        eventDate: quoteForm.eventDate,
        rentalDays: Number(quoteForm.rentalDays) || 1,
        eventLocation: quoteForm.eventLocation,
        emergencyContactName: quoteForm.emergencyContactName,
        emergencyContactPhone: quoteForm.emergencyContactPhone,
        notes: quoteForm.notes,
        items: items.map((item) => ({
          productId: item.productId,
          title: item.title,
          slug: item.slug,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      const response = await QuotationService.createQuotation(payload);
      generatePdf(response.data);
      setSuccess("Quotation generated and sent to admin successfully.");
      setIsDialogOpen(false);
    } catch (quotationError) {
      setError(quotationError.message || "Unable to generate quotation.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 160px)",
          px: { xs: 2, md: 6 },
          py: { xs: 4, md: 6 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Paper sx={{ maxWidth: 620, p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: "center" }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 54, color: "#f59e0b", mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Login to view your cart
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Your cart is reserved for signed-in users so we can keep your selected rental items consistent.
          </Typography>
          <Button component={RouterLink} to="/account" variant="contained" sx={{ backgroundColor: "orange" }}>
            Go to Account
          </Button>
        </Paper>
      </Box>
    );
  }

  if (isLoadingCart) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>Loading your cart...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
        Your Cart
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        Review your selected rental items in real time before you continue.
      </Typography>

      {items.length === 0 ? (
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: "center" }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 54, color: "#f59e0b", mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
            Your cart is empty
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Browse listings and add the chairs or tables you want to reserve.
          </Typography>
          <Button component={RouterLink} to="/products" variant="contained" sx={{ backgroundColor: "orange" }}>
            Browse Products
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.5fr 0.8fr" },
            gap: 3,
            alignItems: "start"
          }}
        >
          <Stack spacing={2.5}>
            {items.map((item) => (
              <Card
                key={item.productId}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "220px 1fr" },
                  borderRadius: 3,
                  overflow: "hidden"
                }}
              >
                <CardMedia component="img" image={item.imageUrl} alt={item.title} sx={{ height: { xs: 220, sm: "100%" } }} />
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1.5 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>₦{formatPrice(item.unitPrice)} per item</Typography>
                    </Box>
                    <IconButton onClick={() => removeCartItem(item.productId)} color="error">
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>

                  <Typography sx={{ color: "text.secondary", mb: 2 }}>
                    Available units: {item.quantityAvailable}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton onClick={() => updateCartItem({ productId: item.productId, quantity: item.quantity - 1 })}>
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(event) =>
                          updateCartItem({
                            productId: item.productId,
                            quantity: Math.max(1, Math.min(Number(event.target.value) || 1, Number(item.quantityAvailable || 1)))
                          })
                        }
                        inputProps={{
                          min: 1,
                          max: Number(item.quantityAvailable || 1),
                          style: { textAlign: "center", padding: "8px 6px", width: 56 }
                        }}
                        sx={{
                          width: 72,
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0
                          },
                          "& input[type=number]": {
                            MozAppearance: "textfield"
                          }
                        }}
                      />
                      <IconButton
                        onClick={() => updateCartItem({ productId: item.productId, quantity: item.quantity + 1 })}
                        disabled={item.quantity >= item.quantityAvailable}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Typography sx={{ fontWeight: 800, color: "#d97706", fontSize: "1.1rem" }}>
                      ₦{formatPrice(item.unitPrice * item.quantity)}
                    </Typography>
                  </Box>

                  <Button
                    component={RouterLink}
                    to={`/products/${item.slug}`}
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: siteSettings.addToCartColor,
                      "&:hover": { backgroundColor: siteSettings.addToCartColor }
                    }}
                  >
                    View Listing
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Paper sx={{ p: 3, borderRadius: 3, position: { lg: "sticky" }, top: { lg: 110 } }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              Cart Summary
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: "text.secondary" }}>Items</Typography>
                <Typography sx={{ fontWeight: 700 }}>{totalItems}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: "text.secondary" }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 700 }}>₦{formatPrice(subtotal)}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Typography sx={{ color: "text.secondary", mb: 3 }}>
              This cart updates instantly as you add, remove, or adjust rental quantities.
            </Typography>

            <Stack spacing={1.5}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: siteSettings.addToCartColor,
                  "&:hover": { backgroundColor: siteSettings.addToCartColor }
                }}
                onClick={() => setIsDialogOpen(true)}
              >
                Generate Quotation
              </Button>
              <Button
                variant="outlined"
                onClick={() => clearCart()}
                sx={{
                  borderColor: siteSettings.addToCartColor,
                  color: siteSettings.addToCartColor,
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    borderColor: siteSettings.addToCartColor,
                    color: siteSettings.addToCartColor,
                    backgroundColor: "rgba(255,255,255,0.96)"
                  }
                }}
              >
                Clear Cart
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "#ffffff",
            color: "#111827",
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ color: "#111827", fontWeight: 800 }}>Generate Quotation PDF</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label="Event Date"
              name="eventDate"
              type="date"
              value={quoteForm.eventDate}
              onChange={handleQuoteFormChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                  color: "#111827"
                },
                "& .MuiInputLabel-root": {
                  color: "#374151"
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: siteSettings.addToCartColor
                }
              }}
              fullWidth
            />
            <TextField
              label="Rental Days"
              name="rentalDays"
              type="number"
              value={quoteForm.rentalDays}
              onChange={handleQuoteFormChange}
              inputProps={{ min: 1 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                  color: "#111827"
                },
                "& .MuiInputLabel-root": {
                  color: "#374151"
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: siteSettings.addToCartColor
                }
              }}
              fullWidth
            />
            <TextField
              label="Event Location"
              name="eventLocation"
              value={quoteForm.eventLocation}
              onChange={handleQuoteFormChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                  color: "#111827"
                },
                "& .MuiInputLabel-root": {
                  color: "#374151"
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: siteSettings.addToCartColor
                }
              }}
              fullWidth
            />
            <TextField
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={quoteForm.emergencyContactName}
              onChange={handleQuoteFormChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                  color: "#111827"
                },
                "& .MuiInputLabel-root": {
                  color: "#374151"
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: siteSettings.addToCartColor
                }
              }}
              fullWidth
            />
            <TextField
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              value={quoteForm.emergencyContactPhone}
              onChange={handleQuoteFormChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                  color: "#111827"
                },
                "& .MuiInputLabel-root": {
                  color: "#374151"
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: siteSettings.addToCartColor
                }
              }}
              fullWidth
            />
            <TextField
              label="Additional Notes"
              name="notes"
              value={quoteForm.notes}
              onChange={handleQuoteFormChange}
              multiline
              minRows={4}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                  color: "#111827"
                },
                "& .MuiInputLabel-root": {
                  color: "#374151"
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: siteSettings.addToCartColor
                }
              }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsDialogOpen(false)} sx={{ color: "#111827" }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleGenerateQuotation}
            disabled={isGenerating}
            sx={{
              backgroundColor: siteSettings.addToCartColor,
              "&:hover": { backgroundColor: siteSettings.addToCartColor }
            }}
          >
            {isGenerating ? "Generating..." : "Generate & Send"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartPage;
