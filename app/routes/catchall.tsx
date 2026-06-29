export function loader() {
  throw new Response("Not Found", { status: 404 });
}

export default function Catchall() {
  return null;
}
