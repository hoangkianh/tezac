import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Import page components
import README from './pages/README';
import Mint from './pages/Mint';
import Transfer from './pages/Transfer';
import Listing from './pages/Listing';
import CancelListing from './pages/CancelListing';
import Buy from './pages/Buy';
import VerifyOwnership from './pages/VerifyOwnership';
import Bridge from './pages/Bridge';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<README />} />
                    <Route path="mint" element={<Mint />} />
                    <Route path="transfer" element={<Transfer />} />
                    <Route path="listing" element={<Listing />} />
                    <Route path="cancel-listing" element={<CancelListing />} />
                    <Route path="buy" element={<Buy />} />
                    <Route path="verify-ownership" element={<VerifyOwnership />} />
                    <Route path="bridge" element={<Bridge />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App; 