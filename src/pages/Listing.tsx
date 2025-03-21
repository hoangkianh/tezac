'use client';

import React, { useState } from 'react';

const Listing: React.FC = () => {
    const [formData, setFormData] = useState({
        tokenId: '',
        price: '',
        duration: '7',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('public');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.tokenId || !formData.price || !formData.duration) {
            alert('Please fill all fields');
            return;
        }

        setIsLoading(true);

        // Mock API call to list NFT
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Listing NFT:', formData, 'Mode:', activeTab);
            setIsSuccess(true);

            // Reset form after successful listing
            setTimeout(() => {
                setFormData({
                    tokenId: '',
                    price: '',
                    duration: '7',
                });
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error listing NFT:', error);
            alert('Failed to list NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="page-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', marginBottom: '10px', width: '100%' }}>
                    <h2 className="form-title">
                        List an NFT for Sale
                    </h2>
                    <p style={{ margin: 0 }}>
                        <strong>Public listing:</strong> Everyone can see your listing details.
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Private listing:</strong> Same as public listing but the seller address is hidden.
                    </p>
                </div>
            </div>
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
                    Public Listing
                </div>
                <div
                    className={`tab ${activeTab === 'private' ? 'active' : ''}`}
                    onClick={() => setActiveTab('private')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Private Listing
                </div>
            </div>

            <div className="tab-content">
                {isSuccess && (
                    <div className="alert alert-success">
                        <p>NFT listed successfully as {activeTab} listing!</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="tokenId" className="form-label">Token ID</label>
                        <input
                            type="text"
                            id="tokenId"
                            name="tokenId"
                            value={formData.tokenId}
                            onChange={handleChange}
                            placeholder="Enter token ID"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price" className="form-label">Price (ETH)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price in ETH"
                            className="form-input"
                            step="0.001"
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration" className="form-label">Duration</label>
                        <select
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="form-input form-select"
                            required
                        >
                            <option value="1">1 day</option>
                            <option value="3">3 days</option>
                            <option value="7">7 days</option>
                            <option value="14">14 days</option>
                            <option value="30">30 days</option>
                        </select>
                        {activeTab === 'private' ? (
                            <span className="form-helper">The NFT will be privately listed, meaning no one can see the seller.</span>
                        ) : (
                            <span className="form-helper">The NFT will be publicly listed, meaning everyone can see the seller.</span>
                        )}
                    </div>

                    <button type="submit" disabled={isLoading} className="button-primary button-full">
                        {isLoading ? 'Listing...' : `List NFT (${activeTab})`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Listing; 