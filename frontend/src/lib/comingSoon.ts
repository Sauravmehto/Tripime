import Swal from "sweetalert2";

export function showComingSoon(product: string) {
  return Swal.fire({
    title: `${product} booking is coming soon`,
    text: "This mock demo currently supports flight search and booking only.",
    icon: "info",
    confirmButtonText: "Got it",
    confirmButtonColor: "#2563eb",
  });
}
