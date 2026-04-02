import ProductDashboard from "../components/ProductDashboard";

interface IndexProps {
  onLogout?: () => void;
}
const Index = ({ onLogout }: IndexProps) => {
  return <ProductDashboard onLogout={onLogout} />;
};

export default Index;
