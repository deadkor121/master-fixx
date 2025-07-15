import ClientDashboard from "./ClientDashboard";
import MasterDashboard from "./MasterDashboard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user?.userType === "master") {
    return <MasterDashboard />;
  }

  return <ClientDashboard />;
}
