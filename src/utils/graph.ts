// Graph Data Structure and Dijkstra's Algorithm Implementation

// Define the Graph type as a record where each key is a string representing a node,
// and the value is an object with neighboring nodes as keys and their distances as values.
export type Graph = Record<string, { [key: string]: number }>;

// Example graph data
export const graph: Graph = {
  A: { B: 4, C: 6 },
  B: { A: 4, F: 2 },
  C: { A: 6, D: 8 },
  D: { C: 8, E: 4, G: 1 },
  E: { B: 2, D: 4, F: 3, I: 8 },
  F: { B: 2, E: 3, G: 4, H: 6 },
  G: { D: 1, F: 4, H: 5, I: 5 },
  H: { F: 6, G: 5 },
  I: { E: 8, G: 5 }
}

// DTO for the shortest path response
export type ShortestPathData = {
  readonly nodeNames: string[];
  readonly distance: number;
};

// Dijkstra's algorithm to find the shortest path in a graph
export function dijkstra (graph: Graph, start: string, end: string): ShortestPathData | null {
  const distances: { [key: string]: number } = {}
  const previous: { [key: string]: string | null } = {}
  const visited: Set<string> = new Set()

  // Initialize distances and previous nodes
  for (const node in graph) {
    distances[node] = Infinity
    previous[node] = null
  }
  distances[start] = 0

  const nodes = Object.keys(graph)

  while (nodes.length) {
    // Find the closest unvisited node
    const closestNode = nodes.reduce((closest, node) => {
      if (!visited.has(node) && (closest === null || distances[node] < distances[closest])) {
        return node
      }
      return closest
    }, null as string | null)

    if (closestNode === null) break

    // If the closest node is the end node, build and return the path
    if (closestNode === end) {
      const path = []
      let curr = end
      while (curr) {
        path.unshift(curr)
        curr = previous[curr]!
      }
      return { nodeNames: path, distance: distances[end] }
    }

    visited.add(closestNode)
    const neighbors = graph[closestNode]
    for (const neighbor in neighbors) {
      const newDist = distances[closestNode] + neighbors[neighbor]
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist
        previous[neighbor] = closestNode
      }
    }
  }
  return null
}
