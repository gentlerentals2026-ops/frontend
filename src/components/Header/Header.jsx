import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeckIcon from '@mui/icons-material/Deck';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthService } from "../../services/auth/Auth";
import { setAccessToken, setIsAuthenticated, setUser } from "../../Redux/Reducers/appState";
import { cartApi, useGetCartQuery } from "../../services/api/cartApi";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { ProductService } from "../../services/products/Product";
import { downloadBrochurePdf } from "../../utils/brochure";

const pages = [
  { label: "HOME", path: "/" },
  { label: "PRODUCTS", path: "/products" },
  { label: "ABOUT", path: "/about" },
  { label: "CONTACT", path: "/contact" },
  { label: "ACCOUNT", path: "/account" },
  { label: "CART", path: "/cart" }
];

const AppHeader = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.appState);
  const { siteSettings } = useSiteSettings();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [isPreparingBrochure, setIsPreparingBrochure] = React.useState(false);
  const { data: cartResponse } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const items = cartResponse?.data?.items || [];
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
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
      downloadBrochurePdf({
        siteSettings,
        products: response?.data || []
      });
    } catch (error) {
      console.error("Unable to prepare brochure:", error);
      downloadBrochurePdf({
        siteSettings,
        products: []
      });
    } finally {
      setIsPreparingBrochure(false);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: siteSettings.topBarColor,
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.18)",
          backgroundColor: "rgba(0,0,0,0.14)"
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              minHeight: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              py: 0.75,
              flexWrap: "wrap"
            }}
          >
            <Typography sx={{ color: "white", fontSize: { xs: "0.82rem", md: "0.92rem" }, fontWeight: 600 }}>
              Download our brochure for a quick look at our rental collection.
            </Typography>
            <Button
              startIcon={<DownloadRoundedIcon />}
              variant="contained"
              size="small"
              onClick={handleDownloadBrochure}
              disabled={isPreparingBrochure}
              sx={{
                backgroundColor: "white",
                color: siteSettings.topBarColor,
                px: 2,
                fontWeight: 700,
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.92)"
                }
              }}
            >
              {isPreparingBrochure ? "Preparing Brochure..." : "Download Our Brochure"}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Desktop Logo */}
          {siteSettings.logoUrl ? (
            <Box
              component={RouterLink}
              to="/"
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", mr: 3 }}
            >
              <Box component="img" src={siteSettings.logoUrl} alt={siteSettings.siteName} sx={{ height: 42, width: "auto" }} />
            </Box>
          ) : (
            <>
              <DeckIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                component={RouterLink}
                to="/"
                variant="h6"
                noWrap
                sx={{
                  mr: 4,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'Montserrat',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                {siteSettings.siteName || "G-Rentals"}
              </Typography>
            </>
          )}

          {/* Mobile Hamburger Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile Dropdown Menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              PaperProps={{
                sx: {
                  width: '250px',   // 📌 wider mobile dropdown
                  backgroundColor: '#111',
                  color: 'white',
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.label}
                  component={RouterLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ textAlign: 'left' }}>
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          {siteSettings.logoUrl ? (
            <Box
              component={RouterLink}
              to="/"
              sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", flexGrow: 1 }}
            >
              <Box component="img" src={siteSettings.logoUrl} alt={siteSettings.siteName} sx={{ height: 36, width: "auto" }} />
            </Box>
          ) : (
            <>
              <DeckIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                component={RouterLink}
                to="/"
                variant="h5"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'Montserrat',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
               {siteSettings.siteName?.toUpperCase() || "G-RENTALS"}
              </Typography>
            </>
          )}

          {/* Desktop Menu Items */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  fontSize: '16px',
                  px: 3,              // 📌 wider spacing
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          {/* User Avatar Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Tooltip title="View cart">
              <IconButton component={RouterLink} to="/cart" color="inherit">
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon sx={{ color: "white" }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Button
              component={RouterLink}
              to="/account"
              sx={{ color: "white", display: { xs: "none", md: "inline-flex" } }}
            >
              {isAuthenticated ? user?.fullName?.split(" ")[0] || "Account" : "Account"}
            </Button>

            {isAuthenticated && (
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.55)",
                  display: { xs: "none", md: "inline-flex" },
                  "&:hover": { borderColor: "white" }
                }}
              >
                Logout
              </Button>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppHeader;
