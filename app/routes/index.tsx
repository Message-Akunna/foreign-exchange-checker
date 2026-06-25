import { redirect } from "react-router";

export function loader() {
  return redirect("/history");
}

export default function HomePage() {
  return null;
}
