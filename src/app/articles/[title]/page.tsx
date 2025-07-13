import { apiCall } from "@/helper/apiCall";
import * as React from "react";
import Link from "next/link";

interface IArticleDetailPageProps {
    params: Promise<{ title: string }>;
}

interface ArticleDetail {
    title: string;
    content: string;
    author: string;
    created: number | string;
    thumbnail: string;
    categoryy?: string;
}

interface RelatedArticle {
    title: string;
    thumbnail: string;
    category?: string;
}

const getDetail = async (title: string): Promise<ArticleDetail | undefined> => {
    try {
        const res = await apiCall.get(
            `/articles?where=%60title%60%20%3D%20'${title}'`
        );
        console.log("Detail Artikel:", res.data[0]);
        return res.data[0] as ArticleDetail;
    } catch (error) {
        console.log("Error fetching article detail:", error);
        return undefined;
    }
};

const getOtherStories = async (currentArticleTitle: string): Promise<RelatedArticle[]> => {
    try {
        const res = await apiCall.get(
            `/articles?pageSize=3&sortBy=created%20desc&where=title%20%21%3D%20'${currentArticleTitle}'`
        );
        console.log("Artikel Lainnya:", res.data);
        return res.data.map((item: any) => ({
            title: item.title,
            thumbnail: item.thumbnail,
            category: item.categoryy || "DESTINATIONS",
        })) as RelatedArticle[];
    } catch (error) {
        console.log("Error fetching other stories:", error);
        return [];
    }
};

const ArticleDetailPage = async ({ params }: IArticleDetailPageProps) => {
    const { title } = await params;
    const detailData = await getDetail(title);
    const otherStoriesData = await getOtherStories(title);

    if (!detailData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-600">Article not found or an error occurred.</p>
            </div>
        );
    }

    const article = detailData;

    const formatTimestampToDate = (timestamp: number | string | undefined): string => {
        if (!timestamp) {
            return "N/A";
        }

        const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

        if (isNaN(numTimestamp)) {
            return "Invalid Date";
        }

        const date = new Date(numTimestamp);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const categorySlug = article.categoryy ? encodeURIComponent(article.categoryy.toLowerCase()) : 'destinations';

    return (
        // Container utama untuk seluruh halaman
        <div className="relative min-h-screen bg-gray-100 overflow-hidden">
            {/* Background image blur XL untuk seluruh halaman */}
            {article.thumbnail && (
                <img
                    src={`${article.thumbnail}`}
                    alt="Page Background"
                    className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-105"
                />
            )}
            {/* Overlay untuk memperjelas konten di atas background */}
            <div className="absolute inset-0 bg-black opacity-40"></div> {/* Sesuaikan opacity jika perlu */}

            {/* Konten utama halaman, harus berada di atas background blur */}
            <div className="relative z-10 container mx-auto mt-20 px-4 py-12 lg:px-8 flex flex-col lg:flex-row bg-white rounded-lg shadow-lg my-12"> {/* Menambahkan background putih dan shadow */}
                {/* Main Content Area */}
                <div className="w-full lg:w-3/4 lg:pr-12">
                    <div className="text-left mb-6">
                        <Link href={`/category/${categorySlug}`} className="text-sm text-gray-500 uppercase tracking-widest mb-2 hover:underline">
                            {article.categoryy || "ARTICLE"}
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                            {article.title}
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Article by {article.author} - {formatTimestampToDate(article.created)}
                        </p>
                    </div>

                    <section id="content" className="mt-8 mb-8">
                        {/* Gambar utama artikel (tanpa background blur di sini lagi) */}
                        <div className="w-full h-[250px] md:h-[400px] lg:h-[500px] xl:h-[600px] rounded-lg overflow-hidden">
                            {article.thumbnail && (
                                <img
                                    className="w-full h-full object-cover" // Menggunakan object-cover untuk gambar utama
                                    src={`${article.thumbnail}`}
                                    alt={article.title || "Article Thumbnail"}
                                />
                            )}
                        </div>
                    </section>

                    <div className="article-body text-gray-800 leading-relaxed text-lg">
                        {article.content ? (
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        ) : (
                            <p>No content available for this article.</p>
                        )}
                    </div>
                </div>

                {/* Other Stories Section */}
                <div className="w-full lg:w-1/4 mt-12 lg:mt-0 lg:pl-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Other Article</h2>
                    <div className="space-y-6">
                        {otherStoriesData.length > 0 ? (
                            otherStoriesData.map((relatedArticle, index) => (
                                <Link
                                    key={index}
                                    href={`/articles/${encodeURIComponent(relatedArticle.title)}`}
                                    className="flex items-center space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                                >
                                    <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                        <img src={relatedArticle.thumbnail} alt={relatedArticle.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">{relatedArticle.category || "DESTINA..."}</p>
                                        <p className="text-md font-semibold text-gray-800">
                                            {relatedArticle.title}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No other stories available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailPage;