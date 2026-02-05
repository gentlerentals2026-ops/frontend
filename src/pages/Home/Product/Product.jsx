import { Box, Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useState } from "react";

export default function ProductPage() {
  const [showAll, setShowAll] = useState(false);

  const products = [
    { id: 1, name: "Royal Chair", price: "6,500", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Banquet Chair", price: "5,000", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Round Table", price: "10,000", image: "https://images.unsplash.com/photo-1690458774378-28766fa56d7a?w=900&auto=format&fit=crop&q=60" },
    { id: 4, name: "Rectangular Table", price: "12,000", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" },
    { id: 5, name: "Event Chair Deluxe", price: "7,000", image: "https://plus.unsplash.com/premium_photo-1724148017224-970f656ad0ed?w=900&auto=format&fit=crop&q=60" },
    { id: 6, name: "Classic Wooden Chair", price: "8,500", image: "https://images.unsplash.com/photo-1648579299658-2993cb1c9129?w=900&auto=format&fit=crop&q=60" },
    { id: 7, name: "White Folding Chair", price: "4,000", image: "https://images.unsplash.com/photo-1601014599619-869ce54a5d87?w=900&auto=format&fit=crop&q=60" },
    { id: 8, name: "Luxury Padded Chair", price: "9,500", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80" },
    { id: 9, name: "Glass Table Round", price: "14,000", image: "https://images.unsplash.com/photo-1668993280424-30a9fb91b6a5?w=900&auto=format&fit=crop&q=60" },
    { id: 10, name: "Coffee Table", price: "8,000", image: "https://plus.unsplash.com/premium_photo-1755706181305-b1275344a8c6?w=900&auto=format&fit=crop&q=60" }
  ];

  const isMobile = window.innerWidth < 768;

  // SHOW ONLY 5 ITEMS ON MOBILE UNLESS "VIEW MORE" IS CLICKED
  const displayedProducts =
    isMobile && !showAll ? products.slice(0, 5) : products;

  return (
    <Box sx={{ p: { xs: 2, md: 5 } }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
        Chairs & Tables For Rent
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {displayedProducts.map((item) => (
          <Grid
            item
            key={item.id}
            xs={6}
            md={4}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                width: 350,
                height: 380,
                borderRadius: 1,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
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
                  {item.name}
                </Typography>
                <Typography sx={{ mt: 1, color: "gray", fontWeight: 500 }}>
                  ₦{item.price}
                </Typography>
              </CardContent>

              <Button
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
                Add to Cart
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* VIEW MORE BUTTON (MOBILE ONLY) */}
      {isMobile && !showAll && (
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
