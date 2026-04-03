import React from "react";

type BrandLogoProps = {
  variant?: "full" | "mark";
  className?: string;
  alt?: string;
};

const sources = {
  full: "/crm-logo.svg",
  mark: "/favicon.svg",
};

const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  className = "",
  alt = "CRM logo",
}) => {
  return <img src={sources[variant]} alt={alt} className={className} />;
};

export default BrandLogo;
