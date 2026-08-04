import mongoose, { Document, Types } from 'mongoose';
export interface IReview extends Document {
    productId: Types.ObjectId | mongoose.Types.ObjectId;
    userId: Types.ObjectId | mongoose.Types.ObjectId;
    rating: number;
    review?: string;
    isApproved: boolean;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}
declare const ReviewModel: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview, {}, {}> & IReview & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ReviewModel;
//# sourceMappingURL=Review.d.ts.map