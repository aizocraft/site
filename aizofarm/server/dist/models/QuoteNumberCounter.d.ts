import mongoose, { Model } from 'mongoose';
export interface IQuoteNumberCounter extends mongoose.Document {
    year: number;
    month: number;
    sequence: number;
    type: 'quotation' | 'invoice';
    updatedAt: Date;
}
declare const QuoteNumberCounterModel: Model<IQuoteNumberCounter>;
export default QuoteNumberCounterModel;
//# sourceMappingURL=QuoteNumberCounter.d.ts.map