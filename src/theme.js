import { createTheme } from "@mui/material/styles";
import { Colors } from "./utils/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: Colors.primary,     // your primary
    },
    secondary: {
      main: Colors.secondary,   // your secondary
    },
    background: {
      default: Colors.background, // 👈 Global background color
      paper: "#ffffff14",        // card surfaces (glass effect)
    },
    text: {
      primary: Colors.text,
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {
    // GLOBAL TEXTFIELD STYLING
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: Colors.text,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: Colors.muted,       // default border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: Colors.muted,       // hover border
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: Colors.primary,     // focused border
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: Colors.muted,               // label color
          "&.Mui-focused": {
            color: Colors.primary,           // focused label
          },
        },
      },
    },

    // BUTTON GLOBAL STYLE
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: Colors.primary,
          "&:hover": {
            backgroundColor: Colors.primaryHover || Colors.primary,
          },
        },
        outlined: {
          borderColor: Colors.primary,
          color: Colors.primary,
          "&:hover": {
            borderColor: Colors.primaryHover || Colors.primary,
          },
        },
      },
    },
  },
});

export default theme;
