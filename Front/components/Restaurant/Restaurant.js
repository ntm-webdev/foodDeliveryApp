import Image from "next/image";
import Link from "next/link";

import styles from "./Restaurant.module.css";
import { getRating } from "../../utils/starComponent";

const Restaurant = ({ items }) => {
  if (items.length < 1) {
    return (
      <div className="breath row">
        <div className="col-sm-12">
          <div className={styles.restaurant}>
            <p style={{color: 'black'}}>
              <strong>No restaurants found.</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    items.map((item, i) => (
      <div key={i} className="breath row">
        <div className={`col-sm-12 ${item.category}`}>
          <Link href={`/restaurant/${item._id}`}>
            <a>
              <div className={`clickable ${styles.restaurant}`}>
                <div className={styles.restaurantImage}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/images/${item.logo}`}
                    width={100}
                    height={100}
                  />
                </div>
                <div className={styles.restaurantContent}>
                  <h4>{item.name}</h4>
                  <strong>Rating: </strong>
                  {getRating(item.rating)}
                </div>
              </div>
            </a>
          </Link>
        </div>
      </div>
    ))
  );
};

export default Restaurant;
