import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Mantenimiento de Equipos",
  description: "Mantenimiento de equipos y hojas de vida con plano de ubicación",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}