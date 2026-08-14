import { Model } from 'mongoose';
import { IReview } from '../models/Review';
import { IProduct } from '../models/Product';
declare function reviewRoutes(ReviewModel: Model<IReview>, ProductModel: Model<IProduct>): import("express-serve-static-core").Router;
export default reviewRoutes;
//# sourceMappingURL=review.routes.d.ts.map