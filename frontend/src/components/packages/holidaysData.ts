import type { LucideIcon } from "lucide-react";
import { BedDouble, Bus, Globe2, Palmtree, Plane } from "lucide-react";
import { HELPLINE_NUMBER } from "../../lib/contact";

interface MoodCard {
  id: string;
  title: string;
  price: number;
  image: string;
  /** Maps loosely to package destinations / titles for filtering. */
  match: string[];
}

interface ServiceCard {
  id: string;
  title: string;
  cta: string;
  href: string;
  image: string;
}

interface PartnerChip {
  label: string;
  tone: string;
}

export const HOLIDAY_PRODUCT_TABS: {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { id: "flights", label: "Flights", href: "/", icon: Plane },
  { id: "hotels", label: "Hotels", href: "/hotels", icon: BedDouble },
  { id: "holidays", label: "Holidays", href: "/packages", icon: Palmtree },
  { id: "buses", label: "Buses", href: "/buses", icon: Bus },
  { id: "visa", label: "Visa", href: "/visa", icon: Globe2 },
];

export const HOLIDAY_DESTINATIONS = [
  "Goa",
  "Kerala",
  "Rajasthan",
  "Dubai",
  "Bali",
  "Mauritius",
  "Varanasi",
  "Kashmir",
  "Himachal",
  "Singapore",
  "Thailand",
];

export const TRAVEL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const PARTNER_CHIPS: PartnerChip[] = [
  { label: "Saudi", tone: "bg-emerald-50 text-emerald-800" },
  { label: "Korea", tone: "bg-sky-50 text-sky-800" },
  { label: "Hong Kong", tone: "bg-rose-50 text-rose-800" },
  { label: "Malaysia", tone: "bg-amber-50 text-amber-900" },
  { label: "Philippines", tone: "bg-blue-50 text-blue-800" },
  { label: "Thailand", tone: "bg-red-50 text-red-800" },
];

export const MOOD_CARDS: MoodCard[] = [
  {
    id: "honeymoon",
    title: "Honeymoon",
    price: 24990,
    image:
      "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=420",
    match: ["bali", "mauritius", "goa"],
  },
  {
    id: "adventure",
    title: "Adventure",
    price: 9490,
    image:
      "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=420",
    match: ["rajasthan", "kerala", "himachal"],
  },
  {
    id: "pilgrimage",
    title: "Pilgrimage",
    price: 6690,
    image:
      "https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=420",
    match: ["varanasi", "diwali"],
  },
  {
    id: "beach",
    title: "Beach holiday",
    price: 14999,
    image:
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=420",
    match: ["goa", "bali", "mauritius"],
  },
  {
    id: "group",
    title: "Group tours",
    price: 15990,
    image:
      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=420",
    match: ["dubai", "rajasthan", "kerala"],
  },
  {
    id: "shopping",
    title: "Shopping",
    price: 19990,
    image:
      "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=420",
    match: ["dubai", "singapore"],
  },
];

export const SERVICE_CARDS: ServiceCard[] = [
  {
    id: "adventure",
    title: "Adventure",
    cta: "Plan my trip",
    href: "/packages",
    image:
      "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "mice",
    title: "MICE",
    cta: "Plan my trip",
    href: `tel:${HELPLINE_NUMBER}`,
    image:
      "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "cruise",
    title: "Cruise",
    cta: "Plan my trip",
    href: "/packages",
    image:
      "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "villas",
    title: "Villas & stays",
    cta: "Plan my trip",
    href: "/hotels",
    image:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "trains",
    title: "Luxury trains",
    cta: "Plan my trip",
    href: "/packages",
    image:
      "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "activities",
    title: "Activities",
    cta: "Plan my trip",
    href: "/packages",
    image:
      "https://images.pexels.com/photos/1654489/pexels-photo-1654489.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "gift",
    title: "Gift voucher",
    cta: "Plan my trip",
    href: "/packages",
    image:
      "https://images.pexels.com/photos/264787/pexels-photo-264787.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "buses",
    title: "Buses",
    cta: "Plan my trip",
    href: "/buses",
    image:
      "https://images.pexels.com/photos/385998/pexels-photo-385998.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: "visa",
    title: "Visa",
    cta: "Plan my trip",
    href: "/visa",
    image:
      "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];
