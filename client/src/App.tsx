
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import type { ProductCategory, Product, Promotion, Store } from '../../server/src/schema';
import type { CompanyInfo } from '../../server/src/handlers/get_company_info';
import type { MemberLoginInput, StoreSearchInput } from '../../server/src/schema';

function App() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Member login form state
  const [loginData, setLoginData] = useState<MemberLoginInput>({
    email: '',
    password: ''
  });

  // Store search form state
  const [storeSearch, setStoreSearch] = useState<StoreSearchInput>({
    city: '',
    zip_code: '',
    radius: 25
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [categoriesData, recommendedData, newData, promotionsData, companyData] = await Promise.all([
        trpc.getProductCategories.query(),
        trpc.getRecommendedProducts.query(),
        trpc.getNewProducts.query(),
        trpc.getCurrentPromotions.query(),
        trpc.getCompanyInfo.query()
      ]);

      setCategories(categoriesData);
      setRecommendedProducts(recommendedData);
      setNewProducts(newData);
      setPromotions(promotionsData);
      setCompanyInfo(companyData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await trpc.memberLogin.mutate(loginData);
      // Handle successful login - this is a stub since we don't have full auth flow
      alert('Login successful! (This is a demo - actual authentication would redirect to member dashboard)');
      setLoginData({ email: '', password: '' });
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleStoreSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await trpc.searchStores.query(storeSearch);
      setStores(results);
    } catch (error) {
      console.error('Store search failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-700 rounded-full animate-pulse"></div>
          <p className="text-gray-600">Loading your Starbucks experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">★</span>
                </div>
                <span className="text-2xl font-bold text-green-800">STARBUCKS</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#menu" className="text-gray-700 hover:text-green-700 font-medium">Menu</a>
                <a href="#rewards" className="text-gray-700 hover:text-green-700 font-medium">Rewards</a>
                <a href="#stores" className="text-gray-700 hover:text-green-700 font-medium">Find a Store</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-green-800">Member Login</DialogTitle>
                    <DialogDescription>
                      Sign in to your Starbucks Rewards account
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleMemberLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setLoginData((prev: MemberLoginInput) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setLoginData((prev: MemberLoginInput) => ({ ...prev, password: e.target.value }))
                        }
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                      Sign In
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button className="bg-green-700 hover:bg-green-800">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Fall favorites are back ☕
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            The season's most-loved flavors are here. Enjoy the cozy taste of Pumpkin Spice Latte and more.
          </p>
          <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100 text-lg px-8 py-3">
            Order Now
          </Button>
        </div>
      </section>

      {/* Current Promotions */}
      {promotions.length > 0 && (
        <section className="py-16 bg-orange-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Current Offers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promotions.map((promotion: Promotion) => (
                <Card key={promotion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500"></div>
                  <CardHeader>
                    <CardTitle className="text-green-800">{promotion.title}</CardTitle>
                    <CardDescription>{promotion.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {promotion.discount_percentage && (
                      <Badge className="bg-red-500 hover:bg-red-600 mb-2">
                        {promotion.discount_percentage}% OFF
                      </Badge>
                    )}
                    <p className="text-sm text-gray-500">
                      Valid until {promotion.end_date.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Explore Our Menu</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category: ProductCategory) => (
              <Card key={category.id} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg"></div>
                <CardHeader>
                  <CardTitle className="text-green-800">{category.name}</CardTitle>
                  {category.description && (
                    <CardDescription>{category.description}</CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Barista Recommends</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedProducts.map((product: Product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-amber-200 to-orange-300"></div>
                  <CardHeader>
                    <CardTitle className="text-green-800">{product.name}</CardTitle>
                    {product.description && (
                      <CardDescription>{product.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-700">${product.price.toFixed(2)}</span>
                      <Badge className="bg-green-700 hover:bg-green-800">Recommended</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What's New</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newProducts.map((product: Product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-200 to-purple-300"></div>
                  <CardHeader>
                    <CardTitle className="text-green-800">{product.name}</CardTitle>
                    {product.description && (
                      <CardDescription>{product.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-700">${product.price.toFixed(2)}</span>
                      <Badge className="bg-blue-600 hover:bg-blue-700">New</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Store Locator */}
      <section id="stores" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Find a Store</h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Store Locator</CardTitle>
                <CardDescription>Find your nearest Starbucks location</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStoreSearch} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={storeSearch.city || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setStoreSearch((prev: StoreSearchInput) => ({ ...prev, city: e.target.value || undefined }))
                        }
                        placeholder="Enter city name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={storeSearch.zip_code || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setStoreSearch((prev: StoreSearchInput) => ({ ...prev, zip_code: e.target.value || undefined }))
                        }
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="radius">Search Radius (miles)</Label>
                    <Input
                      id="radius"
                      type="number"
                      value={storeSearch.radius}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setStoreSearch((prev: StoreSearchInput) => ({ ...prev, radius: parseInt(e.target.value) || 25 }))
                      }
                      min="1"
                      max="100"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                    Find Stores
                  </Button>
                </form>
              </CardContent>
            </Card>

            {stores.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Nearby Stores</h3>
                {stores.map((store: Store) => (
                  <Card key={store.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-green-800">{store.name}</h4>
                          <p className="text-gray-600">{store.address}</p>
                          <p className="text-gray-600">{store.city}, {store.state} {store.zip_code}</p>
                          {store.phone && <p className="text-gray-600">{store.phone}</p>}
                          {store.hours && <p className="text-sm text-gray-500 mt-2">{store.hours}</p>}
                        </div>
                        <Button variant="outline" size="sm" className="border-green-700 text-green-700">
                          Get Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Us */}
      {companyInfo && (
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">About Starbucks</h2>
              <p className="text-xl mb-8 italic">"{companyInfo.mission}"</p>
              <Separator className="bg-green-600 my-8" />
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div>
                  <div className="text-4xl font-bold text-green-200">{companyInfo.founded}</div>
                  <div className="text-lg">Founded</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-200">{companyInfo.stores_worldwide.toLocaleString()}+</div>
                  <div className="text-lg">Stores Worldwide</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-200">80+</div>
                  <div className="text-lg">Countries</div>
                </div>
              </div>
              <p className="text-lg mb-8 leading-relaxed">{companyInfo.description}</p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Our Values</h3>
                  <ul className="space-y-2">
                    {companyInfo.values.map((value: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-300 mr-2">★</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Our Commitment</h3>
                  <p className="text-green-100 leading-relaxed">
                    We're committed to ethical sourcing, environmental stewardship, and creating positive impact in communities around the world. Every cup tells a story of connection, quality, and care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">★</span>
                </div>
                <span className="text-xl font-bold">STARBUCKS</span>
              </div>
              <p className="text-gray-400">
                Inspiring and nurturing the human spirit – one person, one cup and one neighborhood at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Our Company</a></li>
                <li><a href="#" className="hover:text-white">Our Coffee</a></li>
                <li><a href="#" className="hover:text-white">Stories and News</a></li>
                <li><a href="#" className="hover:text-white">Investor Relations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Careers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Culture and Values</a></li>
                <li><a href="#" className="hover:text-white">Inclusion and Diversity</a></li>
                <li><a href="#" className="hover:text-white">College Achievement Plan</a></li>
                <li><a href="#" className="hover:text-white">U.S. Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Social Impact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">People</a></li>
                <li><a href="#" className="hover:text-white">Planet</a></li>
                <li><a href="#" className="hover:text-white">Environmental and Social Impact</a></li>
                <li><a href="#" className="hover:text-white">Global Social Impact</a></li>
              </ul>
            </div>
          </div>
          <Separator className="bg-gray-700 my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
            <p>&copy; 2024 Starbucks Coffee Company. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">CA Supply Chain Act</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
