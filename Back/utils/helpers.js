module.exports.calculateFeedback = (existingRestaurant) => {
  const numberOfFeedbacks = existingRestaurant.feedback.length;
  if (numberOfFeedbacks > 0) {
    const arrRatings = existingRestaurant.feedback.map((el) => el.rating);
    const sumOfRatings = arrRatings.reduce((a, b) => a + b, 0);
    return sumOfRatings / numberOfFeedbacks;
  } else {
    return -1;
  }
};
