import React from "react";

const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/2348148928379"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#25D366",
        color: "#fff",
        width: "55px",
        height: "55px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "28px",
        zIndex: 9999,
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        textDecoration: "none",
      }}
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
};

export default WhatsAppFloat;
