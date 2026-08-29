import type { Graph, Node, RelType } from "./types";

export const demoSections: Node[] = [
  {
    id: "arrays",
    title: "Arrays",
    description: "A contiguous block of memory",
    type: "topic",
    content: [
      { id: "arrays-1", type: "text", text: "O(1) access" },
      { id: "arrays-2", type: "text", text: "O(n) insertion" },
      { id: "arrays-3", type: "text", text: "O(n) deletion" },
    ],
  },
  {
    id: "lists",
    title: "Linked lists",
    description: "A linked list is a linear data structure",
    type: "topic",
    content: [
      { id: "lists-1", type: "text", text: "O(1) insert" },
      { id: "lists-2", type: "text", text: "O(n) deletion" },
      { id: "lists-3", type: "text", text: "O(n) search" },
    ],
  },
];
export const demoRelations = [
  {
    id: "r1",
    source: "arrays",
    target: "lists",
    rel_type: "related" as RelType,
  },
];
const n = (
  id: string,
  title: string,
  type: Node["type"],
  description: string,
  content: string[],
  subtitle?: string,
): Node => ({
  id,
  title,
  type,
  description,
  subtitle,
  content: content.map((text, i) => ({
    id: `${id}-${i + 1}`,
    type: "text" as const,
    text,
  })),
});

const e = (
  source: string,
  target: string,
  rel_type: RelType = "contains",
) => ({ id: `${source}-${target}`, source, target, rel_type });

