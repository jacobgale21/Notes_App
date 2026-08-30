import { useGetGraphs } from "../../hooks/useCatalog";
import { useParams } from "react-router-dom";
import type { Graph } from "../../data/types";
import Sidebar from "../UI/sidebar";
import Header from "../UI/header";
import { useNavigate } from "react-router-dom";
import { formatUpdatedAt } from "../../lib/format";

export default function Subjects() {
  const navigate = useNavigate();
  const { data: graphs } = useGetGraphs();
  const { subject } = useParams();
  const graphsInSubject = graphs?.filter(
    (graph: Graph) => graph.subject === subject,
  );
  return (
    <div className="flex flex-row h-screen">
      <div className="w-1/6 h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col w-5/6 h-full ">
        <Header title={subject ?? "Subject"} />
        <div className="flex flex-col items-start justify-start w-9/10 mx-auto">
          <section className="mt-6 w-full">
            <h2>Your {subject} Notes</h2>
            <div className="mt-4 flex flex-col items-start justify-center gap-2 w-full">
              {graphsInSubject?.map((graph: Graph) => (
                <button
                  key={graph.title}
                  className="flex flex-col items-start justify-center gap-2 bg-background rounded-lg shadow-lg w-full p-6 hover:bg-paper"
                  onClick={() => navigate(`/graph/${graph.id}`)}
                >
                  <span className="text-sm text-muted-foreground rounded-full bg-paper py-1 px-2 mb-2">
                    {graph.subject}
                  </span>
                  <h4>{graph.title}</h4>
                  <span className="text-md text-muted-foreground">
                    Updated {formatUpdatedAt(graph.updated_at)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
