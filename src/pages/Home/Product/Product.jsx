import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { ProductService } from "../../../services/products/Product";
import CatalogueGrid from "../../../components/Catalogue/CatalogueGrid";

export default function ProductPage() {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isMobile = useMediaQuery("(max-width: 767px)");

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

  return (
    <Box sx={{ p: { xs: 2, md: 5 } }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: { xs: "1.6rem", md: "2rem" }, mb: 3, textAlign: "center" }}>Chairs & Tables For Rent</Typography>
      {!isLoading && error && <Typography sx={{ textAlign: "center", mb: 3, color: "error.main" }}>{error}</Typography>}
      {!isLoading && !error && displayedProducts.length === 0 && <Typography sx={{ textAlign: "center", mb: 3, color: "gray" }}>No rental items available yet.</Typography>}
      <CatalogueGrid products={displayedProducts} isLoading={isLoading} skeletonCount={isMobile && !showAll ? 5 : 8} />
      {isMobile && !isLoading && !error && products.length > 5 && !showAll && (
        <Button variant="outlined" fullWidth onClick={() => setShowAll(true)} sx={{ mt: 3, color: "#a85b00", borderColor: "#a85b00" }}>View More</Button>
      )}
    </Box>
  );
}
