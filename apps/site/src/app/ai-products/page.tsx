import { redirect } from "next/navigation";

export default function AiProductsPage() {
  redirect("/products?filter=ai-products");
}