export const computerArchitecture: Graph = {
  id: "computer-architecture",
  title: "Computer Architecture",
  subject: "Computer Science",
  updated_at: "2 hours ago",
  nodes: [
    n(
      "root",
      "Computer Architecture",
      "root",
      "The organization and design of computer systems.",
      [
        "Describes how hardware components are organized",
        "Defines the interface between hardware and software",
        "Drives performance, cost and power trade-offs",
      ],
      "Course overview",
    ),
    n(
      "cpu",
      "CPU",
      "topic",
      "Central processing unit responsible for executing instructions.",
      [
        "Executes program instructions",
        "Performs arithmetic and logical operations",
        "Controls system operations",
        "Uses registers for extremely fast temporary storage",
      ],
      "Central Processing Unit",
    ),
    n(
      "memory",
      "Memory",
      "topic",
      "Stores instructions and data for active programs.",
      [
        "Organized as a hierarchy by speed and cost",
        "Volatile memory loses contents on power off",
        "Locality of reference makes caching effective",
      ],
    ),
    n(
      "io",
      "Input / Output",
      "topic",
      "Moves data between the computer and the outside world.",
      [
        "Uses controllers and buses to talk to devices",
        "Polling, interrupts and DMA are transfer strategies",
        "I/O is usually far slower than CPU and memory",
      ],
    ),
    n("storage", "Storage", "topic", "Non-volatile long-term data retention.", [
      "SSDs use flash cells; HDDs use spinning platters",
      "Persists data across power cycles",
      "Backs virtual memory paging",
    ]),
    n(
      "performance",
      "Performance",
      "topic",
      "How fast a system executes a given workload.",
      [
        "CPU time = Instruction Count x CPI x Clock Cycle Time",
        "Amdahl's law limits speedup from partial optimization",
        "Benchmarks compare real workloads, not peak numbers",
      ],
    ),
    n(
      "alu",
      "ALU",
      "concept",
      "Performs arithmetic and logical operations on data.",
      [
        "Handles add, subtract, AND, OR, XOR, shifts",
        "Sets status flags such as zero and carry",
        "Operands usually come from registers",
      ],
      "Arithmetic Logic Unit",
    ),
    n(
      "control-unit",
      "Control Unit",
      "concept",
      "Decodes instructions and directs the other components.",
      [
        "Generates control signals each cycle",
        "Can be hardwired or microprogrammed",
        "Sequences the instruction cycle",
      ],
    ),
    n(
      "registers",
      "Registers",
      "concept",
      "Tiny, extremely fast storage inside the CPU.",
      [
        "Fastest level of the memory hierarchy",
        "Includes PC, instruction register and general purpose registers",
        "Register count affects compiler code quality",
      ],
    ),
    n(
      "instruction-cycle",
      "Instruction Cycle",
      "concept",
      "Fetch, decode, execute, write-back loop.",
      [
        "Fetch the instruction at the program counter",
        "Decode it into control signals",
        "Execute and write results back",
        "Pipelining overlaps these stages",
      ],
    ),
    n(
      "cache",
      "Cache",
      "concept",
      "Small fast memory holding recently used data.",
      [
        "Exploits temporal and spatial locality",
        "Hit rate dominates effective access time",
        "Organized into lines and sets",
      ],
    ),
    n(
      "ram",
      "RAM",
      "concept",
      "Volatile main memory used by running programs.",
      [
        "DRAM must be refreshed periodically",
        "Accessed by physical address after translation",
        "Much slower than cache, much faster than storage",
      ],
    ),
    n(
      "memory-hierarchy",
      "Memory Hierarchy",
      "concept",
      "Layers trading capacity against speed.",
      [
        "Registers → Cache → RAM → Storage",
        "Each level is larger, slower and cheaper per byte",
        "Gives the illusion of large fast memory",
      ],
    ),
    n(
      "l1",
      "L1 Cache",
      "concept",
      "Smallest and fastest cache, closest to the core.",
      [
        "Typically 32–64 KB per core",
        "Often split into instruction and data caches",
        "Access latency of a few cycles",
      ],
    ),
    n("l2", "L2 Cache", "concept", "Mid-level cache backing L1.", [
      "Usually a few hundred KB to 1 MB per core",
      "Slower than L1 but much larger",
      "Catches L1 misses before going to L3",
    ]),
    n("l3", "L3 Cache", "concept", "Large cache shared across cores.", [
      "Several MB, shared by all cores",
      "Helps inter-core data sharing",
      "Last stop before main memory",
    ]),
    n("clock-speed", "Clock Speed", "concept", "Cycles executed per second.", [
      "Measured in GHz",
      "Higher clocks raise power and heat",
      "Alone it does not determine real performance",
    ]),
    n("cpi", "CPI", "concept", "Average cycles required per instruction.", [
      "Lower CPI means better throughput",
      "Pipelining pushes CPI toward 1",
      "Cache misses and stalls raise CPI",
    ]),
    n(
      "instruction-count",
      "Instruction Count",
      "concept",
      "Number of instructions a program executes.",
      [
        "Determined by the ISA and the compiler",
        "CISC uses fewer, richer instructions",
        "RISC uses more, simpler instructions",
      ],
    ),
  ],
  edges: [
    e("root", "cpu"),
    e("root", "memory"),
    e("root", "io"),
    e("root", "storage"),
    e("root", "performance"),
    e("cpu", "alu"),
    e("cpu", "control-unit"),
    e("cpu", "registers"),
    e("cpu", "instruction-cycle"),
    e("memory", "cache"),
    e("memory", "ram"),
    e("memory", "memory-hierarchy"),
    e("cache", "l1"),
    e("cache", "l2"),
    e("cache", "l3"),
    e("performance", "clock-speed"),
    e("performance", "cpi"),
    e("performance", "instruction-count"),
    e("registers", "memory-hierarchy", "related"),
    e("instruction-cycle", "cpi", "depends_on"),
    e("storage", "memory-hierarchy", "related"),
  ],
};

export function getRelatedTopics(node: Node): string[] {
  const relatedTo = new Map<string, Set<string>>();
  for (const r of computerArchitecture.edges) {
    if (!relatedTo.has(r.source)) relatedTo.set(r.source, new Set());
    if (!relatedTo.has(r.target)) relatedTo.set(r.target, new Set());
    relatedTo.get(r.source)!.add(r.target);
    relatedTo.get(r.target)!.add(r.source);
  }
  return [...(relatedTo.get(node.id) ?? [])];
}
