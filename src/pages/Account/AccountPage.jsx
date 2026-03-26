import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AccountService } from "../../services/account/account";
import { AuthService } from "../../services/auth/Auth";
import { setAccessToken, setIsAuthenticated, setUser } from "../../Redux/Reducers/appState";

const initialSignupState = {
  fullName: "",
  email: "",
  phone: "",
  password: ""
};

const initialLoginState = {
  email: "",
  password: ""
};

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.appState);

  const [tab, setTab] = useState(0);
  const [signupForm, setSignupForm] = useState(initialSignupState);
  const [loginForm, setLoginForm] = useState(initialLoginState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const heading = useMemo(
    () =>
      tab === 0
        ? {
            title: "Welcome back",
            subtitle: "Login to manage your rentals and continue browsing listings."
          }
        : {
            title: "Create your account",
            subtitle: "Sign up to book rentals faster and keep track of your activity."
          },
    [tab]
  );

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError("");
    setSuccess("");
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;
    setSignupForm((current) => ({ ...current, [name]: value }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const persistAuth = (payload) => {
    dispatch(setUser(payload.user));
    dispatch(setIsAuthenticated(true));
    dispatch(setAccessToken(payload.token));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!signupForm.fullName || !signupForm.email || !signupForm.password) {
      setError("Full name, email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await AccountService.register(signupForm);
      persistAuth(response.data);
      setSuccess(response.message || "Account created successfully.");
      setSignupForm(initialSignupState);
      navigate("/products");
    } catch (signupError) {
      setError(signupError.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!loginForm.email || !loginForm.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await AuthService.login(loginForm);
      persistAuth(response.data);
      setSuccess(response.message || "Login successful.");
      setLoginForm(initialLoginState);
      navigate("/products");
    } catch (loginError) {
      setError(loginError.message || "Unable to login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 160px)",
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 7 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, rgba(245, 158, 11, 0.18), transparent 30%), linear-gradient(135deg, #fff7ed 0%, #ffffff 38%, #f8fafc 100%)"
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid rgba(217, 119, 6, 0.10)",
          boxShadow: "0 28px 80px rgba(15, 23, 42, 0.12)"
        }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            color: "#fff",
            background:
              "linear-gradient(160deg, rgba(194, 65, 12, 0.95) 0%, rgba(249, 115, 22, 0.92) 50%, rgba(251, 191, 36, 0.88) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 4
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.18rem", mb: 2 }}>
              G-RENTALS ACCOUNT
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 2 }}>
              Book event rentals with less back and forth.
            </Typography>
            <Typography sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "rgba(255,255,255,0.90)" }}>
              Create an account or log in to keep your details ready, browse listings faster, and stay connected to
              your rental requests.
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.14)", backdropFilter: "blur(10px)" }}>
              <Typography sx={{ fontWeight: 700, mb: 0.75 }}>Fast booking flow</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.88)" }}>
                Browse chairs and tables, open a listing, and continue from a saved account.
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
              <Typography sx={{ fontWeight: 700, mb: 0.75 }}>Simple account access</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.88)" }}>
                Use your email and password to sign in anytime and pick up where you left off.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "#ffffff" }}>
          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          <Typography variant="h4" sx={{ color: "#111827", fontWeight: 800, mb: 1 }}>
            {heading.title}
          </Typography>
          <Typography sx={{ color: "#6b7280", mb: 3 }}>{heading.subtitle}</Typography>

          {isAuthenticated && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Signed in as {user?.fullName || user?.email || "your account"}.
            </Alert>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {tab === 0 ? (
            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  fullWidth
                />
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSignup}>
              <Stack spacing={2.5}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={signupForm.fullName}
                  onChange={handleSignupChange}
                  fullWidth
                />
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  fullWidth
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={signupForm.phone}
                  onChange={handleSignupChange}
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  fullWidth
                />
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography sx={{ color: "#6b7280", textAlign: "center" }}>
            {tab === 0 ? "Need an account?" : "Already have an account?"}{" "}
            <Button
              variant="text"
              onClick={() => {
                setTab(tab === 0 ? 1 : 0);
                setError("");
                setSuccess("");
              }}
              sx={{ p: 0, minWidth: "auto", verticalAlign: "baseline" }}
            >
              {tab === 0 ? "Sign up here" : "Login here"}
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AccountPage;
