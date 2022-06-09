import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import thedata from "../data/finalData.json";
import Popup from "./Popup";

var circleEnlargeConstant = 2;
var circleClickedStrokeWidth = 5;

var link;
var node;
var margin;
var width;
var height;

function Graph() {
  const [data, setData] = useState(thedata);

  const [tweetId, setTweetId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [popY, setPopY] = useState(0);

  const d3Graph = useRef();

  const drag = (simulation) => {
    const dragstarted = (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  useEffect(() => {
    //Specify display sizes
    d3.select(d3Graph.current).selectAll("*").remove();
    margin = { top: 20, right: 30, bottom: 30, left: 30 };
    width =
      parseInt(d3.select("#graph").style("width")) - margin.left - margin.right;
    height =
      parseInt(d3.select("#graph").style("height")) -
      margin.top -
      margin.bottom;

    //set up the Graph
    const svg = d3
      .select(d3Graph.current)
      .attr("viewBox", [0, 0, width, height]);

    // Create zoomable area
    const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("cursor", "grab")
      .on("click", clickView);

    // Create simulation
    var simulation = d3
      .forceSimulation()
      //.force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-5))
      .force("center", d3.forceCenter(width / 2, height / 2));

    link = g
      .append("g")
      .selectAll("line")
      .attr("class", "links")
      .data(data)
      .enter()
      .append("line")
      .attr("stroke-width", (d) => {
        return Math.sqrt(d.weight / 10);
      });

    node = g
      .append("g")
      .selectAll("circle")
      .attr("class", "nodes")
      .data(data)
      .enter()
      .append("circle")
      .attr("opacity", (d) => (d.isVerified == "true" ? 1 : 0.3))
      .attr("stroke", "black")
      .attr("stroke-width", (d) => (d.isVerified == "true" ? 1 : 0))
      .attr("r", (d) => Math.sqrt(d.twRetweet / 1000) + 2)
      .on("mouseover", mouseoverCircle)
      .on("mouseout", mouseoutCircle)
      .on("click", clickCircle)
      .call(drag(simulation));

    node.attr("fill", (d) =>
      d.Community == "blm" ? "blue" : d.Community == "alm" ? "red" : "green"
    );

    ///

    svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([1, 8])
        .on("zoom", (event, d) => {
          g.attr("transform", event.transform);
        })
    );

    var filteredLinks = data.filter((link) => link.weight >= 1);

    // Link nodes and links to the simulation
    simulation
      .nodes(data)
      .on("tick", ticked)
      .force(
        "link",
        d3.forceLink(filteredLinks).id(function (d) {
          return d.twId;
        })
      );

    // Compute several steps before rendering
    //loading.remove(); // Remove loading text
    for (var i = 0, n = 200; i < n; ++i) {
      simulation.tick();
    }

    ///
  }, []);

  // Updates for each simulation tick
  function ticked() {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  /**
   * Handle mouse hover on circle. Enlarge circle.
   */
  function mouseoverCircle(event, d) {
    // Get circle
    var circle = d3.select(this);
    setHoverInfo(d);
    setPopY(event.y);

    // Display activated circle
    circle.attr("r", circle.attr("r") * circleEnlargeConstant);
    setIsOpen(true);
  }

  /**
   * Handle mouse out on circle. Resize circle.
   */
  function mouseoutCircle() {
    // Get circle
    var circle = d3.select(this);

    // Display idle circle
    circle.attr("r", circle.attr("r") / circleEnlargeConstant);
    setIsOpen(false);
  }

  /**
   * Handle click on zoomable area. That is, handle click outside a node which
   * is considered a deselecting click => deselect previously clicked node
   * and remove displayed tweets.
   */
  function clickView() {
    // Remove clicked status on clicked nodes
    d3.selectAll(".clicked")
      .attr("stroke-width", "0")
      .classed("clicked", false);

    // Get the <ul> element with id="myList"
    var list = document.getElementById("theTweet");

    // If the <ul> element has any child nodes, remove its first child node
    if (list.hasChildNodes()) {
      list.removeChild(list.childNodes[0]);
    }

    document.getElementById("theTweet").innerHTML = "";

    // Remove timeline
    //document.getElementById("tweet").innerHTML = "";
  }

  /**
   * Handle click on a tweet circle. Display the clicked tweet and let the tweet
   * appear selected by adding a stroke to it.
   */
  function clickCircle(event, d) {
    // Remove results from old click

    clickView();

    // Add stroke width and set clicked class
    d3.select(this)
      .attr("stroke-width", circleClickedStrokeWidth)
      .classed("clicked", true);

    console.log(d.twId);
    setTweetId(d.userSn);
    // Display tweet

    //twttr.widgets.createTimeline(
    //  {
    //    sourceType: "profile",
    //    userId: d.idNr,
    //  },
    //  document.getElementById("tweet"), // Tweet div
    //
    //  {
    //    height: height,
    //  }
    //);
  }

  useEffect(() => {
    const anchor = document.createElement("a");
    anchor.setAttribute("class", "twitter-timeline");
    anchor.setAttribute("data-theme", "dark");
    anchor.setAttribute("height", "800");
    anchor.setAttribute("width", "500");
    anchor.setAttribute("data-chrome", "noheader nofooter noborders");
    anchor.setAttribute("href", `https://twitter.com/${tweetId}`);
    document.getElementsByClassName("twitter-embed")[0].appendChild(anchor);

    const script = document.createElement("script");
    script.setAttribute("src", "https://platform.twitter.com/widgets.js");
    document.getElementsByClassName("twitter-embed")[0].appendChild(script);
  }, [tweetId]);

  return (
    <div className="flex justify-center items-center p-20">
      <div className="shadow-lg bg-gray-100">
        <div id="graph">
          <svg ref={d3Graph}></svg>
          {isOpen && <Popup userInfo={hoverInfo} y={popY} />}
        </div>

        <div className="twitter-embed" id="theTweet"></div>
      </div>
    </div>
  );
}

export default Graph;
