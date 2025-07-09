'use client'; 

import AboutUsClientPage from '@/components/AboutUsClientPage';

const CURRENT_PAGE_ID = 'mission-statement';

export default function MissionStatementPage() {
    return <AboutUsClientPage initialId={CURRENT_PAGE_ID} />;
}
