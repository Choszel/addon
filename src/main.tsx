import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "./others/AuthContext.tsx";

const theme = extendTheme({
  fonts: {
    heading: "Montserrat, sans-serif",
    body: "Montserrat, sans-serif",
  },
  styles: {
    global: {
      body: {
        backgroundColor: "var(--background)",
        fontFamily: "Montserrat, sans-serif",
        color: "var(--copy)",
      },
      // "@media screen and (max-width: 62em)": {
      //   body: {
      //     backgroundColor: "var(--background_color)",
      //     fontFamily: "Montserrat, sans-serif",
      //     color: "var(--neutral1)",
      //     position: "absolute",
      //   },
      // },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>
);
