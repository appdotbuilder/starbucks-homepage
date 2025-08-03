
import { type ProductCategory } from '../schema';

export const getProductCategories = async (): Promise<ProductCategory[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all active product categories ordered by display_order.
    // Should return categories like "Drinks", "Food", "Coffee Beans", "Merchandise", etc.
    return [
        {
            id: 1,
            name: "Hot Drinks",
            description: "Freshly brewed coffee, espresso, and hot beverages",
            image_url: "/images/categories/hot-drinks.jpg",
            display_order: 1,
            is_active: true,
            created_at: new Date()
        },
        {
            id: 2,
            name: "Cold Drinks",
            description: "Iced coffee, frappuccinos, and refreshing beverages",
            image_url: "/images/categories/cold-drinks.jpg",
            display_order: 2,
            is_active: true,
            created_at: new Date()
        }
    ];
};
