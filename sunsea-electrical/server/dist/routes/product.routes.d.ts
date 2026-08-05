/**
 * Product Routes
 *
 * Handles all product-related CRUD operations with proper route ordering:
 * 1. Static routes (no parameters)
 * 2. Slug-based routes (specific pattern)
 * 3. ID-based routes (fallback for backward compatibility)
 *
 * Route Order Matters:
 * - Express matches routes in the order they are defined
 * - Slug routes must come before ID routes to prevent slug values
 *   being interpreted as MongoDB ObjectIds
 */
import ProductModel from '../models/Product';
declare function productRoutes(productModel: typeof ProductModel): import("express-serve-static-core").Router;
export default productRoutes;
//# sourceMappingURL=product.routes.d.ts.map