import dynamic from "next/dynamic";

const StarComponent = dynamic(() => import("react-star-ratings"), {
  ssr: false,
});

export const getRating = (rating) => (
  <>
    <span>{rating < 0 ? "N/A" : rating.toFixed(1)}</span>
    {rating >= 0 && (
      <StarComponent
        rating={rating}
        starRatedColor="blue"
        numberOfStars={5}
        starDimension="15px"
      />
    )}
  </>
);
