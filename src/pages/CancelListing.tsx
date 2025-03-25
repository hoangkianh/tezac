'use client';
import React, { useState, useEffect } from 'react';

// Mock data for active listings
const mockPublicListings: Listing[] = [
    { id: 1, tokenId: 'NFT-123', name: 'Cosmic Dreams #123', price: '0.5', image: 'https://placehold.co/600x400/1A1A1A/a0e82c?text=NFT+123', type: 'public' },
    { id: 2, tokenId: 'NFT-456', name: 'Digital Universe #456', price: '0.78', image: 'https://placehold.co/600x400/1A1A1A/a0e82c?text=NFT+456', type: 'public' },
    { id: 3, tokenId: 'NFT-789', name: 'Future Visions #789', price: '1.2', image: 'https://placehold.co/600x400/1A1A1A/a0e82c?text=NFT+789', type: 'public' },
];

const mockPrivateListings: Listing[] = [
    { id: 4, tokenId: 'NFT-012', name: 'Abstract World #012', price: '2.0', image: 'https://placehold.co/600x400/1A1A1A/a0e82c?text=NFT+012', type: 'private', allowedBuyers: ['0x1234...', '0x5678...'] },
    { id: 5, tokenId: 'NFT-345', name: 'Neon City #345', price: '0.65', image: 'https://placehold.co/600x400/1A1A1A/a0e82c?text=NFT+345', type: 'private', allowedBuyers: ['0xabcd...'] },
];

interface Listing {
    id: number;
    tokenId: string;
    name: string;
    price: string;
    image: string;
    type: 'public' | 'private';
    allowedBuyers?: string[];
}

const CancelListing: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelInProgress, setCancelInProgress] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('public');

    // Fetch listings on component mount and when tab changes
    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 0));

            // Set mock data based on active tab
            if (activeTab === 'public') {
                setListings(mockPublicListings);
            } else {
                setListings(mockPrivateListings);
            }
            setIsLoading(false);
        };

        fetchListings();
    }, [activeTab]);

    const handleCancelListing = async (listingId: number) => {
        setCancelInProgress(listingId);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 0));

            console.log('Cancelling listing:', listingId, 'Type:', activeTab);

            // Remove the cancelled listing from the state
            setListings(currentListings => currentListings.filter(listing => listing.id !== listingId));
        } catch (error) {
            console.error('Error cancelling listing:', error);
            alert('Failed to cancel listing. Please try again.');
        } finally {
            setCancelInProgress(null);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '800px' }}>
            <h2 className="form-title">Your Active Listings</h2>

            <div className="tabs">
                <div
                    className={`tab ${activeTab === 'public' ? 'active' : ''}`}
                    onClick={() => setActiveTab('public')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a1.93 1.93 0 0 0-.97 1.68v4.8c0 .71.44 1.35 1.1 1.62l3.6 1.42c.32.13.67.13.99 0L11 12.15c.44-.17.85-.44 1.2-.82"></path>
                        <path d="M22 16.92v3.03a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8.93a2 2 0 0 1 1.13-1.82l.22-.1A1 1 0 0 1 4 9.2v7.15a2 2 0 0 0 1.55 1.94l1.64.49c.37.11.76.11 1.13 0l7.53-2.26a2 2 0 0 0 1.45-1.94v-3.19c0-.92-.51-1.35-.77-1.55L16 10"></path>
                        <path d="M20 13v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1Z"></path>
                    </svg>
                    Public Listings
                </div>
                <div
                    className={`tab ${activeTab === 'private' ? 'active' : ''}`}
                    onClick={() => setActiveTab('private')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Private Listings
                </div>
            </div>

            <div className="tab-content">
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading your {activeTab} listings...</div>
                ) : listings.length === 0 ? (
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8 15h8"></path>
                            <path d="M9 9h.01"></path>
                            <path d="M15 9h.01"></path>
                        </svg>
                        <p>You don't have any active {activeTab} listings at the moment.</p>
                    </div>
                ) : (
                    <div>
                        {listings.map(listing => (
                            <div
                                key={listing.id}
                                className="nft-card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '15px',
                                    marginBottom: '15px'
                                }}
                            >
                                <img
                                    src={listing.image}
                                    alt={listing.name}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        marginRight: '15px'
                                    }}
                                />

                                <div style={{ flex: 1 }}>
                                    <h3 className="nft-title">
                                        {listing.name}
                                    </h3>
                                    <p className="nft-description">
                                        Token ID: {listing.tokenId}
                                    </p>
                                    <p className="nft-price">
                                        Price: {listing.price} ETH
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleCancelListing(listing.id)}
                                    disabled={cancelInProgress === listing.id}
                                    className="button-secondary"
                                >
                                    {cancelInProgress === listing.id ? 'Cancelling...' : 'Cancel Listing'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CancelListing; 