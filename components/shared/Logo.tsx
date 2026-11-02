import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/images/page-logo.png"
      alt="image-tag"
      width={120}
      height={70}
      loading="eager"
      className="w-auto h-auto"
    />
  );
};

export default Logo;
