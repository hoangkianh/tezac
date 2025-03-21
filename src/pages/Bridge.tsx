'use client';

import React, { useState } from 'react';

// Layer 2 blockchain options
const layer2Options = [
    { value: 'polygon', label: 'Polygon' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'optimism', label: 'Optimism' },
    { value: 'zksync', label: 'zkSync' },
    { value: 'starknet', label: 'StarkNet' },
];

const Bridge: React.FC = () => {
    const [formData, setFormData] = useState({
        sourceChain: 'polygon',
        tokenId: '',
        asset: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.sourceChain || !formData.tokenId || !formData.asset) {
            alert('Please fill all fields');
            return;
        }

        setIsLoading(true);

        // Mock API call for bridging
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            console.log('Bridging NFT:', formData);
            setIsSuccess(true);

            // Reset form after successful bridge
            setTimeout(() => {
                setFormData({
                    ...formData,
                    tokenId: '',
                });
                setIsSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Error bridging NFT:', error);
            alert('Failed to bridge NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Get blockchain label from value
    const getBlockchainLabel = (value: string) => {
        const option = layer2Options.find(opt => opt.value === value);
        return option ? option.label : value;
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Bridge NFT to Aztec</h2>

            {isSuccess && (
                <div className="alert alert-success">
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Bridge initiated successfully!</p>
                    <p style={{ margin: '0', fontSize: '0.9rem' }}>
                        Bridging NFT #{formData.tokenId} ({formData.asset}) from {getBlockchainLabel(formData.sourceChain)} to Aztec
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem' }}>
                        This process may take several minutes to complete.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="sourceChain" className="form-label">Source Layer 2 Network</label>
                    <select
                        id="sourceChain"
                        name="sourceChain"
                        value={formData.sourceChain}
                        onChange={handleChange}
                        className="form-input form-select"
                        required
                    >
                        {layer2Options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="destinationChain" className="form-label">Destination Network</label>
                    <div className="form-input" style={{ backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                                <path d="M12 12h.01"></path>
                                <path d="M17 12h.01"></path>
                                <path d="M7 12h.01"></path>
                            </svg>
                            Aztec
                        </div>
                    </div>
                    <p className="form-helper">All NFTs will be bridged to Aztec network for privacy</p>
                </div>

                <div className="form-group">
                    <label htmlFor="asset" className="form-label">NFT Collection</label>
                    <select
                        id="asset"
                        name="asset"
                        value={formData.asset}
                        onChange={handleChange}
                        className="form-input form-select"
                        required
                    >
                        <option value="">Select collection</option>
                        <option value="PudgyPenguins">Pudgy Penguins</option>
                        <option value="BoredApeYachtClub">Bored Ape Yacht Club</option>
                        <option value="MutantApeYachtClub">Mutant Ape Yacht Club</option>
                        <option value="Azuki">Azuki</option>
                        <option value="Doodles">Doodles</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="tokenId" className="form-label">Token ID</label>
                    <input
                        type="text"
                        id="tokenId"
                        name="tokenId"
                        value={formData.tokenId}
                        onChange={handleChange}
                        placeholder="Enter NFT Token ID"
                        className="form-input"
                        required
                    />
                    <p className="form-helper">The unique identifier for your NFT in the collection</p>
                </div>

                <div className="alert alert-info">
                    <p style={{ margin: '0', fontSize: '0.9rem' }}>
                        After bridging, your NFT will remain on the source chain, but its ownership and transaction details will become confidential, enabling you to continue trading your NFTs privately on the original chain.                    </p>
                </div>

                <button type="submit" disabled={isLoading} className="button-primary button-full">
                    {isLoading ? 'Processing...' : 'Bridge NFT to Aztec'}
                </button>
            </form>
        </div>
    );
};

export default Bridge; 