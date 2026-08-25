import Sidebar from "../UI/sidebar";
import { Button } from "../UI/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "../UI/header";

export default function Dashboard() {
  return (
    <div className="flex flex-row h-screen">
      <div className="w-1/6 h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col w-5/6 h-full ">
        <Header title="Home" />
        <div className="flex flex-col items-start justify-start w-9/10 mx-auto">
          <header className="mt-4 flex flex-col items-start justify-start p-4 bg-background rounded-lg shadow-lg w-full">
            <h2>Welcome back, Jacob</h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              You left off in Computer Architecture. Instruction Cycle and CPI
              are your weakest links — a quick quiz would help.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="brand">
                <Link to="/app/graph/$graphId">
                  Resume graph <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/app/study/$graphId">Study now</Link>
              </Button>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}
