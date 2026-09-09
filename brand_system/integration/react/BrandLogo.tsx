import React from "react";

export type LogoOrientation = "horizontal" | "vertical";
export type LogoVariant = "color" | "blanco" | "negro";

export interface BrandLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  orientation?: LogoOrientation;
  variant?: LogoVariant;
  alt?: string;
  className?: string;
}

/**
 * Componente React para desplegar el Logotipo oficial de Jardines de Mazaltepec.
 * Reglas de uso:
 * - Zona de respeto: el ancho de un rombo en los 4 lados.
 * - Ancho mínimo digital: 100px para horizontal, 40px para isotipo.
 * - Sobre fotografía: utilizar siempre la variante `blanco`.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  orientation = "horizontal",
  variant = "color",
  alt = "Jardines de Mazaltepec",
  className = "",
  ...props
}) => {
  const fileName = `jm-${orientation}-${variant}.svg`;
  const logoPath = `/brand_system/assets/logo/${fileName}`;

  return (
    <img
      src={logoPath}
      alt={alt}
      className={`brand-logo brand-logo--${orientation} brand-logo--${variant} ${className}`}
      {...props}
    />
  );
};

export default BrandLogo;
