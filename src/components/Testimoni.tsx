'use client';

import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
    location: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Ibu Sari Rahayu",
        role: "Pemilik Usaha Catering",
        content: "Bank BPR Sumber Dana Anda sangat membantu dalam pengembangan usaha saya. Proses kredit yang mudah dan bunga yang kompetitif membuat bisnis catering saya berkembang pesat.",
        rating: 5,
        avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        location: "Jakarta Selatan"
    },
    {
        id: 2,
        name: "Bapak Ahmad Wijaya",
        role: "Pedagang Retail",
        content: "Pelayanan yang ramah dan professional. Tim customer service selalu siap membantu kapan saja. Sangat puas dengan produk tabungan dan kemudahan transaksi digitalnya.",
        rating: 5,
        avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        location: "Bekasi"
    },
    {
        id: 3,
        name: "Ibu Dewi Lestari",
        role: "Karyawan Swasta",
        content: "Sudah 3 tahun menabung di Bank BPR Sumber Dana Anda. Bunga tabungan yang tinggi dan tidak ada biaya administrasi bulanan membuat saya semakin loyal sebagai nasabah.",
        rating: 5,
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        location: "Tangerang"
    },
    {
        id: 4,
        name: "Bapak Rudi Santoso",
        role: "Pemilik Bengkel",
        content: "Kredit modal kerja dari Bank BPR Sumber Dana Anda membantu saya membeli peralatan bengkel baru. Prosesnya cepat dan persyaratannya tidak ribet.",
        rating: 5,
        avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        location: "Depok"
    },
    {
        id: 5,
        name: "Ibu Maya Sari",
        role: "Guru",
        content: "Bank yang sangat terpercaya untuk menabung. Lokasi yang strategis dan jam operasional yang fleksibel sangat memudahkan saya sebagai guru yang sibuk.",
        rating: 5,
        avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        location: "Bogor"
    },
    {
        id: 6,
        name: "Bapak Hadi Kurniawan",
        role: "Wiraswasta",
        content: "Saya sangat terkesan dengan inovasi digital banking yang ditawarkan. Mobile banking yang user-friendly dan fitur-fitur yang lengkap membuat transaksi jadi lebih mudah.",
        rating: 5,
        avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        location: "Jakarta Timur"
    }
];

export default function TestimonialsSection() {
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate items per page based on screen size
    const getItemsPerPage = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) return 3; // lg screens
            if (window.innerWidth >= 768) return 2;  // md screens
            return 1; // sm screens
        }
        return 3; // default for SSR
    };

    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

    // Update items per page on window resize
    useState(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setItemsPerPage(getItemsPerPage());
                setCurrentPage(0); // Reset to first page on resize
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    });

    const totalPages = Math.ceil(testimonials.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const currentTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16 min-h-[50vh]">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-orange-600/5"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Apa Kata <span className="text-blue-600">Nasabah</span> Kami?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Kepercayaan dan kepuasan nasabah adalah prioritas utama Bank BPR Sumber Dana Anda
                    </p>
                    <div className="mt-6 flex justify-center">
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">4.9/5 dari 1,200+ ulasan</span>
                        </div>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentTestimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 relative"
                        >
                            {/* Decorative Element */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-t-2xl"></div>

                            {/* Quote Icon */}
                            <div className="flex justify-between items-start mb-4">
                                <Quote className="w-8 h-8 text-orange-500 opacity-20" />
                                <div className="flex">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </div>

                            {/* Testimonial Content */}
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Customer Info */}
                            <div className="flex items-center">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-100"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-blue-600">{testimonial.role}</p>
                                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center space-x-4">
                    {/* Previous Button */}
                    <button
                        onClick={prevPage}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
                        disabled={totalPages <= 1}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Page Indicators */}
                    <div className="flex space-x-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${currentPage === index
                                    ? 'bg-blue-600 scale-125'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={nextPage}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
                        disabled={totalPages <= 1}
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Page Info */}
                <div className="text-center mt-4">
                    <span className="text-sm text-gray-500">
                        Halaman {currentPage + 1} dari {totalPages}
                    </span>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        Bergabunglah dengan ribuan nasabah yang telah merasakan pelayanan terbaik kami
                    </p>
                    <Link href="/saving-loan?tab=saving-product" passHref>
                        <button
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Buka Rekening Sekarang
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}