import React from 'react';

const README: React.FC = () => {
    return (
        <div className="readme-container">
            <div className="logo-container">
                <img width="240" alt="tezac-logo" src="https://github.com/user-attachments/assets/bccdb666-d196-4848-90af-d7f72b589d2f" />
            </div>

            <h1>Tezac NFT Interactive App</h1>

            <p className="lead">
                <strong>A privacy-preserving NFT trading protocol built on the Aztec Network, featuring encrypted ownership, private cross-chain trading, and seamless integration with established L1/L2 collections.</strong>
            </p>

            <hr />

            <section>
                <h2>Overview</h2>
                <p>
                    Tezac revolutionizes NFT trading by leveraging Aztec's zkRollup architecture to encrypt ownership data and transaction details.
                    This privacy-focused approach ensures complete confidentiality for trading, auctions, and gaming applications.
                    By bridging established NFT collections from Layer 1 blockchains (e.g., Ethereum) to our protocol,
                    Tezac uniquely combines the liquidity of major ecosystems with the privacy benefits of zero-knowledge proofs.
                </p>
            </section>

            <section>
                <h2>Core Features</h2>

                <h3>1. Private NFT Ownership and Trading</h3>
                <ul>
                    <li><strong>Encrypted Ownership Records</strong>: All ownership data is fully encrypted on-chain</li>
                    <li><strong>Private Note Transactions</strong>: Trading occurs through encrypted private notes</li>
                    <li><strong>Identity Protection</strong>: User identities remain completely obscured during transactions</li>
                    <li><strong>Metadata Privacy</strong>: Optional encrypted metadata for complete NFT information privacy</li>
                </ul>

                <h3>2. Hidden Reserve Prices and Blind Auctions</h3>
                <ul>
                    <li><strong>Confidential Reserve Pricing</strong>: Sellers can set reserve prices invisible to buyers</li>
                    <li><strong>Sealed-Bid Mechanisms</strong>: Participants submit encrypted bids visible only at settlement</li>
                    <li><strong>Private Auction Results</strong>: Only winning bids are revealed, preserving privacy for all participants</li>
                    <li><strong>Fair Settlement Guarantees</strong>: Zero-knowledge proofs ensure auction integrity</li>
                </ul>

                <h3>3. Cross-Chain NFT Trading</h3>
                <ul>
                    <li><strong>Seamless L1 Integration</strong>: Bridge system connects with Ethereum, Polygon, and other major NFT ecosystems</li>
                    <li><strong>Wrapped NFT Mechanism</strong>: Original NFTs are securely wrapped for privacy-preserving transactions</li>
                    <li><strong>Cross-Chain Settlement</strong>: Complete trades across different blockchains without sacrificing privacy</li>
                    <li><strong>Flexible Unwrapping</strong>: Return NFTs to original chains when desired</li>
                </ul>

                <h3>4. Provably Fair NFT Games</h3>
                <ul>
                    <li><strong>Verifiable Randomness</strong>: Cryptographically secure randomness for fair outcomes</li>
                    <li><strong>Private Participation</strong>: Join raffles and lotteries without revealing identity</li>
                    <li><strong>Transparent Results</strong>: Outcomes verifiable through zero-knowledge proofs</li>
                    <li><strong>Mystery Box Mechanics</strong>: Implement truly surprising reveals with privacy guarantees</li>
                </ul>

                <h3>5. Front-Running Resistance</h3>
                <ul>
                    <li><strong>Time-locked Submissions</strong>: Prevent miners from exploiting pending transactions</li>
                    <li><strong>Encrypted Orders</strong>: Transaction details remain hidden until settlement</li>
                    <li><strong>MEV Protection</strong>: Built-in mechanics to prevent maximal extractable value exploitation</li>
                    <li><strong>Fair Market Access</strong>: Equal opportunity for all participants regardless of network advantages</li>
                </ul>
            </section>

            <section>
                <h2>Technical Architecture</h2>
                <p>Tezac builds on Aztec Network's privacy infrastructure with several key components:</p>
                <ul>
                    <li><strong>Smart Contract Layer</strong>: Privacy-preserving Noir contracts handling ownership and transactions</li>
                    <li><strong>Bridge System</strong>: Cross-chain communication protocol for L1/L2 NFT integration</li>
                    <li><strong>Frontend Application</strong>: User-friendly interface with complete wallet integration</li>
                    <li><strong>Privacy Middleware</strong>: Handles encryption, proof generation, and verification</li>
                </ul>
            </section>

            <section>
                <h2>Frontend Implementation</h2>
                <p>Our modern React frontend offers a complete NFT management experience with seven core functionalities:</p>

                <h3>Pages and Features</h3>
                <ol>
                    <li>
                        <strong>Mint</strong>
                        <ul>
                            <li>Create new NFTs with customizable metadata</li>
                            <li>Upload and store images securely</li>
                            <li>Set privacy preferences for new assets</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Transfer</strong>
                        <ul>
                            <li>Private person-to-person transfers</li>
                            <li>Batch transfer capabilities</li>
                            <li>Address book for frequent recipients</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Listing</strong>
                        <ul>
                            <li>Customizable listing parameters including duration and pricing</li>
                            <li>Reserve price options</li>
                            <li>Automatic listing expiration handling</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Cancel-Listing</strong>
                        <ul>
                            <li>Comprehensive view of active listings</li>
                            <li>One-click cancellation</li>
                            <li>Listing history and analytics</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Buy</strong>
                        <ul>
                            <li>Immersive marketplace experience</li>
                            <li>Advanced filtering and search</li>
                            <li>Secure purchasing workflow</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Verify-Ownership</strong>
                        <ul>
                            <li>On-chain verification of NFT ownership</li>
                            <li>Ownership history timelines</li>
                            <li>Authenticity validation</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Bridge</strong>
                        <ul>
                            <li>Multi-chain asset bridging</li>
                            <li>Automated fee calculation</li>
                            <li>Cross-chain transaction monitoring</li>
                        </ul>
                    </li>
                </ol>
            </section>

            <section>
                <h2>Roadmap</h2>
                <table className="roadmap-table">
                    <thead>
                        <tr>
                            <th>Phase</th>
                            <th>Focus</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Create Private NFT Contracts</td>
                            <td>WIP</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Private Listings & Purchasing</td>
                            <td>WIP</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Cross-Chain Trading</td>
                            <td>Planned</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Auction Mechanisms</td>
                            <td>Planned</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>Gaming Integrations</td>
                            <td>Future</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>Mobile Applications</td>
                            <td>Future</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2>Community and Support</h2>
                <ul>
                    <li><strong>Telegram</strong>: Join our community <a href="https://t.me/+WI9728WPBOE0N2M1" target="_blank" rel="noopener noreferrer">here</a></li>
                    <li><strong>Discord</strong>: Coming soon!</li>
                    <li><strong>Issues</strong>: Report bugs or request features through <a href="https://github.com/your-username/tezac/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a></li>
                    <li><strong>Twitter</strong>: Follow us for updates <a href="https://twitter.com/Tezac_xyz" target="_blank" rel="noopener noreferrer">@Tezac_xyz</a></li>
                </ul>
            </section>

            <footer>
                <p>This project is licensed under the MIT License - see the LICENSE file for details.</p>
            </footer>
        </div>
    );
};

export default README; 