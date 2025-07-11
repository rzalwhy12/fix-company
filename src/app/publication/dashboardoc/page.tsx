// src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Document,
    DocumentType,
    PublicationSection,
    BACKENDLESS_BASE_URL,
    DOCUMENTS_TABLE_NAME,
    BACKENDLESS_APP_ID,
    BACKENDLESS_API_KEY,
} from '@/types/publication';

const BACKENDLESS_FILES_BASE_URL = 'https://astutewool-us.backendless.app/api/files/web/';

const DashboardPage: React.FC = () => {
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDocument, setCurrentDocument] = useState<Partial<Document>>({
        name: '',
        year: String(new Date().getFullYear()),
        filePath: '',
        type: 'pdf',
        section: 'financial-report',
    });

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated !== 'true') {
            // !!! PENTING: Ubah ini jika Anda ingin login langsung ke root path '/'
            // router.replace('/login'); // Contoh jika login page ada di /login
            router.replace('/publication/logindoc'); // Biarkan seperti ini jika login page Anda tetap di /publication/logindoc
        }
    }, [router]);

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BACKENDLESS_BASE_URL}/data/${DOCUMENTS_TABLE_NAME}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'application-id': BACKENDLESS_APP_ID,
                    'secret-key': BACKENDLESS_API_KEY,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: Document[] = await response.json();
            setDocuments(data);
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

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentDocument((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setCurrentDocument((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const documentToSave = {
            ...currentDocument,
            link: `${BACKENDLESS_FILES_BASE_URL}${currentDocument.filePath}`,
        };
        delete documentToSave.filePath;

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `${BACKENDLESS_BASE_URL}/data/${DOCUMENTS_TABLE_NAME}/${currentDocument.objectId}`
            : `${BACKENDLESS_BASE_URL}/data/${DOCUMENTS_TABLE_NAME}`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'application-id': BACKENDLESS_APP_ID,
                    'secret-key': BACKENDLESS_API_KEY,
                },
                body: JSON.stringify(documentToSave),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to ${isEditing ? 'update' : 'create'} document: ${errorData.message || response.statusText}`);
            }

            await fetchDocuments();
            resetForm();
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} document.`);
        }
    };

    const handleEdit = (doc: Document) => {
        const path = doc.link.replace(BACKENDLESS_FILES_BASE_URL, '');
        setCurrentDocument({ ...doc, filePath: path });
        setIsEditing(true);
    };

    const handleDelete = async (objectId: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        setError(null);
        try {
            const response = await fetch(`${BACKENDLESS_BASE_URL}/data/${DOCUMENTS_TABLE_NAME}/${objectId}`, {
                method: 'DELETE',
                headers: {
                    'application-id': BACKENDLESS_APP_ID,
                    'secret-key': BACKENDLESS_API_KEY,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to delete document: ${errorData.message || response.statusText}`);
            }

            await fetchDocuments();
        } catch (err: any) {
            console.error('Deletion error:', err);
            setError(err.message || 'Failed to delete document.');
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentDocument({
            name: '',
            year: String(new Date().getFullYear()),
            filePath: '',
            type: 'pdf',
            section: 'financial-report',
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        router.push('/publication');
    };

    return (
        <div className="min-h-screen bg-blue-900 text-white py-8 ">
            <div className="container mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Dashboard Publikasi</h1>
                    <Button onClick={handleLogout} variant="destructive">Logout</Button>
                </div>

                {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{isEditing ? 'Edit Document' : 'Add New Document'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" className="text-gray-700">Document Name</Label>
                            <Input type="text" id="name" name="name" value={currentDocument.name || ''} onChange={handleFormChange} required />
                        </div>
                        <div>
                            <Label htmlFor="year" className="text-gray-700">Year</Label>
                            <Input type="number" id="year" name="year" value={currentDocument.year || ''} onChange={handleFormChange} required />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="filePath" className="text-gray-700">File Path (e.g., `reports/annual/report_2024.pdf`)</Label>
                            <div className="flex items-center">
                                <Input
                                    type="text"
                                    id="filePath"
                                    name="filePath"
                                    value={currentDocument.filePath || ''}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="type" className="text-gray-700">Document Type</Label>
                            <Select onValueChange={(val: DocumentType) => handleSelectChange('type', val)} value={currentDocument.type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="excel">Excel</SelectItem>
                                    <SelectItem value="word">Word</SelectItem>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="section" className="text-gray-700">Publication Section</Label>
                            <Select onValueChange={(val: PublicationSection) => handleSelectChange('section', val)} value={currentDocument.section}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="financial-report">Financial Report</SelectItem>
                                    <SelectItem value="annual-report">Annual Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2 flex gap-2 mt-4">
                            <Button type="submit">{isEditing ? 'Update Document' : 'Add Document'}</Button>
                            {isEditing && (
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel Edit</Button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Documents</h2>
                    {loading ? (
                        <p className="text-center text-gray-600">Loading documents...</p>
                    ) : documents.length === 0 ? (
                        <p className="text-center text-gray-500">No documents found. Start by adding one above!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {documents.map((doc) => (
                                        <tr key={doc.objectId}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.year}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.section}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                                                <a href={doc.link} target="_blank" rel="noopener noreferrer">View</a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(doc)} className="mr-2">Edit</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.objectId!)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;