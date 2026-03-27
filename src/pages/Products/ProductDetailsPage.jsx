import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProductService } from "../../services/products/Product";
import { useAddToCartMutation } from "../../services/api/cartApi";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const formatPrice = (price) => Number(price || 0).toLocaleString("en-NG");

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.appState);
  const { siteSettings } = useSiteSettings();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await ProductService.getProductBySlug(slug);
        const productData = response.data || null;
        setProduct(productData);
        setSelectedImage(productData?.imageUrl || productData?.images?.[0] || "");
        setSelectedQuantity(1);

        const listingResponse = await ProductService.getProducts();
        const related = (listingResponse.data || [])
          .filter((item) => item.slug !== slug)
          .slice(0, 3);
        setRelatedProducts(related);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/account");
      return;
    }

    addToCart({ productId: product._id, quantity: selectedQuantity })
      .unwrap()
      .then(() => setCartMessage(`${product.title} added to cart.`))
      .catch((cartError) => setCartMessage(cartError?.data?.message || "Unable to add product to cart."));
  };

  const galleryImages = product?.images?.length ? product.images : [product?.imageUrl].filter(Boolean);
  const averageRating = Number(product?.averageRating || 0);
  const reviewCount = Number(product?.reviewCount || product?.reviews?.length || 0);
  const isAvailable = product?.status === "available" && Number(product?.quantityAvailable || 0) > 0;

  if (isLoading) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>Loading listing...</Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 }, textAlign: "center" }}>
        <Typography sx={{ color: "error.main", mb: 2 }}>
          {error || "Listing not found."}
        </Typography>
        <Button component={RouterLink} to="/products" variant="contained" sx={{ backgroundColor: "orange" }}>
          Back to Listings
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
        background:
          "linear-gradient(180deg, rgba(255,247,237,0.85) 0%, rgba(255,255,255,1) 28%, rgba(248,250,252,1) 100%)"
      }}
    >
      <Button component={RouterLink} to="/products" sx={{ mb: 3, color: "#d97706" }}>
        Back to Listings
      </Button>

      {cartMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setCartMessage("")}>
          {cartMessage}
        </Alert>
      )}

      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.10)",
          overflow: "hidden"
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 3,
                  backgroundColor: "#f8fafc"
                }}
              >
                <Box
                  component="img"
                  src={selectedImage || product.imageUrl}
                  alt={product.title}
                  sx={{
                    width: "100%",
                    height: { xs: 320, md: 500 },
                    objectFit: "cover",
                    display: "block"
                  }}
                />
                <Chip
                  label={isAvailable ? "Available now" : "Currently unavailable"}
                  color={isAvailable ? "success" : "default"}
                  sx={{ position: "absolute", top: 16, left: 16 }}
                />
              </Box>

              {galleryImages.length > 1 && (
                <Stack direction="row" spacing={1.5} sx={{ overflowX: "auto", pb: 0.5 }}>
                  {galleryImages.map((image, index) => (
                    <Box
                      key={`${image}-${index}`}
                      component="button"
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      sx={{
                        border: selectedImage === image ? "2px solid #d97706" : "1px solid rgba(148, 163, 184, 0.35)",
                        borderRadius: 2,
                        p: 0,
                        lineHeight: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                        backgroundColor: "transparent"
                      }}
                    >
                      <Box
                        component="img"
                        src={image}
                        alt={`${product.title} preview ${index + 1}`}
                        sx={{ width: 92, height: 92, objectFit: "cover", display: "block" }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
                <Chip
                  label={product.status}
                  color={product.status === "available" ? "success" : "default"}
                  sx={{ width: "fit-content", textTransform: "capitalize" }}
                />
                <Chip label={product.category} variant="outlined" sx={{ textTransform: "capitalize" }} />
              </Stack>

              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {product.title}
              </Typography>

              <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
                <Rating value={averageRating} precision={0.5} readOnly />
                <Typography sx={{ color: "text.secondary" }}>
                  {averageRating ? `${averageRating} rating` : "No ratings yet"}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </Typography>
              </Stack>

              <Typography sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.8 }}>
                {product.description || "Quality event rental item available for bookings."}
              </Typography>

              <Typography sx={{ fontWeight: 800, fontSize: "2rem", color: "#d97706" }}>
                ₦{formatPrice(product.price)}
                <Typography component="span" sx={{ ml: 1, color: "text.secondary", fontSize: "1rem", fontWeight: 500 }}>
                  per item
                </Typography>
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  backgroundColor: "#fff7ed",
                  borderColor: "rgba(217, 119, 6, 0.18)"
                }}
              >
                <Stack spacing={1.2}>
                  <Typography sx={{ fontWeight: 800, color: "#9a3412" }}>Availability</Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {isAvailable
                      ? `${product.quantityAvailable} unit${product.quantityAvailable === 1 ? "" : "s"} ready for booking.`
                      : "This listing is currently unavailable for booking."}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Ideal for {product.category} setups, event halls, weddings, and styled receptions.
                  </Typography>
                </Stack>
              </Paper>

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Category:</strong> {product.category}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Available Units:</strong> {product.quantityAvailable}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Availability:</strong> {product.availabilityStatus || (isAvailable ? "In stock" : "Unavailable")}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Listing Code:</strong> {product.slug}</Typography>
                </Grid>
              </Grid>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid rgba(148, 163, 184, 0.35)",
                    borderRadius: 2,
                    px: 1,
                    minWidth: { xs: "100%", sm: 150 }
                  }}
                >
                  <IconButton
                    onClick={() => setSelectedQuantity((current) => Math.max(1, current - 1))}
                    disabled={selectedQuantity <= 1}
                    sx={{
                      color: "#111827",
                      border: "1px solid rgba(17, 24, 39, 0.22)",
                      backgroundColor: "#ffffff",
                      "&:hover": { backgroundColor: "#f3f4f6" },
                      "&.Mui-disabled": { color: "rgba(17, 24, 39, 0.35)" }
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ fontWeight: 700 }}>{selectedQuantity}</Typography>
                  <IconButton
                    onClick={() => setSelectedQuantity((current) => Math.min(Number(product.quantityAvailable || 1), current + 1))}
                    disabled={selectedQuantity >= Number(product.quantityAvailable || 1)}
                    sx={{
                      color: "#111827",
                      border: "1px solid rgba(17, 24, 39, 0.22)",
                      backgroundColor: "#ffffff",
                      "&:hover": { backgroundColor: "#f3f4f6" },
                      "&.Mui-disabled": { color: "rgba(17, 24, 39, 0.35)" }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  disabled={isAdding || !isAvailable}
                  sx={{
                    width: { xs: "100%", sm: "fit-content" },
                    backgroundColor: siteSettings.addToCartColor,
                    "&:hover": { backgroundColor: siteSettings.addToCartColor }
                  }}
                >
                  {!isAvailable ? "Unavailable" : isAuthenticated ? "Add to Cart" : "Login to Add"}
                </Button>
                <Button
                  component={RouterLink}
                  to="/cart"
                  variant="outlined"
                  sx={{ width: { xs: "100%", sm: "fit-content" } }}
                >
                  View Cart
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: { xs: 2.25, md: 3 }, borderRadius: 3, height: "100%" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              Product Overview
            </Typography>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.9 }}>
              {product.description || "This listing is prepared for event rentals and booking requests."}
            </Typography>
            <Divider sx={{ my: 2.5 }} />
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700, mb: 0.75 }}>Why clients book this item</Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                  Reliable presentation, clean finish, and event-ready setup quality for premium experiences.
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700, mb: 0.75 }}>Booking note</Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                  Add this listing to your cart to generate a quotation for your event date and location.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: { xs: 2.25, md: 3 }, borderRadius: 3, height: "100%" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              Customer Reviews
            </Typography>
            <Stack spacing={2}>
              {(product.reviews || []).length > 0 ? (
                product.reviews.map((review, index) => (
                  <Box
                    key={`${review.name}-${index}`}
                    sx={{ p: 2, borderRadius: 2, backgroundColor: "#f8fafc", border: "1px solid rgba(226, 232, 240, 0.9)" }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Avatar sx={{ bgcolor: "#fb923c", width: 36, height: 36 }}>
                        {(review.name || "V").trim().charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{review.name || "Verified customer"}</Typography>
                        <Rating value={Number(review.rating || 0)} readOnly size="small" />
                      </Box>
                    </Stack>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                      {review.comment || "Great rental experience."}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "text.secondary" }}>
                  Reviews will appear here once customers start sharing their booking experience.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2.5 }}>
            More Listings
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((item) => (
              <Grid item xs={12} md={4} key={item._id}>
                <Paper sx={{ p: 2, borderRadius: 3, height: "100%" }}>
                  <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.title}
                    sx={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 3, mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>{item.title}</Typography>
                  <Typography sx={{ color: "#d97706", fontWeight: 800, mb: 1 }}>
                    ₦{formatPrice(item.price)}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/products/${item.slug}`}
                    variant="contained"
                    sx={{
                      backgroundColor: siteSettings.addToCartColor,
                      "&:hover": { backgroundColor: siteSettings.addToCartColor }
                    }}
                  >
                    View Listing
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailsPage;
