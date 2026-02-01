import { Box, Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";

export default function ProductPage() {
  const products = [
    { id: 1, name: "Royal Chair", price: "6,500", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Banquet Chair", price: "5,000", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Round Table", price: "10,000", image: "https://images.unsplash.com/photo-1690458774378-28766fa56d7a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwM3x8fGVufDB8fHx8fA%3D%3D" },
    { id: 4, name: "Rectangular Table", price: "12,000", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" },
    { id: 5, name: "Event Chair Deluxe", price: "7,000", image: "https://plus.unsplash.com/premium_photo-1724148017224-970f656ad0ed?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwMXx8fGVufDB8fHx8fA%3D%3D" },
    { id: 6, name: "Classic Wooden Chair", price: "8,500", image: "https://images.unsplash.com/photo-1648579299658-2993cb1c9129?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExMXx8fGVufDB8fHx8fA%3D%3D" },
    { id: 7, name: "White Folding Chair", price: "4,000", image: "https://images.unsplash.com/photo-1601014599619-869ce54a5d87?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExNHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 8, name: "Luxury Padded Chair", price: "9,500", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80" },
    { id: 9, name: "Glass Table Round", price: "14,000", image: "https://images.unsplash.com/photo-1668993280424-30a9fb91b6a5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzMHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 10, name: "Coffee Table", price: "8,000", image: "https://plus.unsplash.com/premium_photo-1755706181305-b1275344a8c6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0N3x8fGVufDB8fHx8fA%3D%3D" },
    { id: 11, name: "VIP Chair", price: "12,500", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80" },
    { id: 12, name: "Leather Chair", price: "11,000", image: "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=800&q=80" },
    { id: 13, name: "Wedding Chair", price: "9,000", image: "https://images.unsplash.com/photo-1527244856687-f874354df6ee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2Nnx8fGVufDB8fHx8fA%3D%3D" },
    { id: 14, name: "Premium Chair", price: "10,500", image: "https://images.unsplash.com/photo-1636366939393-7afc5eaf7707?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwNHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 15, name: "Stainless Table", price: "15,000", image: "https://plus.unsplash.com/premium_photo-1749745201116-35ec7cc3c27e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5NXx8fGVufDB8fHx8fA%3D%3D" },
    { id: 16, name: "Party Table", price: "7,500", image: "https://plus.unsplash.com/premium_photo-1749745201116-35ec7cc3c27e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5NXx8fGVufDB8fHx8fA%3D%3D" },
    { id: 17, name: "Bar Chair", price: "6,000", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80" },
    { id: 18, name: "Outdoor Chair", price: "5,500", image: "https://plus.unsplash.com/premium_photo-1748876810565-c4df1a6b044c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIxNXx8fGVufDB8fHx8fA%3D%3D" },
    { id: 19, name: "Vintage Chair", price: "13,000", image: "https://plus.unsplash.com/premium_photo-1748876810565-c4df1a6b044c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIxNXx8fGVufDB8fHx8fA%3D%3D" },
    { id: 20, name: "Kids Table", price: "4,500", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 5 } }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
        Chairs & Tables For Rent
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {products.map((item) => (
          <Grid
            item
            key={item.id}
            xs={6}
            md={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                width: 350,
                height: 380,    // 🔥 increased height
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
                  height: 200,    // 🔥 reduced image height
                  objectFit: "cover",
                }}
              />

              {/* TEXT AREA */}
              <CardContent
                sx={{
                  textAlign: "center",
                  minHeight: 80,   // 🔥 fixed text area height
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  {item.name}
                </Typography>
                <Typography sx={{ mt: 1, color: "gray", fontWeight: 500 }}>
                  ₦{item.price}
                </Typography>
              </CardContent>

              {/* BUTTON ALWAYS AT BOTTOM */}
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
    </Box>
  );
}
