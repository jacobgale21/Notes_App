import Sidebar from "../UI/sidebar";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <div className="w-1/6 h-full">
        <Sidebar />
      </div>
    </div>
  );
}
