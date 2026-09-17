import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Box, Button, Typography } from "@mui/material";
import { API } from "../../constant/apiConstant";
export default function EmailPreferences() {
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const unsubscribe = async () => {
    setBusy(true); setError("");
    try {
      const response = await fetch(`${API.BASE_URL}/api/announcements/unsubscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: params.get("token") }) });
      if (!response.ok) throw new Error("Unable to unsubscribe. Check your link or contact support.");
      setDone(true);
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  };
  return <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}><Typography variant="h4">Email preferences</Typography><Typography sx={{ my: 2 }}>Stop receiving Gentle Events announcements. Account security and rental transaction emails are unaffected.</Typography>{error && <Alert severity="error">{error}</Alert>}{done ? <Alert severity="success">You have been unsubscribed from announcements.</Alert> : <Button variant="contained" disabled={busy || !params.get("token")} onClick={unsubscribe}>Unsubscribe from announcements</Button>}</Box>;
}
