import React from "react";

export type IconName =
  | "alberca"
  | "calendario"
  | "cancha"
  | "email"
  | "estacionamiento"
  | "estilo-de-vida"
  | "gimnasio"
  | "juegos-infantiles"
  | "medidas"
  | "padel"
  | "plusvalia"
  | "proyecto"
  | "seguridad"
  | "senderos"
  | "sustentabilidad"
  | "telefono"
  | "trato"
  | "ubicacion"
  | "whats";

export interface BrandIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: IconName;
  size?: number | string;
  className?: string;
}

/**
 * Componente React para desplegar la colección oficial de 19 Iconos de Jardines de Mazaltepec.
 * Lienzo nativo: 100x100px SVG en `currentColor`.
 */
export const BrandIcon: React.FC<BrandIconProps> = ({
  name,
  size = 24,
  className = "",
  style,
  ...props
}) => {
  const iconPath = `/brand_system/assets/icons/${name}.svg`;

  return (
    <img
      src={iconPath}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={`brand-icon brand-icon--${name} ${className}`}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  );
};

export default BrandIcon;
