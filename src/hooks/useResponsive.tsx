// @ts-nocheck
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

// https://blog.cerita-faldi.xyz/handle-responsive-website-in-nextjs-ssr/
const useResponsive = () => {
  const [isClient, setIsClient] = useState(false);

  const isOnlyMobile = useMediaQuery({
    maxWidth: "640px",
  });
  const isMobile = useMediaQuery({
    minWidth: "640px",
  });

  const isTablet = useMediaQuery({
    minWidth: "768px",
  });

  const isDesktop = useMediaQuery({
    minWidth: "1024px",
  });

  const isLargeDesktop = useMediaQuery({ minWidth: "1224px" });

  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return {
    isDesktop: isClient ? isDesktop : true,
    isTablet: isClient ? isTablet : false,
    isMobile: isClient ? isMobile : false,
    isOnlyMobile: isClient ? isOnlyMobile : false,
    isLargeDesktop: isClient ? isLargeDesktop : false,
  };
};

export default useResponsive;
