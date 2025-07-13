// src/components/PublicationDocumentCard.tsx
import React from 'react';
import { FileText, FileSpreadsheet, FileImage, File } from 'lucide-react';
// This import is crucial for the 'Document' type
import { Document, DocumentType } from '@/types/publication';

interface PublicationDocumentCardProps {
    doc: Document; 
    delay?: number;
}

const getFileIcon = (type: DocumentType) => {
    switch (type) {
        case 'pdf': return <FileText className="h-6 w-6 text-red-500" />;
        case 'excel': return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
        case 'image': return <FileImage className="h-6 w-6 text-blue-500" />;
        case 'word': return <FileText className="h-6 w-6 text-blue-700" />;
        default: return <File className="h-6 w-6 text-gray-500" />;
    }
};

const PublicationDocumentCard: React.FC<PublicationDocumentCardProps> = ({ doc, delay = 0 }) => {
    return (
        <a
            href={doc.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 group"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex-shrink-0 mr-4">
                {getFileIcon(doc.type)}
            </div>
            <div className="flex-grow">
                <h4 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                    {doc.name}
                </h4>
                <p className="text-sm text-gray-500">{doc.year}</p>
            </div>
        </a>
    );
};

export default PublicationDocumentCard;