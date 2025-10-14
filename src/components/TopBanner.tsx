import Marquee from "react-fast-marquee";

const TopBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary via-accent to-primary text-white py-2">
      <Marquee speed={50} gradient={false}>
        <span className="text-sm md:text-base font-medium mx-8">
          🌟 Welcome to our project — Donorly Impact Hub 🌟
        </span>
        <span className="text-sm md:text-base font-medium mx-8">
          🌟 Welcome to our project — Donorly Impact Hub 🌟
        </span>
        <span className="text-sm md:text-base font-medium mx-8">
          🌟 Welcome to our project — Donorly Impact Hub 🌟
        </span>
        <span className="text-sm md:text-base font-medium mx-8">
          🌟 Welcome to our project — Donorly Impact Hub 🌟
        </span>
      </Marquee>
    </div>
  );
};

export default TopBanner;
