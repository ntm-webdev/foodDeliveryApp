import { useRouter } from "next/router";
import Image from "next/image";

import styles from "./FoodOptionsNavItem.module.css";

const FoodOptionsNavItem = ({ path, src, alt, label, onAnchorClick }) => {
  const router = useRouter();

  return (
    <div
      className={`${styles.navItem} ${router.asPath === path ? "active" : ""}`}
    >
      <a onClick={() => onAnchorClick(path)}>
        <Image src={src} alt={alt} width={100} height={100} />
        <p>{label}</p>
      </a>
    </div>
  );
};

export default FoodOptionsNavItem;
