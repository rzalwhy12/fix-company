// src/types/publication.ts

export type DocumentType = 'pdf' | 'excel' | 'word' | 'image' | 'other'; 

export interface Document {
    objectId?: string; 
    name: string;
    year: string;
    link: string; 
    type: DocumentType;
    filePath?: string; 
    section?: PublicationSection; 
    created?: number;
    updated?: number; 
}

export type PublicationSection = 'financial-report' | 'annual-report' | 'idic-lps' | 'information' | 'report';

export interface PublicationContentItem {
    title: string;
    content?: React.ReactNode; 
    documents?: Document[]; 
}

export interface BreadcrumbItem {
    label: string;
    href: string;
}

export const BACKENDLESS_APP_ID = 'CB4B7873-2522-452C-9AAF-B264A0632441';
export const BACKENDLESS_API_KEY = '5932E0EF-9E5A-4FCB-BBAC-FEA223A77B55';
export const BACKENDLESS_BASE_URL = 'https://astutewool-us.backendless.app/api';
export const DOCUMENTS_TABLE_NAME = 'dokumen'; 
export const USERS_TABLE_NAME = 'Users'; 