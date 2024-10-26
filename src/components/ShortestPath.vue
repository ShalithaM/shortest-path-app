<template>
    <div>
        <header class="header">
            <h1>Dijkstra's Algorithm Calculator</h1>
            <p>Discovering Optimal Routes Through Nodes Using Dijkstra's Method</p>
        </header>

        <div class="calculator-card">
            <div class="select-path">
                <h2>Select Path</h2>
                <label for="from-node">From Node</label>
                <select v-model="fromNode" id="from-node">
                    <option v-for="node in nodes" :key="node" :value="node">{{ node }}</option>
                </select>

                <label for="to-node">To Node</label>
                <select v-model="toNode" id="to-node">
                    <option v-for="node in nodes" :key="node" :value="node">{{ node }}</option>
                </select>

                <div class="button-group">
                    <button class="clear-button" @click="clearNodes" :disabled="isLoading">
                        Clear
                    </button>
                    <button class="calculate-button" @click="findShortestPath" :disabled="isLoading">
                        Calculate <img src="@/assets/calculator-icon.svg" alt="Calculator" class="icon">
                    </button>
                </div>

                <div class="button-group">
                    <button class="calculate-button" @click="getRandomNode" :disabled="isLoading">
                        Randomize
                    </button>
                    <button @click="showGraph = true" class="calculate-button">
                        Show Graph
                    </button>
                </div>
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </div>

            <div v-if="!result" class="illustration">
                <img src="@/assets/illustration.svg" alt="Illustration" />
            </div>

            <div v-if="result" class="results">
                <h3>Result</h3>
                <div class="results-container">
                    <p>From Node Name = "{{ fromNode }}", To Node Name = "{{ toNode }}"</p>
                    <p>Path: {{ result.nodeNames.join(', ') }}</p>
                    <p>Total Distance: {{ result.distance }}</p>

                    <div v-if="statusMessage" class="status-message">
                        <p>{{ statusMessage }}</p>
                    </div>
                </div>
            </div>

            <div v-if="isLoading" class="loader-overlay">
                <div class="loader"></div>
            </div>
        </div>

        <div v-if="showGraph" class="popup-overlay">
            <div class="popup">
                <button @click="showGraph = false" class="close-icon">
                    <img src="@/assets/close.svg" alt="Close" />
                </button>
                <img src="@/assets/graph.png" alt="Graph" class="graph-image" />
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { graph, dijkstra, ShortestPathData } from '@/utils/graph'

export default defineComponent({
  name: 'ShortestPath',
  setup () {
    // Define reactive variables
    const nodes = Object.keys(graph)
    const fromNode = ref<string | null>(null)
    const toNode = ref<string | null>(null)
    const result = ref<ShortestPathData | null>(null)
    const statusMessage = ref<string | null>(null)
    const errorMessage = ref<string | null>(null)
    const isLoading = ref<boolean>(false)
    const showGraph = ref<boolean>(false)

    // Function to find the shortest path between selected nodes
    const findShortestPath = async () => {
      errorMessage.value = null
      if (!fromNode.value || !toNode.value) {
        errorMessage.value = "Please select both 'From' and 'To' nodes."
        return
      }
      isLoading.value = true
      try {
        result.value = dijkstra(graph, fromNode.value, toNode.value)
        console.log(result.value);
        
        if (result.value) {
          await sendResult(result.value)
        }
      } finally {
        isLoading.value = false
      }
    }

    // Function to clear selected nodes and results
    const clearNodes = () => {
      fromNode.value = null
      toNode.value = null
      result.value = null
      errorMessage.value = null
    }

    // Function to get random nodes and find the shortest path between them
    const getRandomNode = async () => {
      isLoading.value = true
      errorMessage.value = null
      try {
        const { data: fromData } = await axios.get('http://2g.be/twitch/randomnumber.php?defstart=1&defend=9')
        const { data: toData } = await axios.get('http://2g.be/twitch/randomnumber.php?defstart=1&defend=9')
        const fromIndex = parseInt(fromData) - 1
        const toIndex = parseInt(toData) - 1
        if (isNaN(fromIndex) || isNaN(toIndex)) {
          throw new Error('Invalid response from random number generator')
        }
        fromNode.value = nodes[fromIndex] || 'A'
        toNode.value = nodes[toIndex] || 'B'
        await findShortestPath()
      } catch (error) {
        console.error('Error in getRandomNode:', error)
        errorMessage.value = 'Failed to get random nodes. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    // Function to send the result data to a server
    const sendResult = async (data: ShortestPathData) => {
      try {
        const response = await axios.post('http://echo.free.beeceptor.com/sample-request?author=beeceptor', data)
        statusMessage.value = `Success! HTTP Status: ${response.status}`
      } catch (error) {
        statusMessage.value = 'Error in sending data'
      }
    }

    // Return the reactive variables and functions to the template
    return { nodes, fromNode, toNode, findShortestPath, clearNodes, getRandomNode, result, statusMessage, errorMessage, isLoading, showGraph }
  }
})
</script>

<style lang="css" scoped>
@import '@/styles/ShortestPath.css';
</style>
