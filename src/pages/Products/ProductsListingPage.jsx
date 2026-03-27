import { Alert, Box, Button, Card, CardContent, Chip, Grid, Rating, Skeleton, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProductService } from "../../services/products/Product";
import { useAddToCartMutation } from "../../services/api/cartApi";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const formatPrice = (price) => Number(price || 0).toLocaleString("en-NG");
const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

const ProductsListingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.appState);
  const { siteSettings } = useSiteSettings();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await ProductService.getProducts();
        setProducts(response.data || []);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load listings.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/account");
      return;
    }

    addToCart({ productId: product._id })
      .unwrap()
      .then(() => setCartMessage(`${product.title} added to cart.`))
      .catch((cartError) => setCartMessage(cartError?.data?.message || "Unable to add product to cart."));
  };

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textAlign: "center" }}>
        Rental Listings
      </Typography>
      <Typography sx={{ color: "text.secondary", textAlign: "center", mb: 5 }}>
        Browse chairs and tables available for your events.
      </Typography>

      {!isLoading && error && (
        <Typography sx={{ textAlign: "center", color: "error.main" }}>
          {error}
        </Typography>
      )}

      {!isLoading && !error && products.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No listings available yet.
        </Typography>
      )}

      {cartMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setCartMessage("")}>
          {cartMessage}
        </Alert>
      )}

      <Grid container spacing={3} justifyContent="center">
        {isLoading &&
          skeletonItems.map((item) => (
            <Grid item xs={12} sm={6} lg={4} key={`listing-skeleton-${item}`} sx={{ display: "flex", justifyContent: "center" }}>
              <Card
                sx={{
                  width: "100%",
                  maxWidth: 380,
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.10)",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Skeleton variant="rectangular" sx={{ height: 260 }} />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                    <Skeleton variant="text" sx={{ fontSize: "1.45rem", width: "55%" }} />
                    <Skeleton variant="rounded" sx={{ width: 80, height: 24 }} />
                  </Box>
                  <Skeleton variant="text" sx={{ fontSize: "1rem", width: "95%" }} />
                  <Skeleton variant="text" sx={{ fontSize: "1rem", width: "78%" }} />
                  <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: "34%" }} />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Skeleton variant="text" sx={{ fontSize: "1rem", width: 90 }} />
                    <Skeleton variant="text" sx={{ fontSize: "1rem", width: 80 }} />
                  </Stack>
                  <Skeleton variant="text" sx={{ fontSize: "1rem", width: "45%" }} />
                  <Skeleton variant="text" sx={{ fontSize: "1rem", width: "38%" }} />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: "auto" }}>
                    <Skeleton variant="rounded" sx={{ height: 40, flex: 1 }} />
                    <Skeleton variant="rounded" sx={{ height: 40, flex: 1 }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}

        {products.map((product) => (
          <Grid item xs={12} sm={6} lg={4} key={product._id} sx={{ display: "flex", justifyContent: "center" }}>
            <Card
              sx={{
                width: "100%",
                maxWidth: 380,
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.10)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Box component="img" src={product.imageUrl} alt={product.title} sx={{ height: 260, width: "100%", objectFit: "cover" }} />
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {product.title}
                  </Typography>
                  <Chip
                    label={product.status}
                    color={product.status === "available" ? "success" : "default"}
                    size="small"
                  />
                </Box>

                <Typography sx={{ color: "text.secondary", minHeight: 48 }}>
                  {product.description || "Quality rental item for your events."}
                </Typography>

                <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#d97706" }}>
                  ₦{formatPrice(product.price)}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={Number(product.averageRating || 0)} precision={0.5} readOnly size="small" />
                  <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                    {product.reviewCount || 0} reviews
                  </Typography>
                </Stack>

                <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                  Available units: {product.quantityAvailable}
                </Typography>

                <Typography sx={{ color: product.availabilityStatus === "In stock" ? "success.main" : "error.main", fontSize: "0.95rem", fontWeight: 600 }}>
                  {product.availabilityStatus || "Availability pending"}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: "auto" }}>
                  <Button
                    component={RouterLink}
                    to={`/products/${product.slug}`}
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: siteSettings.addToCartColor,
                      "&:hover": { backgroundColor: siteSettings.addToCartColor }
                    }}
                  >
                    View Listing
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleAddToCart(product)}
                    disabled={isAdding || product.availabilityStatus !== "In stock"}
                    sx={{
                      backgroundColor: siteSettings.addToCartColor,
                      "&:hover": { backgroundColor: siteSettings.addToCartColor }
                    }}
                  >
                    {product.availabilityStatus !== "In stock"
                      ? "Unavailable"
                      : isAuthenticated
                        ? "Add to Cart"
                        : "Login to Add"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsListingPage;
