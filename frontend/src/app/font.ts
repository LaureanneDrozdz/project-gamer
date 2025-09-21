import localFont from "next/font/local";

export const Pacifico = localFont({
  src: [{ path: "../../public/assets/fonts/Pacifico-Regular.woff", weight: "400", style: "normal" }],
  variable: "--font-logo",
});

export const Raleway = localFont({
  src: [{ path: "../../public/assets/fonts/Raleway-VariableFont_wght.woff", weight: "100 900", style: "normal" }],
  variable: "--font-primary",
});

export const Roboto = localFont({
  src: [{ path: "../../public/assets/fonts/RobotoMono-VariableFont_wght.woff", weight: "100 700", style: "normal" }],
  variable: "--font-secondary",
});
