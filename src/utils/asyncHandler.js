export const asyncHandler = (handlerFunction) => {
  return (req, res, next) => {
    Promise.resolve(handlerFunction(req, res, next)).catch((error) => {
      next(error);
    });
  };
};