
'use client';

import AboutUsClientPage from '@/components/AboutUsClientPage';

const CURRENT_PAGE_ID = 'office-locations'; 

export default function OfficeLocationsPage() {
    return <AboutUsClientPage initialId={CURRENT_PAGE_ID} />;
}