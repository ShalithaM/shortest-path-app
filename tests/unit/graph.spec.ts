import { dijkstra, graph, ShortestPathData } from "@/utils/graph";

describe("Dijkstra Algorithm", () => {
  it("finds shortest path from A to E", () => {
    const result: ShortestPathData | null = dijkstra(graph, "A", "E");
    expect(result).toEqual({
      nodeNames: ["A", "B", "F", "E"],
      distance: 9
    });
  });

  it("finds shortest path from C to H", () => {
    const result: ShortestPathData | null = dijkstra(graph, "C", "H");
    expect(result).toEqual({
      nodeNames: ["C", "D", "G", "H"],
      distance: 14
    });
  });

  it("finds shortest path from A to I", () => {
    const result: ShortestPathData | null = dijkstra(graph, "A", "I");
    expect(result).toEqual({
      nodeNames: ["A", "B", "F", "G", "I"],
      distance: 15
    });
  });
});