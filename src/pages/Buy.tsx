'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Mock data for NFTs
const mockNFTs = [
    {
        id: 1,
        name: 'Digital Dreamscape #001',
        description: 'A surreal landscape of digital imagination where reality meets dreams.',
        image: 'https://i.seadn.io/gcs/files/0344df4ead286e62c0484d0471f45b8e.png?auto=format&dpr=1&w=500',
        price: '0.45',
        seller: 'Anonymous',
        collection: 'Digital Dreams',
        type: 'public'
    },
    {
        id: 2,
        name: 'Cyber Punk #042',
        description: 'Futuristic cyber aesthetics with neon-colored dystopian vibes.',
        image: 'https://i.seadn.io/gcs/files/0344df4ead286e62c0484d0471f45b8e.png?auto=format&dpr=1&w=500',
        price: '0.32',
        seller: '0x2345...bcde',
        collection: 'Cyber Collective',
        type: 'public'
    },
    {
        id: 3,
        name: 'Abstract Geometry #103',
        description: 'Geometric patterns fused with abstract art creating unique visual experiences.',
        image: 'https://i.seadn.io/gcs/files/0344df4ead286e62c0484d0471f45b8e.png?auto=format&dpr=1&w=500',
        price: '0.28',
        seller: 'Anonymous',
        collection: 'Abstract Originals',
        type: 'public'
    },
    {
        id: 4,
        name: 'Space Odyssey #007',
        description: 'Explore the depths of cosmos with this space-themed digital collectible.',
        image: 'https://i.seadn.io/gcs/files/0344df4ead286e62c0484d0471f45b8e.png?auto=format&dpr=1&w=500',
        price: '0.65',
        seller: '0x4567...defg',
        collection: 'Space Voyagers',
        type: 'private',
        allowedBuyers: ['0x1234...abcd', 'Your wallet']
    },
    {
        id: 5,
        name: 'Pixel Paradise #218',
        description: '8-bit nostalgia meets modern digital art in this pixel-perfect creation.',
        image: 'https://i.seadn.io/gcs/files/0344df4ead286e62c0484d0471f45b8e.png?auto=format&dpr=1&w=500',
        price: '0.18',
        seller: '0x5678...efgh',
        collection: 'Pixel Masters',
        type: 'private',
        allowedBuyers: ['Your wallet']
    },
    {
        id: 6,
        name: 'Nature Reimagined #056',
        description: 'A digital reinterpretation of natural landscapes with an artistic twist.',
        image: 'https://i.seadn.io/gcs/files/0344df4ead286e62c0484d0471f45b8e.png?auto=format&dpr=1&w=500',
        price: '0.39',
        seller: '0x6789...fghi',
        collection: 'Digital Wilderness',
        type: 'private',
        allowedBuyers: ['0x1234...abcd', 'Your wallet', '0x3456...cdef']
    },
];

const Buy: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [nfts, setNfts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('public');
    const [selectedCollection, setSelectedCollection] = useState('');

    // Simulate fetch of NFTs
    useEffect(() => {
        const fetchNFTs = async () => {
            setIsLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 0));

            setNfts(mockNFTs);

            setIsLoading(false);
        };

        fetchNFTs();
    }, [activeTab]);

    // Handle buy action
    const handleBuy = (id: number, name: string, price: string) => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success(`Successfully purchased ${name} for ${price} ETH!`);
        }, 0);
    };

    // Filter NFTs based on search term and selected collection
    const filteredNFTs = nfts.filter(nft => {
        const matchesSearch =
            nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nft.collection.toLowerCase().includes(searchTerm.toLowerCase());

        if (!selectedCollection) return matchesSearch;
        return matchesSearch && nft.collection === selectedCollection;
    });

    // Get unique collections for filter dropdown
    const collections = [...new Set(nfts.map(nft => nft.collection))];

    return (
        <div className="form-container" style={{ maxWidth: '1000px' }}>
            <div className="page-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', marginBottom: '10px', width: '100%' }}>
                    <h2 className="form-title">
                        Buy NFTs
                    </h2>
                    <p style={{ margin: 0 }}>
                        <strong>Public buy:</strong> Everyone can see your buy transaction details including the seller, price, and what NFT you bought.
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Private buy:</strong> No one can see your buy transaction details.
                    </p>
                </div>
            </div>

            <div className="tab-content">
                {isLoading ? (
                    <div className="nft-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="nft-card">
                                <div className="skeleton" style={{ height: '200px' }}></div>
                                <div style={{ padding: '16px' }}>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton" style={{ height: '40px', marginTop: '16px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredNFTs.length > 0 ? (
                    <>
                        <div className="nft-grid">
                            {filteredNFTs.map((nft) => (
                                <div key={nft.id} className="nft-card">
                                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                                        <img src={nft.image} alt={nft.name} className="nft-image" />
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: 'rgba(0,0,0,0.6)',
                                            backdropFilter: 'blur(4px)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '4px 8px',
                                            fontSize: '0.8rem',
                                            fontWeight: '500'
                                        }}>
                                            {nft.collection}
                                        </div>
                                        {nft.type === 'private' && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                background: 'rgba(0,0,0,0.6)',
                                                backdropFilter: 'blur(4px)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '4px 8px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500',
                                                color: 'var(--accent-primary)'
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
                                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                </svg>
                                                Private
                                            </div>
                                        )}
                                    </div>

                                    <div className="nft-info">
                                        <h3 className="nft-title">{nft.name}</h3>
                                        <p className="nft-description">{nft.description}</p>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '16px'
                                        }}>
                                            <div className="nft-price">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M19.13 4.92 12.25 2l-6.94 2.94a2 2 0 0 0-1.06 2.42l1.78 6.4a8 8 0 0 0 3.76 4.86l2.21 1.25 2.25-1.25a8 8 0 0 0 3.76-4.86l1.86-6.39a2 2 0 0 0-1.14-2.45Z"></path>
                                                    <path d="m12.25 2-2.4 4"></path>
                                                    <path d="m12.25 2 2.4 4"></path>
                                                    <path d="M4.06 7.79 8.7 9.25"></path>
                                                    <path d="m19.13 4.92-3.93 3.93"></path>
                                                </svg>
                                                {nft.price} ETH
                                            </div>
                                            <div className="nft-owner">
                                                By {nft.seller}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                className="button-primary"
                                                style={{ flex: 1 }}
                                                onClick={() => handleBuy(nft.id, nft.name, nft.price)}
                                            >
                                                Public Buy
                                            </button>
                                            <button
                                                className="button-primary"
                                                style={{ flex: 1 }}
                                                onClick={() => handleBuy(nft.id, nft.name, nft.price)}
                                            >
                                                Private Buy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8 15h8"></path>
                            <path d="M9 9h.01"></path>
                            <path d="M15 9h.01"></path>
                        </svg>
                        <p>No NFTs found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Buy;