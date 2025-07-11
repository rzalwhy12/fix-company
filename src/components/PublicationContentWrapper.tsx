// src/components/PublicationContentWrapper.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import PublicationDocumentCard from './PublicationDocumentCard';
import {
    Document,
    PublicationSection,
    PublicationContentItem,
    BreadcrumbItem,
    BACKENDLESS_BASE_URL,
    DOCUMENTS_TABLE_NAME,
} from '@/types/publication';

const contentVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3, ease: 'easeIn' } },
};

const PublicationContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeSection, setActiveSection] = useState<PublicationSection>('financial-report');
    const [isReportExpanded, setIsReportExpanded] = useState(false);
    const [allDocuments, setAllDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BACKENDLESS_BASE_URL}/data/${DOCUMENTS_TABLE_NAME}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: Document[] = await response.json();
            setAllDocuments(data);
        } catch (err: any) {
            console.error('Failed to fetch documents:', err);
            setError(`Failed to load documents: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const staticPublicationContent: Record<PublicationSection, Omit<PublicationContentItem, 'documents'>> = {
        'financial-report': {
            title: 'Financial Report',
            content: <p>Here you can find our latest financial reports detailing our performance and stability.</p>,
        },
        'annual-report': {
            title: 'Annual Report',
            content: <p>Our annual reports provide a comprehensive overview of our operations, financial results, and strategic initiatives.</p>,
        },
        'idic-lps': {
            title: 'IDIC / LPS Information',
            content: (
                <div className="space-y-4">
                    <p>The Indonesia Deposit Insurance Corporation (LPS) ensures the safety of your deposits. Learn more about the protection provided.</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>Deposit Guarantee Program Details</li>
                        <li>FAQs about LPS Coverage</li>
                        <li><a href="https://www.lps.go.id" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visit Official IDIC/LPS Website</a></li>
                    </ul>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        <p className="font-semibold">Important Notice:</p>
                        <p>All customer deposits are guaranteed by the Indonesia Deposit Insurance Corporation (LPS) up to the maximum limit specified by law.</p>
                    </div>
                </div>
            ),
        },
        'information': {
            title: 'General Information',
            content: (
                <div className="space-y-4">
                    <p>This section provides various general information related to our banking services, terms and conditions, and regulatory compliance.</p>
                    <p>Stay informed about important notices and updates regarding our operations and policies.</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>Terms and Conditions for Savings Accounts</li>
                        <li>Loan Product Information (General)</li>
                        <li>Data Privacy Policy</li>
                        <li>Customer Service Contact Directory</li>
                        <li><a href="/documents/general/terms-of-service.pdf" className="text-blue-600 hover:underline" download>Download Full Terms of Service (PDF)</a></li>
                    </ul>
                </div>
            ),
        },
        'report': {
            title: 'Reports Overview',
            content: (
                <div className="space-y-4">
                    <p>Please select a specific report from the sub-menu on the left, such as Financial Report or Annual Report, to view detailed information.</p>
                    <p>Our commitment to transparency is reflected in the comprehensive reports we publish regularly, providing insights into our performance and governance.</p>
                </div>
            ),
        },
    };

    const getPublicationContent = useCallback((section: PublicationSection): PublicationContentItem => {
        const staticContent = staticPublicationContent[section];
        const dynamicDocuments = allDocuments.filter(doc => doc.section === section);

        if (section === 'financial-report' || section === 'annual-report') {
            return {
                ...staticContent,
                documents: dynamicDocuments,
            };
        }

        return staticContent as PublicationContentItem;
    }, [allDocuments]);

    useEffect(() => {
        const section = searchParams.get('section') as PublicationSection;
        if (section && staticPublicationContent[section]) {
            setActiveSection(section);
            if (section === 'financial-report' || section === 'annual-report') {
                setIsReportExpanded(true);
            } else if (section !== 'report') {
                setIsReportExpanded(false); // ✅ FIXED: jangan tutup jika section-nya 'report'
            }
        } else {
            if (typeof window !== 'undefined') {
                router.replace('/publication?section=financial-report');
            }
        }
    }, [searchParams, router, staticPublicationContent]);

    const handleSectionClick = (section: PublicationSection) => {
        setActiveSection(section);
        router.push(`/publication?section=${section}`);
        if (section === 'report') {
            setIsReportExpanded(!isReportExpanded);
        } else if (section === 'financial-report' || section === 'annual-report') {
            setIsReportExpanded(true);
        } else {
            setIsReportExpanded(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'HOME', href: '/' },
        { label: 'Publication', href: '/publication' },
        (activeSection !== 'report' && staticPublicationContent[activeSection]) ? {
            label: staticPublicationContent[activeSection].title,
            href: `/publication?section=${activeSection}`
        } : null
    ].filter(Boolean) as BreadcrumbItem[];

    const currentContent = getPublicationContent(activeSection);

    return (
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto py-8 px-6 sm:px-10 gap-8">
            {/* Breadcrumbs */}
            <div className="bg-white py-4 px-6 sm:px-10 border-b border-gray-200 w-full lg:hidden">
                <nav className="text-sm text-gray-500">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            <a href={crumb.href} className="hover:underline text-blue-600">
                                {crumb.label}
                            </a>
                            {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0 bg-white rounded-lg shadow-md p-4 h-fit lg:sticky lg:top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Our Publications</h3>
                <nav className="space-y-1">
                    {/* Report Section with Dropdown */}
                    <div>
                        <Button
                            variant="ghost"
                            className={`w-full justify-between text-left px-3 py-2 rounded-md transition-colors duration-200 ${(activeSection === 'report' || activeSection === 'financial-report' || activeSection === 'annual-report')
                                    ? 'bg-blue-50 text-blue-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            onClick={() => handleSectionClick('report')}
                        >
                            Report
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 transform transition-transform duration-200 ${isReportExpanded ? 'rotate-90' : 'rotate-0'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                        <motion.div
                            initial={false}
                            animate={{
                                height: isReportExpanded ? 'auto' : 0,
                                opacity: isReportExpanded ? 1 : 0,
                                display: isReportExpanded ? 'block' : 'none',
                            }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="pl-4 mt-1 space-y-1"
                        >
                            <Button
                                variant="ghost"
                                className={`w-full justify-start text-left text-sm px-3 py-2 rounded-md transition-colors duration-200 ${activeSection === 'financial-report' ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                onClick={() => handleSectionClick('financial-report')}
                            >
                                Financial Report
                            </Button>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start text-left text-sm px-3 py-2 rounded-md transition-colors duration-200 ${activeSection === 'annual-report' ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                onClick={() => handleSectionClick('annual-report')}
                            >
                                Annual Report
                            </Button>
                        </motion.div>
                    </div>

                    {/* Other Sections */}
                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-left px-3 py-2 rounded-md transition-colors duration-200 ${activeSection === 'idic-lps' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        onClick={() => handleSectionClick('idic-lps')}
                    >
                        IDIC / LPS
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-left px-3 py-2 rounded-md transition-colors duration-200 ${activeSection === 'information' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        onClick={() => handleSectionClick('information')}
                    >
                        Information
                    </Button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white rounded-lg shadow-md p-6 lg:p-8 min-h-[60vh]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full"
                    >
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                            {currentContent?.title || 'Select a Publication'}
                        </h1>

                        {loading && <p className="text-center text-gray-600">Loading documents...</p>}
                        {error && <p className="text-center text-red-600">Error: {error}</p>}

                        {!loading && !error && (
                            currentContent?.documents && currentContent.documents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentContent.documents.map((doc: Document, docIndex: number) => (
                                        <PublicationDocumentCard
                                            key={doc.objectId || docIndex}
                                            doc={doc}
                                            delay={docIndex * 100}
                                        />
                                    ))}
                                </div>
                            ) : (
                                currentContent?.content && (
                                    <div className="prose prose-lg text-gray-700">
                                        {currentContent.content}
                                    </div>
                                )
                            )
                        )}
                        {!loading && !error && currentContent && !currentContent.documents && !currentContent.content && (
                            <p className="text-center text-gray-500">No content available for this section.</p>
                        )}
                        {!loading && !error && currentContent?.documents && currentContent.documents.length === 0 && (
                            <p className="text-center text-gray-500">No documents found for this section.</p>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default PublicationContent;
