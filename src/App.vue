<script lang="ts">
// https://yajanarao.medium.com/create-a-data-flow-map-using-cytoscape-and-vue-js-5be3b3ef11d2
// https://color.adobe.com/create/color-wheel#
import { ITraversalReport } from './ITraversalReport'
import port from "./port"
import testData from "./testData"
import { startCase } from "lodash"
import cydagre from "cytoscape-dagre";
import cytoscape from "cytoscape";
import GraphStyles from './GraphStyles';

const store: { traversalReport: ITraversalReport } = { traversalReport: testData }

function nodesAndEdges(traversalReport) {
  var nodes = []
  var edges = []

  traversalReport.data.nodes.forEach((n) => {
    nodes.push(
      {
        data: {
          id: n,
          name: startCase(n),
          description: "",
          active: false,
          width: 200
        }
      }
    )
  })

  const depsAllNodes = traversalReport.data.nodeDependencies
  Object.getOwnPropertyNames(depsAllNodes).forEach((target) => {
    depsAllNodes[target].forEach((source) => {
      edges.push(
        {
          data: { source, target, label: "" }
        }
      )
    })
  })
  return { nodes, edges }
}
function drawGraph(nodesAndEdges) {
  cydagre(cytoscape);
  const cy = cytoscape({
    wheelSensitivity: .1,
    container: document.getElementById("cy"),
    boxSelectionEnabled: true,
    selectionType: "single",
    autounselectify: true,
    /* ORDER IS IMPORTANT Last style in wins */
    style: GraphStyles(cytoscape),
    elements: nodesAndEdges,
    layout: {
      name: "dagre",
      spacingFactor: .9,
      rankDir: "LR",
      fit: true,
    },
  });

  // mouseover mouseout only works when I move it above click
  cy.on('mouseover', 'node', function (evt) {
    console.log('entered ' + this.id());
    evt.target.addClass('hovering')
    evt.target.successors()?.addClass('successor')
    evt.target.predecessors()?.addClass('predecessor')
    evt.target.incomers()?.addClass('incomer')
    evt.target.outgoers()?.addClass('outgoer')
  })
  cy.on('mouseout', 'node', function (evt) {
    evt.target.removeClass('hovering')
    evt.target.successors()?.removeClass('successor')
    evt.target.predecessors()?.removeClass('predecessor')
    evt.target.incomers()?.removeClass('incomer')
    evt.target.outgoers()?.removeClass('outgoer')
  })
  cy.on('click', 'node', function (evt) {
    console.log('clicked ' + this.id());
  })
}

export default {
  data() {
    return {
      store: store,
    }
  },
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
  methods: {
    setMessage() {
      this.traversalReport
    },
    newMessage() {
      this.store.traversalReport = "new message"
    }
  },
  mounted() {
    console.log("redrawing")
    const els = nodesAndEdges(this.store.traversalReport)
    drawGraph(els)
  },
  watch: {
    "this.store.traversalReport": function () {
      console.log("redrawing")
      const els = nodesAndEdges(this.store.traversalReport)
      drawGraph(els)
    }
  },
  provide: { store: store }
}
</script>

<template>
  <div id="cy" class="cy"></div>
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

#cy {
  height: 100vh
}
</style>
