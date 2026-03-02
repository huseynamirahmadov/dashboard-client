import Footer from "./Footer";
import Header from "./Header";


interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            <main className="py-8 container mx-auto">{children}</main>
            <Footer />
        </>
    );
};

export default MainLayout;