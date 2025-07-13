'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Shield, Coins, CreditCard, Building, Users, Star } from 'lucide-react';
import { Article } from '@/types/blog'; // Pastikan path ini benar
import { BackendlessService } from '@/lib/backendlessArticle'; // Pastikan path ini benar
import { toast } from 'sonner';
import Link from 'next/link'; // Import Link dari next/link

const categories = [
    { name: "Technology", icon: TrendingUp, count: 24 },
    { name: "Security", icon: Shield, count: 18 },
    { name: "Cryptocurrency", icon: Coins, count: 15 },
    { name: "Payments", icon: CreditCard, count: 21 },
    { name: "Regulation", icon: Building, count: 12 },
    { name: "Customer Experience", icon: Users, count: 19 }
];

// Helper function to convert Backendless article to display format
const convertToDisplayFormat = (article: any): Article => {
    return {
        ...article,
        id: article.objectId,
        category: article.categoryy, // Pastikan ini sesuai dengan nama kolom kategori di Backendless
        image: article.thumbnail || 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800',
        excerpt: article.content ? article.content.substring(0, 150) + '...' : '',
        readTime: Math.ceil((article.content?.length || 0) / 200) + ' min read',
        date: article.created ? new Date(article.created).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        tags: article.categoryy ? [article.categoryy] : [],
        featured: article.publish || false // Jika ada kolom 'publish' sebagai featured
    };
};

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Article[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState(true);

    // Load articles from Backendless
    useEffect(() => {
        const loadArticles = async () => {
            try {
                setLoading(true);
                const backendlessArticles = await BackendlessService.getPublishedArticles();
                const convertedArticles = backendlessArticles.map(convertToDisplayFormat);
                setArticles(convertedArticles);
                setFilteredPosts(convertedArticles);
            } catch (error) {
                console.error('Error loading articles:', error);
                toast.error('Failed to load articles');
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, []);

    // Filter articles based on search and category
    useEffect(() => {
        const filtered = articles.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === '' || post.categoryy === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        setFilteredPosts(filtered);
    }, [searchTerm, selectedCategory, articles]);

    // Ambil artikel unggulan/terbaru
    const featuredArticle = filteredPosts.find(post => post.featured) || (filteredPosts.length > 0 ? filteredPosts[0] : null);
    // Semua artikel lainnya (kecuali featuredArticle)
    const otherArticles = filteredPosts.filter(post => post.id !== featuredArticle?.id);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative text-white pb-30 py-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=1600)' }}>
                <div className="absolute inset-0 bg-blue-900/70"></div>
                <div className="relative container mt-40 pb-20 mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center animate-fade-in">
                        <h2 className="text-5xl font-bold mb-6">
                            Discover the Future of <span className="text-amber-400">Banking</span>
                        </h2>
                        <p className="text-xl mb-8 text-blue-100">
                            Stay ahead with the latest insights, trends, and innovations in the banking industry
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                                <Link href="#timoti">
                                    Subscribe
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="relative mb-8">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 py-3 text-lg"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                            <Button
                                variant={selectedCategory === '' ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory('')}
                                className="mb-2"
                            >
                                All Categories
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category.name}
                                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                                    onClick={() => setSelectedCategory(category.name)}
                                    className="mb-2"
                                >
                                    <category.icon className="h-4 w-4 mr-2" />
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Articles */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold mb-12 text-center">Featured Articles</h3>
                    {loading ? (
                        <>
                            {/* Loading skeleton for the full-width featured card */}
                            <Card className="animate-pulse mb-8 flex flex-col md:flex-row">
                                <div className="md:w-1/2 aspect-video bg-gray-200"></div>
                                <div className="md:w-1/2 p-4">
                                    <div className="h-8 bg-gray-200 mb-4"></div>
                                    <div className="h-4 bg-gray-200 mb-2"></div>
                                    <div className="h-4 bg-gray-200 mb-6"></div>
                                    <div className="h-12 bg-gray-200"></div>
                                </div>
                            </Card>
                            {/* Loading skeleton for all other articles (uniform size) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => ( // Tambah item untuk placeholder
                                    <Card key={`small-load-${i}`} className="animate-pulse">
                                        <div className="aspect-video bg-gray-200"></div>
                                        <CardHeader>
                                            <div className="h-5 bg-gray-200 mb-2"></div>
                                            <div className="h-3 bg-gray-200"></div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-3 bg-gray-200 mb-4"></div>
                                            <div className="h-8 bg-gray-200"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No articles found</p>
                            <p className="text-gray-400">Try adjusting your search or category filter</p>
                        </div>
                    ) : (
                        <>
                            {/* Artikel Unggulan/Terbaru (Full-width dengan Thumbnail Kiri) */}
                            {featuredArticle && (
                                <Card key={featuredArticle.objectId || featuredArticle.id} className={`card-hover animate-fade-in mb-8 flex flex-col md:flex-row overflow-hidden`}>
                                    <div className="relative md:w-1/2 aspect-video md:aspect-auto">
                                        <img
                                            src={featuredArticle.thumbnail || 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=1600'}
                                            alt={featuredArticle.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="secondary" className="bg-blue-600 text-white">
                                                {featuredArticle.categoryy}
                                            </Badge>
                                        </div>
                                        {featuredArticle.featured && (
                                            <div className="absolute top-4 right-4">
                                                <Star className="h-5 w-5 text-amber-400 fill-current" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:w-1/2 p-6 flex flex-col justify-between">
                                        <div>
                                            <CardTitle className="text-2xl md:text-4xl font-bold mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                                                <Link href={`/articles/${encodeURIComponent(featuredArticle.title)}`} className="hover:underline">
                                                    {featuredArticle.title}
                                                </Link>
                                            </CardTitle>
                                            <CardDescription className="line-clamp-4 text-base mb-4">
                                                {featuredArticle.excerpt || featuredArticle.content?.substring(0, 250) + '...'}
                                            </CardDescription>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                <span>{featuredArticle.author}</span>
                                                <span>{featuredArticle.readTime || '5 min read'}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {(featuredArticle.tags || [featuredArticle.categoryy]).filter(Boolean).map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Link href={`/articles/${encodeURIComponent(featuredArticle.title)}`} passHref>
                                                <Button asChild className="w-full hover:bg-blue-700">
                                                    <a>Read More</a>
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Grid untuk Semua Artikel Lainnya (ukuran seragam) */}
                            {otherArticles.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {otherArticles.map((post, index) => (
                                        <Card key={post.objectId || post.id} className={`card-hover animate-fade-in`} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                                            <div className="aspect-video relative overflow-hidden">
                                                <img
                                                    src={post.thumbnail || 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800'}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <Badge variant="secondary" className="bg-blue-600 text-white">
                                                        {post.categoryy}
                                                    </Badge>
                                                </div>
                                                {post.featured && (
                                                    <div className="absolute top-4 right-4">
                                                        <Star className="h-5 w-5 text-amber-400 fill-current" />
                                                    </div>
                                                )}
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="text-xl line-clamp-2 hover:text-blue-600 transition-colors">
                                                    <Link href={`/articles/${encodeURIComponent(post.title)}`} className="hover:underline">
                                                        {post.title}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription className="line-clamp-3">
                                                    {post.excerpt || post.content?.substring(0, 150) + '...'}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                    <span>{post.author}</span>
                                                    <span>{post.readTime || '5 min read'}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {(post.tags || [post.categoryy]).filter(Boolean).map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <Link href={`/articles/${encodeURIComponent(post.title)}`} passHref>
                                                    <Button asChild className="w-full hover:bg-blue-700">
                                                        <a>Read More</a>
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section id='timoti' className="py-16 gradient-banking text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
                        <p className="text-blue-100 mb-8">
                            Get the latest banking insights delivered to your inbox weekly
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-white text-gray-900"
                            />
                            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                                <Link href="https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p1/294/2025/01/07/Timothy-3551369361.jpg" target="_blank" rel="noopener noreferrer">
                                    Subscribe
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}