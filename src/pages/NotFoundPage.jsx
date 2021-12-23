import { useLocation } from "react-router";

//Onbekende url's opvangen met deze pagina

export default function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <div className="text-red-600 font-extrabold text-3xl">
      <p>De webpagina met als url {pathname} bestaat niet.</p>
    </div>
  );
}
