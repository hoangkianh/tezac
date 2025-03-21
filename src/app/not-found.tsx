'use client';

import React from 'react';
import Link from 'next/link';
import AppLayout from './components/AppLayout';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

export default function NotFound() {
    return (
        <AppLayout>
            <div className="not-found-container">
                <FaExclamationTriangle size={64} className="not-found-icon" />
                <h1>404 - Page Not Found</h1>
                <p>Oops! The page you are looking for doesn't exist.</p>
                <Link href="/" className="return-home-btn">
                    <FaHome size={18} />
                    <span>Return to Home</span>
                </Link>
            </div>
        </AppLayout>
    );
} 