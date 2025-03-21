'use client';

import AppLayout from './components/AppLayout';
import ReadmeContent from '../src/pages/README';
import Script from 'next/script';

export default function Home() {
    return (
        <>
            <Script id="structured-data" type="application/ld+json">
                {`
                {
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "Tezac NFT Interactive App",
                    "applicationCategory": "Blockchain",
                    "operatingSystem": "Web",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "description": "A privacy-preserving NFT trading protocol built on the Aztec Network, featuring encrypted ownership, private cross-chain trading, and seamless integration with established L1/L2 collections."
                }
                `}
            </Script>
            <AppLayout>
                <ReadmeContent />
            </AppLayout>
        </>
    );
} 