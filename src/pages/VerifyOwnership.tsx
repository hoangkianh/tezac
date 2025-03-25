'use client';

import React, { useState } from 'react';

// Mock ownership data
const mockOwnershipData = {
    'NFT-001': { owner: '0x1234...abcd', timestamp: '2023-08-15T14:23:45Z' },
    'NFT-002': { owner: '0x2345...bcde', timestamp: '2023-09-22T09:12:36Z' },
    'NFT-003': { owner: '0x3456...cdef', timestamp: '2023-10-05T16:48:21Z' },
    'NFT-123': { owner: '0x7890...hijk', timestamp: '2023-11-12T11:34:59Z' },
    'NFT-456': { owner: '0x8901...ijkl', timestamp: '2023-12-03T08:27:14Z' },
};

interface OwnershipData {
    owner: string;
    timestamp: string;
}

const VerifyOwnership: React.FC = () => {
    const [tokenId, setTokenId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<OwnershipData | null>(null);
    const [notFound, setNotFound] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTokenId(e.target.value);
        // Reset results when input changes
        setResult(null);
        setNotFound(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tokenId) {
            alert('Please enter a token ID');
            return;
        }

        setIsLoading(true);
        setResult(null);
        setNotFound(false);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Check mock data
            const ownershipData = mockOwnershipData[tokenId as keyof typeof mockOwnershipData];

            if (ownershipData) {
                setResult(ownershipData);
            } else {
                setNotFound(true);
            }
        } catch (error) {
            console.error('Error verifying ownership:', error);
            alert('Failed to verify ownership. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Format timestamp for display
    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="form-container">
            <div className="page-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', marginBottom: '10px', width: '100%' }}>
                    <h2 className="form-title">
                        Verify NFT Ownership
                    </h2>
                    <p style={{ margin: 0 }}>
                        Verify the ownership of an NFT without revealing the owner's address and token ID.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="tokenId" className="form-label">Token ID</label>
                    <input
                        type="text"
                        id="tokenId"
                        value={tokenId}
                        onChange={handleChange}
                        placeholder="Enter token ID (e.g., NFT-123)"
                        className="form-input"
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading} className="button-primary button-full">
                    {isLoading ? 'Verifying...' : 'Verify Ownership'}
                </button>
            </form>

            {/* Results section */}
            {(result || notFound) && (
                <div className={`alert ${notFound ? 'alert-error' : 'alert-success'}`}>
                    <h3 style={{
                        margin: '0 0 15px 0',
                        color: notFound ? 'var(--error-color)' : 'var(--accent-primary)'
                    }}>
                        Verification Result
                    </h3>

                    {notFound ? (
                        <p style={{ margin: '0', color: 'var(--error-color)' }}>
                            No ownership data found for token ID: {tokenId}
                        </p>
                    ) : result && (
                        <div>
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Token ID: </span>
                                <span style={{ color: 'var(--text-active)' }}>{tokenId}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Owner: </span>
                                <span style={{ color: 'var(--text-active)' }}>{result.owner}</span>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-secondary)' }}>Ownership since: </span>
                                <span style={{ color: 'var(--text-active)' }}>{formatDate(result.timestamp)}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VerifyOwnership; 