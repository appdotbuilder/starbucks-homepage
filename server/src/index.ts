
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { storeSearchInputSchema, memberLoginInputSchema } from './schema';

// Import handlers
import { getProductCategories } from './handlers/get_product_categories';
import { getRecommendedProducts } from './handlers/get_recommended_products';
import { getNewProducts } from './handlers/get_new_products';
import { getCurrentPromotions } from './handlers/get_current_promotions';
import { searchStores } from './handlers/search_stores';
import { memberLogin } from './handlers/member_login';
import { getCompanyInfo } from './handlers/get_company_info';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Product categories for homepage sections
  getProductCategories: publicProcedure
    .query(() => getProductCategories()),
  
  // Recommended products for homepage display
  getRecommendedProducts: publicProcedure
    .query(() => getRecommendedProducts()),
  
  // New product highlights
  getNewProducts: publicProcedure
    .query(() => getNewProducts()),
  
  // Current promotions
  getCurrentPromotions: publicProcedure
    .query(() => getCurrentPromotions()),
  
  // Store locator functionality
  searchStores: publicProcedure
    .input(storeSearchInputSchema)
    .query(({ input }) => searchStores(input)),
  
  // Member login portal
  memberLogin: publicProcedure
    .input(memberLoginInputSchema)
    .mutation(({ input }) => memberLogin(input)),
  
  // About Us section information
  getCompanyInfo: publicProcedure
    .query(() => getCompanyInfo()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
