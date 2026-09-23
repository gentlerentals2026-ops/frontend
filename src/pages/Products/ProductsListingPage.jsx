import { Box, Typography, Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductService } from "../../services/products/Product";
import CatalogueGrid from "../../components/Catalogue/CatalogueGrid";
import { scrollToCatalogue } from "../../utils/catalogueSearch";
import { matchesCategorySearch } from "../../utils/productCategories";
import CategoryFilter from "../../components/Catalogue/CategoryFilter";

const ProductsListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLocaleLowerCase();
  const category = searchParams.get("category") || "";
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const displayedProducts = products.filter((product) =>
    matchesCategorySearch(product, category, query)
  );

  useEffect(() => {
    if (!isLoading && query) scrollToCatalogue("catalogue-results");
  }, [query, isLoading]);

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

  return (
    <Box id="catalogue-results" sx={{ px: { xs: 2, md: 6 }, py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 1, textAlign: "center" }}>Rental Listings</Typography>
      <Typography sx={{ color: "#616161", textAlign: "center", mb: 3 }}>Browse chairs and tables available for your events.</Typography>
      {!isLoading && !error && <CategoryFilter products={products} />}
      {!isLoading && error && <Typography sx={{ textAlign: "center", color: "error.main" }}>{error}</Typography>}
      {!isLoading && !error && displayedProducts.length === 0 && <Typography role="status" sx={{ textAlign: "center", color: "#616161" }}>{query ? `No rental items found for '${searchParams.get("q").trim()}'.` : category ? "No listings match your category." : "No listings available yet."}</Typography>}
      {query && <Box sx={{ textAlign: "center", mb: 2 }}><Button onClick={() => { const next = new URLSearchParams(searchParams); next.delete("q"); setSearchParams(next); }}>Clear Search</Button></Box>}
      <CatalogueGrid products={displayedProducts} isLoading={isLoading} />
    </Box>
  );
};

export default ProductsListingPage;
