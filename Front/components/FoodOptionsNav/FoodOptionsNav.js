import { useRouter } from "next/router";

import styles from "./FoodOptionsNav.module.css";
import FoodOptionsNavItem from "./FoodOptionsNavItem/FoodOptionsNavItem";

const FoodOptionsNav = () => {
  const router = useRouter();

  const anchorClickHandler = (currentLink) => {
    if (currentLink === router.asPath) {
      router.replace("/");
    } else {
      router.replace(currentLink);
    }
  };

  return (
    <div className={styles.scrollmenu}>
      <FoodOptionsNavItem
        path={"/?category=fast-food"}
        src={"/icons/FastFood.png"}
        alt={"fast food icon"}
        label={"FastFood"}
        onAnchorClick={anchorClickHandler}
      />
      <FoodOptionsNavItem
        path={"/?category=pizza"}
        src={"/icons/Pizza.png"}
        alt={"pizza icon"}
        label={"Pizza"}
        onAnchorClick={anchorClickHandler}
      />
      <FoodOptionsNavItem
        path={"/?category=japanese"}
        src={"/icons/sushi.png"}
        alt={"sushi icon"}
        label={"Japanese"}
        onAnchorClick={anchorClickHandler}
      />
      <FoodOptionsNavItem
        path={"/?category=italian"}
        src={"/icons/spaghetti.png"}
        alt={"spaghetti icon"}
        label={"Italian"}
        onAnchorClick={anchorClickHandler}
      />
      <FoodOptionsNavItem
        path={"/?category=healthy"}
        src={"/icons/salad.png"}
        alt={"salad icon"}
        label={"Healthy"}
        onAnchorClick={anchorClickHandler}
      />
      <FoodOptionsNavItem
        path={"/?category=dessert"}
        src={"/icons/dessert.png"}
        alt={"cupcake icon"}
        label={"Dessert"}
        onAnchorClick={anchorClickHandler}
      />
    </div>
  );
};

export default FoodOptionsNav;
