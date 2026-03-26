import { Alert, Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProductService } from "../../services/products/Product";
import { useAddToCartMutation } from "../../services/api/cartApi";

const formatPrice = (price) => Number(price || 0).toLocaleString("en-NG");

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.appState);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await ProductService.getProductBySlug(slug);
        const productData = response.data || null;
        setProduct(productData);

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

    addToCart({ productId: product._id })
      .unwrap()
      .then(() => setCartMessage(`${product.title} added to cart.`))
      .catch((cartError) => setCartMessage(cartError?.data?.message || "Unable to add product to cart."));
  };

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
    <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Button component={RouterLink} to="/products" sx={{ mb: 3, color: "#d97706" }}>
        Back to Listings
      </Button>

      {cartMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setCartMessage("")}>
          {cartMessage}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: "0 24px 60px rgba(15, 23, 42, 0.10)" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.title}
              sx={{
                width: "100%",
                height: { xs: 320, md: 500 },
                objectFit: "cover",
                borderRadius: 3
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Chip
                label={product.status}
                color={product.status === "available" ? "success" : "default"}
                sx={{ width: "fit-content", textTransform: "capitalize" }}
              />

              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {product.title}
              </Typography>

              <Typography sx={{ color: "text.secondary", fontSize: "1.1rem", lineHeight: 1.8 }}>
                {product.description || "Quality event rental item available for bookings."}
              </Typography>

              <Typography sx={{ fontWeight: 800, fontSize: "2rem", color: "#d97706" }}>
                ₦{formatPrice(product.price)}
              </Typography>

              <Divider />

              <Typography><strong>Category:</strong> {product.category}</Typography>
              <Typography><strong>Available Units:</strong> {product.quantityAvailable}</Typography>
              <Typography><strong>Listing Code:</strong> {product.slug}</Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  sx={{
                    width: { xs: "100%", sm: "fit-content" },
                    backgroundColor: "orange",
                    "&:hover": { backgroundColor: "#f59e0b" }
                  }}
                >
                  {isAuthenticated ? "Add to Cart" : "Login to Add"}
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
                  <Button component={RouterLink} to={`/products/${item.slug}`} variant="outlined">
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
