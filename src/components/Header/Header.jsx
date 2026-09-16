import * as React from "react";
import { Badge, Box, Button, Container, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { Link as RouterLink, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthService } from "../../services/auth/Auth";
import { setAccessToken, setIsAuthenticated, setUser } from "../../Redux/Reducers/appState";
import { cartApi, useGetCartQuery } from "../../services/api/cartApi";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { ProductService } from "../../services/products/Product";
import { downloadBrochurePdf } from "../../utils/brochure";
import "./Header.css";

const pages = [
  { label: "Home", path: "/" },
  { label: "Rentals", path: "/products" },
  { label: "Services", path: "/#services" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Account", path: "/account" },
  { label: "Cart", path: "/cart" }
];

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.appState);
  const { siteSettings } = useSiteSettings();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [isPreparingBrochure, setIsPreparingBrochure] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [rentalsAnchor, setRentalsAnchor] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [categoryStatus, setCategoryStatus] = React.useState("idle");
  const headerRef = React.useRef(null);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const { data: cartResponse } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const items = cartResponse?.data?.items || [];
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    setSearch(new URLSearchParams(location.search).get("q") || "");
    setAnchorElNav(null);
    setRentalsAnchor(null);
  }, [location.pathname, location.search, location.hash]);

  React.useLayoutEffect(() => {
    const measure = () => setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (location.pathname === "/" && location.hash === "#services") {
      const section = document.getElementById("services");
      if (section) window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - headerHeight - 16 });
    }
  }, [location.pathname, location.hash, headerHeight]);

  const handleLogout = async () => {
    setAnchorElNav(null);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(setUser({}));
      dispatch(setIsAuthenticated(false));
      dispatch(setAccessToken(""));
      dispatch(cartApi.util.resetApiState());
    }
  };

  const handleDownloadBrochure = async () => {
    if (siteSettings.brochureUrl) {
      window.open(siteSettings.brochureUrl, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      setIsPreparingBrochure(true);
      const response = await ProductService.getProducts();
      downloadBrochurePdf({ siteSettings, products: response?.data || [] });
    } catch (error) {
      console.error("Unable to prepare brochure:", error);
      downloadBrochurePdf({ siteSettings, products: [] });
    } finally {
      setIsPreparingBrochure(false);
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?${new URLSearchParams({ q: query })}` : "/products");
  };

  const openRentals = async (event) => {
    const trigger = event.currentTarget;
    setRentalsAnchor((current) => current || trigger);
    if (categoryStatus === "loaded" || categoryStatus === "loading") return;
    setCategoryStatus("loading");
    try {
      const response = await ProductService.getProducts();
      setCategories([...new Set((response.data || []).map((product) => product.category).filter(Boolean))].sort());
      setCategoryStatus("loaded");
    } catch {
      setCategoryStatus("error");
    }
  };

  return (
    <>
      <Box component="header" ref={headerRef} className="customer-header" style={{ "--header-brand": siteSettings.topBarColor }}>
        <Container maxWidth="xl">
          <div className="customer-header__brand-row">
            <RouterLink to="/" className="customer-header__logo" aria-label={`${siteSettings.siteName || "Gentle Events"} home`}>
              {siteSettings.logoUrl ? <img src={siteSettings.logoUrl} alt={siteSettings.siteName || "Gentle Events"} /> : <span>{siteSettings.siteName || "Gentle Events"}</span>}
            </RouterLink>
            <div className="customer-header__account">
              <RouterLink to="/account">{isAuthenticated ? user?.fullName?.split(" ")[0] || "Account" : "Account"}</RouterLink>
              {isAuthenticated && <Button onClick={handleLogout} color="inherit">Logout</Button>}
            </div>
            <IconButton component={RouterLink} to="/cart" aria-label={`View cart, ${cartCount} items`} sx={{ color: "#171717", width: 48, height: 48, flexShrink: 0 }}>
              <Badge badgeContent={cartCount} showZero color="error" max={999}><ShoppingCartIcon sx={{ fontSize: 30 }} /></Badge>
            </IconButton>
          </div>
          <form role="search" aria-label="Catalogue" className="customer-header__search" onSubmit={submitSearch}>
            <SearchIcon aria-hidden="true" />
            <input type="search" aria-label="Search catalogue" placeholder="Search catalogue" enterKeyHint="search" value={search} onChange={(event) => setSearch(event.target.value)} />
            <button type="submit">Search</button>
          </form>
          <nav className="customer-header__nav" aria-label="Main navigation">
            <IconButton id="navigation-toggle" aria-label="Open navigation menu" aria-controls={anchorElNav ? "customer-navigation" : undefined} aria-haspopup="true" aria-expanded={Boolean(anchorElNav)} onClick={(event) => setAnchorElNav(event.currentTarget)} sx={{ color: "inherit", width: 44, height: 44, flexShrink: 0 }}><MenuIcon /></IconButton>
            {pages.slice(0, 4).map((page) => page.label === "Rentals" ?
              <div key={page.label} className="customer-header__rentals">
                <NavLink to="/products">Rentals</NavLink>
                <IconButton id="rentals-toggle" aria-label="Rental categories" aria-haspopup="true" aria-expanded={Boolean(rentalsAnchor)} aria-controls={rentalsAnchor ? "rental-categories" : undefined} onClick={openRentals} size="small" color="inherit"><ExpandMoreIcon fontSize="small" /></IconButton>
              </div> : page.label === "Services" ?
              <RouterLink key={page.label} to={page.path}>{page.label}</RouterLink> :
              <NavLink key={page.label} to={page.path} end={page.path === "/"}>{page.label}</NavLink>
            )}
            <RouterLink to="/contact" className="customer-header__contact">Contact</RouterLink>
          </nav>
          <div className="customer-header__brochure">
            <span>Explore our rental collection</span>
            <Button onClick={handleDownloadBrochure} disabled={isPreparingBrochure} startIcon={<DownloadRoundedIcon />} color="inherit" size="small">{isPreparingBrochure ? "Preparing Brochure..." : "Download Our Brochure"}</Button>
          </div>
        </Container>
        <Menu id="rental-categories" anchorEl={rentalsAnchor} open={Boolean(rentalsAnchor)} onClose={() => setRentalsAnchor(null)} MenuListProps={{ "aria-labelledby": "rentals-toggle" }} PaperProps={{ sx: { maxWidth: "calc(100vw - 32px)", bgcolor: "#fff", color: "#171717" } }}>
          <MenuItem component={RouterLink} to="/products" onClick={() => setRentalsAnchor(null)}>All rentals</MenuItem>
          {categoryStatus === "loading" && <MenuItem disabled>Loading categories...</MenuItem>}
          {categoryStatus === "error" && <MenuItem onClick={openRentals}>Unable to load categories. Retry</MenuItem>}
          {categories.map((category) => <MenuItem key={category} component={RouterLink} to={`/products?${new URLSearchParams({ category })}`} onClick={() => setRentalsAnchor(null)} sx={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>{category}</MenuItem>)}
        </Menu>
        <Menu id="customer-navigation" anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={() => setAnchorElNav(null)} MenuListProps={{ "aria-labelledby": "navigation-toggle" }} PaperProps={{ sx: { width: 250, maxWidth: "calc(100vw - 32px)", bgcolor: "#fff", color: "#171717" } }}>
          {pages.map((page) => <MenuItem key={page.label} component={RouterLink} to={page.path} onClick={() => setAnchorElNav(null)}>{page.label}</MenuItem>)}
          {isAuthenticated && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
        </Menu>
      </Box>
      {/* Match the actual header height, including loaded logos and wrapped text. */}
      <div aria-hidden="true" style={{ height: headerHeight }} />
    </>
  );
};

export default AppHeader;
