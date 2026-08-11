import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, Skeleton, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProductService } from "../../../services/products/Product";
import { useAddToCartMutation } from "../../../services/api/cartApi";
import { useSiteSettings } from "../../../context/SiteSettingsContext";

const skeletonItems = Array.from({ length: 8 }, (_, index) => index);
const orderNowKey = "gentle_events_order_now";

export default function ProductPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.appState);
  const { siteSettings } = useSiteSettings();
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await ProductService.getProducts();
        setProducts(response.data || []);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load products right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const displayedProducts = isMobile && !showAll ? products.slice(0, 5) : products;

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-NG");

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/account");
      return;
    }

    addToCart({ productId: product._id, quantity: 1 });
  };

  const handleOrderNow = (product) => {
    if (!isAuthenticated) {
      navigate("/account");
      return;
    }

    const orderItem = {
      productId: product._id,
      title: product.title,
      slug: product.slug,
      quantity: 1,
      unitPrice: Number(product.price) || 0,
      imageUrl: product.imageUrl,
      quantityAvailable: product.quantityAvailable,
      availableQuantity: product.availableQuantity,
      lineTotal: Number(product.price) || 0
    };

    sessionStorage.setItem(orderNowKey, JSON.stringify(orderItem));
    navigate("/generate-quotation", { state: { orderNowItem: orderItem } });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 } }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
        Chairs & Tables For Rent
      </Typography>

      {!isLoading && error && (
        <Typography sx={{ textAlign: "center", mb: 3, color: "error.main" }}>
          {error}
        </Typography>
      )}

      {!isLoading && !error && displayedProducts.length === 0 && (
        <Typography sx={{ textAlign: "center", mb: 3, color: "gray" }}>
          No rental items available yet.
        </Typography>
      )}

      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {isLoading &&
          skeletonItems.map((item) => (
            <Grid
              item
              key={`home-skeleton-${item}`}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <Card
                sx={{
                  width: "100%",
                  flex: 1,
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0
                }}
              >
                <Skeleton variant="rectangular" sx={{ width: "100%", aspectRatio: "16 / 10" }} />
                <CardContent sx={{ textAlign: "center", minHeight: 96, pb: 1 }}>
                  <Skeleton variant="text" sx={{ fontSize: "1.2rem", mx: "auto", width: "72%" }} />
                  <Skeleton variant="text" sx={{ fontSize: "1rem", mx: "auto", width: "38%" }} />
                </CardContent>
                <Stack spacing={1} sx={{ p: 1.5, pt: 0, mt: "auto" }}>
                  <Skeleton variant="rounded" sx={{ height: 42, borderRadius: 2 }} />
                  <Skeleton variant="rounded" sx={{ height: 42, borderRadius: 2 }} />
                  <Skeleton variant="rounded" sx={{ height: 42, borderRadius: 2 }} />
                </Stack>
              </Card>
            </Grid>
          ))}

        {displayedProducts.map((item) => (
            <Grid
            item
            key={item._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Card
              sx={{
                width: "100%",
                flex: 1,
                borderRadius: 3,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                minWidth: 0
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 10",
                  overflow: "hidden",
                  backgroundColor: "#f8fafc"
                }}
              >
                <CardMedia
                  component="img"
                  image={item.imageUrl}
                  alt={item.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </Box>

              <CardContent
                sx={{
                  textAlign: "center",
                  minHeight: 96,
                  pb: 1
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.4 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ mt: 1, color: "gray", fontWeight: 600 }}>
                  ₦{formatPrice(item.price)}
                </Typography>
              </CardContent>

              <Stack spacing={1} sx={{ mt: "auto", p: 1.5, pt: 0, pb: 1.5 }}>
                <Button
                  component={RouterLink}
                  to={`/products/${item.slug}`}
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: siteSettings.addToCartColor,
                    color: "white",
                    py: 1.15,
                    "&:hover": { backgroundColor: siteSettings.addToCartColor }
                  }}
                >
                  View Listing
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={isAdding}
                  onClick={() => handleAddToCart(item)}
                  sx={{
                    borderColor: siteSettings.addToCartColor,
                    color: siteSettings.addToCartColor,
                    backgroundColor: "#ffffff",
                    py: 1.15,
                    "&:hover": {
                      borderColor: siteSettings.addToCartColor,
                      color: siteSettings.addToCartColor,
                      backgroundColor: "rgba(255,255,255,0.96)"
                    }
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleOrderNow(item)}
                  sx={{
                    backgroundColor: "#111827",
                    py: 1.15,
                    "&:hover": { backgroundColor: "#111827" }
                  }}
                >
                  Order Now
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isMobile && !isLoading && !error && products.length > 5 && !showAll && (
        <Button
          variant="outlined"
          onClick={() => setShowAll(true)}
          sx={{
            mt: 3,
            display: "block",
            mx: "auto",
            borderColor: "orange",
            color: "orange",
            "&:hover": {
              borderColor: "#ff9800",
              backgroundColor: "rgba(255,165,0,0.1)",
            },
          }}
        >
          View More
        </Button>
      )}
    </Box>
  );
}
