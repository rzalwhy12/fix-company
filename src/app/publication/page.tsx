import { Suspense } from 'react';
import Link from 'next/link'; // Import Link dari next/link
import PublicationContent from '@/components/PublicationContentWrapper';
import { Button } from '@/components/ui/button'; // Pastikan Button diimpor

export default function PublicationPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div
                className="relative h-64 bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
                style={{
                    backgroundImage: "url('/image/buka-simpanan.jpg')",
                    backgroundAttachment: "fixed",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <h1
                    // Kelas CSS untuk animasi fade-in-up (didefinisikan di globals.css)
                    className="relative z-10 text-4xl sm:text-5xl font-bold text-center drop-shadow-lg
                                opacity-0 transform translate-y-12 transition-all duration-800 ease-out animate-fade-in-up"
                >
                    Our Publications & Reports
                </h1>
            </div>
            <Suspense fallback={
                <div className="flex justify-center items-center py-20 px-6 sm:px-10">
                    <p>Loading publication content...</p>
                </div>
            }>
                <PublicationContent />
            </Suspense>


            <div className="sticky bottom-20 left-8 z-0">
                <Link href="/publication/dashboardoc">
                    <Button className="shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="ml-2 hidden md:inline">Go to Dashboard</span> 
                    </Button>
                </Link>
            </div>
        </div>
    );
}