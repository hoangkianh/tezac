'use client';

import React, { useState } from 'react';

const Transfer: React.FC = () => {
    const [formData, setFormData] = useState({
        recipient: '',
        tokenId: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('public');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.recipient || !formData.tokenId) {
            alert('Please fill all fields');
            return;
        }

        setIsLoading(true);

        // Mock API call to transfer NFT
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Transferring NFT:', formData, 'Mode:', activeTab);
            setIsSuccess(true);

            // Reset form after successful transfer
            setTimeout(() => {
                setFormData({
                    recipient: '',
                    tokenId: '',
                });
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error transferring NFT:', error);
            alert('Failed to transfer NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="page-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', marginBottom: '10px', width: '100%' }}>
                    <h2 className="form-title">
                        Transfer an NFT
                    </h2>
                    <p style={{ margin: 0 }}>
                        <strong>Public transfer:</strong> Everyone can see your transfer details including the sender, recipient and token ID.
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Private transfer:</strong> No one can see your transfer details.
                    </p>
                </div>
            </div>
            <div className="tabs">
                <div
                    className={`tab ${activeTab === 'public' ? 'active' : ''}`}
                    onClick={() => setActiveTab('public')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    </svg>
                    Public Transfer
                </div>
                <div
                    className={`tab ${activeTab === 'private' ? 'active' : ''}`}
                    onClick={() => setActiveTab('private')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Private Transfer
                </div>
            </div>

            <div className="tab-content">
                {isSuccess && (
                    <div className="alert alert-success">
                        <p>NFT transferred successfully in {activeTab} mode!</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="recipient" className="form-label">Recipient Address</label>
                        <input
                            type="text"
                            id="recipient"
                            name="recipient"
                            value={formData.recipient}
                            onChange={handleChange}
                            placeholder="Enter recipient address"
                            className="form-input"
                            required
                        />
                    </div>

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

                    {activeTab === 'private' && (
                        <div className="form-group">
                            <label htmlFor="privateNote" className="form-label">Private Note (optional)</label>
                            <input
                                type="text"
                                id="privateNote"
                                name="privateNote"
                                placeholder="Add a private note for this transfer"
                                className="form-input"
                            />
                            <span className="form-helper">This note is only visible to you and the recipient</span>
                        </div>
                    )}


                    <button type="submit" disabled={isLoading} className="button-primary button-full">
                        {isLoading ? 'Transferring...' : `Transfer NFT (${activeTab})`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Transfer; 