import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API } from "../constant/apiConstant";

const defaultSiteSettings = {
  siteName: "Gentle Renters",
  logoUrl: "",
  topBarColor: "#f59e0b",
  addToCartColor: "#f59e0b",
  sliderImages: [
    "https://plus.unsplash.com/premium_photo-1679280550151-4c56e920b277?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY5fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1722768331920-eeedb2e1c73f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDkxfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1714520270545-937450f41506?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1754407189758-fde7fb4394ad?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D"
  ],
  sliderSpeed: 3000
};

const SiteSettingsContext = createContext({
  siteSettings: defaultSiteSettings,
  isLoading: true
});

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`${API.BASE_URL}/api/site-settings`);
        const json = await response.json();

        if (response.ok && json?.data) {
          setSiteSettings({
            ...defaultSiteSettings,
            ...json.data
          });
        }
      } catch (error) {
        console.error("Unable to load site settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const value = useMemo(() => ({ siteSettings, isLoading }), [siteSettings, isLoading]);

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
