import React from 'react';
import { Footer } from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    maxWidth?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, maxWidth = 'max-w-4xl' }) => {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30 text-white overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <div className={`container mx-auto px-4 py-8 md:py-16 ${maxWidth}`}>
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    );
};
