import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30 text-white overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-4xl">
                {children}
            </div>
        </div>
    );
};
