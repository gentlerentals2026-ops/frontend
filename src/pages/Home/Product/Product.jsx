import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, Skeleton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductService } from "../../../services/products/Product";

const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

export default function ProductPage() {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

      <Grid container spacing={3} justifyContent="center">
        {isLoading &&
          skeletonItems.map((item) => (
            <Grid
              item
              key={`home-skeleton-${item}`}
              xs={6}
              md={4}
              lg={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={{
                  width: 350,
                  height: 380,
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Skeleton variant="rectangular" sx={{ height: 200 }} />
                <CardContent sx={{ textAlign: "center", minHeight: 80 }}>
                  <Skeleton variant="text" sx={{ fontSize: "1.2rem", mx: "auto", width: "72%" }} />
                  <Skeleton variant="text" sx={{ fontSize: "1rem", mx: "auto", width: "38%" }} />
                </CardContent>
                <Skeleton variant="rectangular" sx={{ mt: "auto", height: 49, borderRadius: 0 }} />
              </Card>
            </Grid>
          ))}

        {displayedProducts.map((item) => (
          <Grid
            item
            key={item._id}
            xs={6}
            md={4}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                width: 350,
                height: 380,
                borderRadius: 3,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                image={item.imageUrl}
                alt={item.title}
                sx={{
                  height: 200,
                  objectFit: "cover",
                }}
              />

              <CardContent
                sx={{
                  textAlign: "center",
                  minHeight: 80,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  {item.title}
                </Typography>
                <Typography sx={{ mt: 1, color: "gray", fontWeight: 500 }}>
                  ₦{formatPrice(item.price)}
                </Typography>
              </CardContent>

              <Button
                component={RouterLink}
                to={`/products/${item.slug}`}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "orange",
                  color: "white",
                  borderRadius: 0,
                  py: 1.3,
                  "&:hover": { backgroundColor: "#ff9800" },
                }}
              >
                View Listing
              </Button>
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
