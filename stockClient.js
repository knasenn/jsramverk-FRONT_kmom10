import io from 'socket.io-client';
import Rickshaw from 'rickshaw';
import 'rickshaw/rickshaw.min.css';

(function() {
    let graphs = {};
    let first = true;
    let graphContainer = document.getElementById("graphs");
    let socket = io.connect("http://localhost:4000");

    socket.on('connect', () => {
        console.log("Connected");
    });

    socket.on('disconnect', () => {
        console.log("Disconnected");
    });

    socket.on('stocks', (message) => {
        if (first == true) {
            var palette = new Rickshaw.Color.Palette({ scheme: 'colorwheel' });

            //------------------
            message.map((korv) => {
                //skapar och lägger till titel/namn
                let graphTitle = document.createElement("h1");

                graphTitle.textContent = korv.name;

                let graphElement = document.createElement("div");

                graphContainer.appendChild(graphTitle);
                graphContainer.appendChild(graphElement);

                //skapar grafen
                let graph = new Rickshaw.Graph({
                    element: graphElement,
                    width: "500",
                    height: "300",
                    renderer: "line",
                    series: new Rickshaw.Series.FixedDuration([{
                        name: korv.name,
                        color: palette.color(),
                    }], undefined, {
                        timeInterval: 5000,
                        maxDataPoints: 1000,
                        timeBase: new Date().getTime() / 1000
                    })
                });

                graph.configure({
                    width: graphContainer.clientWidth,
                });

                graph.render();

                graphs[korv.name] = {
                    name: korv.name,
                    graph: graph,
                };
            });
            first = false;
        }

        //------------------
        message.map((korv) => {
            let data = {};
            data[korv.name] = korv.startingPoint;
            graphs[korv.name].graph.series.addData(data);
            graphs[korv.name].graph.render();
        });
    });
})();
