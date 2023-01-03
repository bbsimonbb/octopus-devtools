<script lang="ts">
import { ITraversalReport } from './ITraversalReport'
import port from "./port"
import testData from "./testData"
import {
  ForceLayout,
  ForceNodeDatum,
  ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"

const store: { traversalReport: ITraversalReport } = { traversalReport: testData }


export default {
  created() {
    if (port) {
      port.onMessage.addListener((msg) => {
        if (msg.source === "octopus") {
          console.log("in App.vue. message made it all the way")
          console.log(msg)
          this.store.traversalReport = msg
        }
      })
    }
  },
  computed: {
    D3NodesAndEdges() {
      var nodes = {}
      var edges = {}

      this.store.traversalReport.data.nodes.forEach((n) => {
        Object.defineProperty(nodes, n, {
          value: { name: n },
          configurable: true,
          enumerable: true,
          writable: true,
        })
        var i = 0;
        const depsAllNodes = this.store.traversalReport.data.nodeDependencies
        Object.getOwnPropertyNames(depsAllNodes).forEach((source) => {
          depsAllNodes[source].forEach((target) => {
            Object.defineProperty(
              edges, "edge" + i++, {
              value: { source, target },
              configurable: true,
              enumerable: true,
              writable: true,
            }
            )
          })
        })
      })
      return { nodes, edges }
    }
  },
  methods: {
    setMessage() {
      this.traversalReport
    },
    newMessage() {
      this.store.traversalReport = "new message"
    }
  },
  data() {
    return {
      store: store,
      graphConfig: {
        view: {
          layoutHandler: new ForceLayout({
            positionFixedByDrag: false,
            positionFixedByClickWithAltKey: true,
            // * The following are the default parameters for the simulation.
            // * You can customize it by uncommenting below.
            // createSimulation: (d3, nodes, edges) => {
            //   const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
            //   return d3
            //     .forceSimulation(nodes)
            //     .force("edge", forceLink.distance(100))
            //     .force("charge", d3.forceManyBody())
            //     .force("collide", d3.forceCollide(50).strength(0.2))
            //     .force("center", d3.forceCenter().strength(0.05))
            //     .alphaMin(0.001)
            // }
          }),

        },
        node: {
          normal: {
            type: "rect",
            width: 32,
            height: 32,
            borderRadius: 6,
            color: "#ffffff",
            strokeWidth: 2,
            strokeColor: "#888888",
          },
          hover: {
            color: "#eeeeee",
          },

        },
        edge: {
          normal: {
            width: 3,
            color: "#ccc",
          },
          hover: {
            color: "#888"
          },
          marker: {
            source: {
              type: "arrow"
            }
          }
        }
      }
    }
  },
  provide: { store: store }
}
</script>

<template>
  <v-network-graph class="graph" :nodes="D3NodesAndEdges.nodes" :edges="D3NodesAndEdges.edges" :configs="graphConfig" />
  <img src="/images/octopus-photo.png" id="octo" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

#octo {
  position: absolute;
  height: 200px;
  bottom: 0;
  right: 0;
}
</style>
