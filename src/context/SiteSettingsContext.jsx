import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../constant/apiConstant";
import { defaultSiteSettings, setSiteSettings } from "../Redux/Reducers/appState";

const SiteSettingsContext = createContext({
  siteSettings: defaultSiteSettings,
  isLoading: true
});

export const SiteSettingsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const siteSettings = useSelector((state) => state.appState?.siteSettings || defaultSiteSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API.BASE_URL}/api/site-settings`);
        const json = await response.json();

        if (response.ok && json?.data) {
          dispatch(setSiteSettings(json.data));
        }
      } catch (error) {
        console.error("Unable to load site settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [dispatch]);

  const value = useMemo(
    () => ({
      siteSettings: { ...defaultSiteSettings, ...(siteSettings || {}) },
      isLoading
    }),
    [siteSettings, isLoading]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
