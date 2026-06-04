import { useEffect } from "react";
import { useStore } from "@/store";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import InvoiceGenerator from "./components/InvoiceGenerator";
import InvoiceHistory from "./components/InvoiceHistory";
import CustomersView from "./components/CustomersView";
import ExpensesView from "./components/ExpensesView";
import CalculatorView from "./components/CalculatorView";
import SalesView from "./components/SalesView";
import TaxAssistantView from "./components/TaxAssistantView";
import SettingsView from "./components/SettingsView";

export default function App() {
  const { view, user, theme, activeTab } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (view === "landing" || !user) {
    return <LandingPage />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardView />;
      case "invoice": return <InvoiceGenerator />;
      case "history": return <InvoiceHistory />;
      case "customers": return <CustomersView />;
      case "expenses": return <ExpensesView />;
      case "calculator": return <CalculatorView />;
      case "sales": return <SalesView />;
      case "tax": return <TaxAssistantView />;
      case "settings": return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return <Sidebar>{renderTab()}</Sidebar>;
}
