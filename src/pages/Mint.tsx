import React, { useState } from 'react';
import { FaLock, FaGlobe } from 'react-icons/fa';

const Mint: React.FC = () => {
    const [mintType, setMintType] = useState<'public' | 'private'>('public');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null as File | null,
        isPrivate: false,
        recipientAddress: '',
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleTabChange = (type: 'public' | 'private') => {
        setMintType(type);
        setFormData({
            ...formData,
            isPrivate: type === 'private',
            recipientAddress: type === 'private' ? formData.recipientAddress : '',
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, image: file });

            // Create a preview URL for the image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.name || !formData.description || !formData.image) {
            alert('Please fill all required fields and upload an image');
            return;
        }

        // Validate recipient address for private mint
        if (mintType === 'private' && !formData.recipientAddress) {
            alert('Please enter a recipient address for private minting');
            return;
        }

        setIsLoading(true);

        // Mock API call to mint NFT
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Minting NFT:', formData);
            setIsSuccess(true);

            // Reset form after successful mint
            setTimeout(() => {
                setFormData({
                    name: '',
                    description: '',
                    image: null,
                    isPrivate: mintType === 'private',
                    recipientAddress: '',
                });
                setPreviewUrl(null);
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error minting NFT:', error);
            alert('Failed to mint NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="page-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', marginBottom: '10px', width: '100%' }}>
                    <h2 className="form-title">
                        Mint an NFT
                    </h2>
                    <p style={{ margin: 0 }}>
                        <strong>Public mint:</strong> The NFT will be publicly minted and transferred to the specified address. Transaction details will be visible to everyone including the sender, recipient and token ID.
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Private mint:</strong> The NFT will be privately minted and transferred to the specified address. Transaction details will be hidden.
                    </p>
                </div>
            </div>

            {isSuccess && (
                <div className="alert alert-success">
                    <p>NFT minted successfully! {mintType === 'private' ? 'The NFT has been privately minted and transferred to the specified address.' : 'The NFT is now publicly visible in your collection.'}</p>
                </div>
            )}

            <div className="tabs">
                <div
                    className={`tab ${mintType === 'public' ? 'active' : ''}`}
                    onClick={() => handleTabChange('public')}
                >
                    <FaGlobe size={16} style={{ marginRight: '6px' }} />
                    Public Mint
                </div>
                <div
                    className={`tab ${mintType === 'private' ? 'active' : ''}`}
                    onClick={() => handleTabChange('private')}
                >
                    <FaLock size={16} style={{ marginRight: '6px' }} />
                    Private Mint
                </div>
            </div>

            <div className="tab-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter NFT name"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter NFT description"
                            rows={4}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="recipientAddress" className="form-label">Recipient Address</label>
                        <input
                            type="text"
                            id="recipientAddress"
                            name="recipientAddress"
                            value={formData.recipientAddress}
                            onChange={handleChange}
                            placeholder="Enter recipient's wallet address"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image</label>
                        <div className="file-input-container">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="NFT Preview"
                                    className="file-preview"
                                />
                            ) : (
                                <div className="file-input-placeholder">
                                    <p>Drag and drop your image here or click to browse</p>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="button-primary button-full">
                        {isLoading ? 'Minting...' : `Mint NFT (${mintType})`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Mint; 