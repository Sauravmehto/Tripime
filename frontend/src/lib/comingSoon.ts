import Swal from "sweetalert2";
import { HELPLINE_DISPLAY, telLink, whatsappLink } from "./contact";

export async function showComingSoon(product: string) {
  const result = await Swal.fire({
    title: `${product} booking is launching soon`,
    html: `We're not taking online ${product.toLowerCase()} bookings just yet. Call or WhatsApp our travel experts at <strong>${HELPLINE_DISPLAY}</strong> and we'll help you sort it out directly.`,
    icon: "info",
    confirmButtonText: "Call now",
    confirmButtonColor: "#2563eb",
    showCancelButton: true,
    cancelButtonText: "WhatsApp instead",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    window.location.href = telLink();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    window.open(whatsappLink(`Hi Tripime, I'd like help booking a ${product.toLowerCase()}.`), "_blank");
  }
}
