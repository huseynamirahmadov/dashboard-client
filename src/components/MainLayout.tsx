import Footer from "./Footer";
import Header from "./Header";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-surface-950">
            <Header />
            <div className="flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 py-6">
                <main className="bg-surface-900 border border-surface-800 rounded-2xl p-5 sm:p-7 lg:p-8 min-h-[calc(100vh-180px)]">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;