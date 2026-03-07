import Footer from "./Footer";
import Header from "./Header";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-dark-950">
            <Header />
            <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;