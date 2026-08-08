import logo from "../assets/tripime_logo.png";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8" }: LogoProps) {
  return <img src={logo} alt="Tripime" className={`${className} w-auto object-contain`} />;
}
