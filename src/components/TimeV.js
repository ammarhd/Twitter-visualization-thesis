import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import theData from "../data/finalData.json";
import DropDown from "./dropDown";
import Popup from "./Popup";

import {
  getMaxX,
  getMaxY,
  getMaxRadius,
  getMaxColor,
  orderLargestBelow,
  x,
  y,
  radius,
  color,
  name,
  id,
} from "../helpers/timeVHelpers";

/*
Specify circle constants
*/
var circleMaxRadius = 8;
var circleMinRadius = 3;
var circleEnlargeConstant = 2;
var circleIdleOpacity = 0.3;
var circleActiveOpacity = 1;
var circleClickedStrokeWidth = 4;

/*
Create our user of interest
*/
var userOfInterest = {
  UserID: "123456789", // Add the user of interest if wanted
};

/*
Create id-functions
*/
const getCircleId = (d) => "circ" + id(d);
const getTextId = (d) => "text" + id(d);

//
var radiusScale;
var colorScale;

//
var xScale;
var yScale;

var minDate;
var maxDate;

var nodes;
var g;

var filteredData = [];

function TimeV() {
  const [data, setData] = useState(theData);
  const [data2, setData2] = useState(theData);
  const [data3, setData3] = useState([]);
  const [dLength, setDLength] = useState(data.length);

  const [tweetId, setTweetId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [popY, setPopY] = useState(0);
  const d3TimeV = useRef();
  const [num, setNum] = useState(data.length);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [typed, setTyped] = useState("");

  //Date.parse is fine for the moment
  minDate = d3.min(data, function (d) {
    return Date.parse(d.twDate);
  });
  maxDate = d3.max(data, function (d) {
    return Date.parse(d.twDate);
  });

  useEffect(() => {
    console.log(selectedCommunity);
    d3.select(d3TimeV.current).selectAll("*").remove();
    const margin = { top: 50, right: 30, bottom: 30, left: 60 };
    const width =
      parseInt(d3.select("#tGraph").style("width")) -
      margin.left -
      margin.right;
    const height =
      parseInt(d3.select("#tGraph").style("height")) -
      margin.top -
      margin.bottom;
    //d3.selectAll("svg > *").remove();
    const svg = d3
      .select(d3TimeV.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /*
Create title
*/
    var title = g
      .append("text")
      .attr("class", "title") // style in css
      .attr("x", width / 2)
      .attr("y", 0)
      .text("BLM & ALM movements in Twitter network")
      .style("fill", "#4e4e4e");

    var format = d3.timeFormat("%d %b %y");

    xScale = d3.scaleLog().range([0, width]).domain([minDate, maxDate]);
    var xAxis = d3
      .axisBottom(xScale)
      .tickFormat(format)
      .ticks(d3.timeFormat.days, 1);
    var gXAxis = g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .call(xAxis);

    // Create x-axis label.
    var xAxisLabel = g
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .text("Time");
    //

    yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, getMaxY(data)]);
    var yAxis = d3.axisLeft(yScale);
    var gYAxis = g.append("g").attr("class", "y axis").call(yAxis);

    // Create y-axis label
    var yAxisLabel = g
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Number of Retweets");

    /*
  Create scale for radius
  */
    radiusScale = d3
      .scaleLog()
      .base(10)
      .range([circleMinRadius, circleMaxRadius])
      .domain([1, getMaxRadius(data)]);

    /*
  Create scale for color
  */
    colorScale = d3
      .scaleLinear()
      .range(["blue", "red"])
      .domain([1, getMaxColor(data)]);

    // Enter the data
    nodes = g
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cursor", "grab")
      .attr("class", "nodeCircle")
      .attr("data-id", id)
      .attr("id", getCircleId)
      .attr("opacity", (d) => (d.isVerified == "true" ? 1 : 0.3))
      .attr("stroke", "black")
      .attr("stroke-width", (d) => (d.isVerified == "true" ? 1 : 0))
      .attr("r", (d) => Math.sqrt(d.followersCount / 100000) + 2)
      .attr("cx", (d) => xScale(Date.parse(d.twDate)))
      .attr("cy", (d) => yScale(y(d)))
      .on("mouseover", mouseoverCircle)
      .on("mouseout", mouseoutCircle)
      .on("click", clickCircle)
      .sort(orderLargestBelow);

    nodes.attr("fill", (d) =>
      d.Community == "blm" ? "blue" : d.Community == "alm" ? "red" : "green"
    );

    svg.call(
      d3
        .zoom()

        .scaleExtent([0.5, Infinity])
        .on("zoom", (event, d) => {
          {
            // Create new x- and y-scale
            var new_xScale = event.transform.rescaleX(xScale);
            var new_yScale = event.transform.rescaleY(yScale);

            // Display new axes
            gXAxis.call(xAxis.scale(new_xScale));
            gYAxis.call(yAxis.scale(new_yScale));

            // Reposition circles
            d3.selectAll(".nodeCircle")
              .attr("cx", function (d) {
                return new_xScale(Date.parse(d.twDate));
              })
              .attr("cy", function (d) {
                return new_yScale(y(d));
              });

            // Reposition texts
            d3.selectAll(".nodeText")
              .attr("x", function (d) {
                return new_xScale(x(d));
              })
              .attr("y", function (d) {
                return new_yScale(y(d));
              });
          }
        })
    );

    // Set appearance for user of interest
    d3.select("#" + getCircleId(userOfInterest)).attr("fill", "orange");

    g.exit().remove();
  }, []);

  /**
   * Handle mouse hover on circle. Enlarge circle.
   */
  function mouseoverCircle(event, d) {
    // Get circle
    var circle = d3.select(this);
    setHoverInfo(d);
    setPopY(event.y);

    //console.log(popY);
    const formatTime = d3.timeFormat("%B %d, %Y");

    console.log(formatTime(new Date(d.twDate)));

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
  const clickView = () => {
    // Remove clicked status on clicked nodes
    d3.selectAll(".clicked")
      .attr("stroke-width", "0")
      .classed("clicked", false);

    // Remove timeline
    //document.getElementById("tweet").innerHTML = "";

    // Get the <ul> element with id="myList"
    var list = document.getElementById("theTweet");

    // If the <ul> element has any child nodes, remove its first child node
    if (list.hasChildNodes()) {
      list.removeChild(list.childNodes[0]);
    }

    document.getElementById("theTweet").innerHTML = "";
  };

  /**
   * Handle click on a tweet circle. Display the clicked tweet and let the tweet
   * appear selected by adding a stroke to it.
   */
  const clickCircle = (event, d) => {
    // Remove results from old click
    clickView();

    // Add stroke width and set clicked class
    d3.select(this)
      .attr("stroke-width", circleClickedStrokeWidth)
      .classed("clicked", true);

    console.log(d.userSn);
    setTweetId(d.userSn);
  };

  useEffect(() => {
    const anchor = document.createElement("a");
    anchor.setAttribute("class", "twitter-timeline");
    anchor.setAttribute("data-theme", "light");
    anchor.setAttribute("height", "800");
    anchor.setAttribute("width", "500");
    anchor.setAttribute("data-chrome", "noheader nofooter noborders");
    anchor.setAttribute("href", `https://twitter.com/${tweetId}`);
    document.getElementsByClassName("twitter-embed")[0].appendChild(anchor);

    const script = document.createElement("script");
    script.setAttribute("src", "https://platform.twitter.com/widgets.js");
    document.getElementsByClassName("twitter-embed")[0].appendChild(script);
  }, [tweetId]);

  const topTweets = (e) => {
    d3.select(d3TimeV.current).selectAll("circle").remove();

    setData(filteredData.slice(0, e));
    setDLength(filteredData.length);
    updateNodes(filteredData.slice(0, e));

    //setData2(theData.slice(0, e));
  };

  //finallllll

  useEffect(() => {
    var filtered = [];
    filteredData = data2;

    if (selectedCommunity !== null || typed.length > 0) {
      console.log(selectedCommunity, typed);
      if (
        selectedCommunity !== null &&
        typed !== "" &&
        selectedCommunity !== "All Communities"
      ) {
        data2.map((tweet) => {
          if (
            tweet.Community.toLowerCase().includes(
              selectedCommunity.toLowerCase()
            ) &&
            tweet.CurrentTweet.toLowerCase().includes(typed.toLowerCase())
          ) {
            //returns filtered array
            filtered.push(tweet);
          }
        });
      } else if (
        typed !== "" &&
        (selectedCommunity === "All Communities" || selectedCommunity === null)
      ) {
        data2.map((tweet) => {
          if (tweet.CurrentTweet.toLowerCase().includes(typed.toLowerCase())) {
            //returns filtered array
            filtered.push(tweet);
          }
        });
      } else if (
        selectedCommunity !== "All Communities" &&
        selectedCommunity !== null
      ) {
        data2.map((tweet) => {
          if (
            tweet.Community.toLowerCase().includes(
              selectedCommunity.toLowerCase()
            )
          ) {
            //returns filtered array
            filtered.push(tweet);
          }
        });
      } else if (data3.length === 0) {
        return;
      } else {
        filtered = data2;
      }
      filteredData = filtered;

      console.log(filteredData);
      filtered = [];
      d3.select(d3TimeV.current).selectAll("circle").remove();
      setData(filteredData);
      setData3(filteredData);
      setNum(filteredData.length);
      setDLength(filteredData.length);
      updateNodes(filteredData);
    }
  }, [selectedCommunity, typed]);

  const updateNodes = (nodesData) => {
    nodes = g
      .append("g")
      .selectAll("circle")
      .data(nodesData)
      .enter()
      .append("circle")
      .attr("cursor", "grab")
      .attr("class", "nodeCircle")
      .attr("data-id", id)
      .attr("id", getCircleId)
      .attr("opacity", (d) => (d.isVerified == "true" ? 1 : 0.3))
      .attr("stroke", "black")
      .attr("stroke-width", (d) => (d.isVerified == "true" ? 1 : 0))
      .attr("r", (d) => Math.sqrt(d.followersCount / 100000) + 2)
      .attr("cx", (d) => xScale(Date.parse(d.twDate)))
      .attr("cy", (d) => yScale(y(d)))
      .on("mouseover", mouseoverCircle)
      .on("mouseout", mouseoutCircle)
      .on("click", clickCircle)
      .sort(orderLargestBelow);

    nodes.attr("fill", (d) =>
      d.Community == "blm" ? "blue" : d.Community == "alm" ? "red" : "green"
    );
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <div className=" w-10/12 lg:w-10/12 h-5/6 2xl:w-10/12 max-w-6xl md:px-5  flex flex-col justify-center shadow-md bg-gray-50 rounded-lg  ">
        <div className="flex justify-center space-x-10   py-5 mb-5 ">
          <div>
            <DropDown
              options={["All Communities", "blm", "alm", "both"]}
              setSelectedCommunity={setSelectedCommunity}
            />
          </div>
          <div className="bg-gray-100 text-gray-600  inline-flex justify-center px-4  text-sm font-medium  rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <div className="flex justify-center items-center text-center  px-1 ">
              Filter
            </div>
            <input
              className="text-center rounded py-2 bg-gray-100 text-gray-600   focus:outline-none focus-visible:ring-0 focus-visible:ring-white focus-visible:ring-opacity-75"
              placeholder="Tweet's content "
              onChange={(e) => {
                console.log(e.target.value);
                setTyped(e.target.value);
              }}
            />
          </div>
          <div className="bg-gray-100 text-gray-600  inline-flex justify-center px-4  text-sm font-medium  rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <input
              className="w-16 text-center rounded py-2 bg-gray-100 text-gray-600   focus:outline-none focus-visible:ring-0 focus-visible:ring-white focus-visible:ring-opacity-75"
              //placeholder={dLength}
              type="number"
              min={0}
              max={filteredData.length}
              value={num}
              step={1}
              onChange={(e) => {
                setNum(e.target.value);
                topTweets(e.target.value);
              }}
            />
            <div className="flex justify-center items-center text-center  px-1">
              Top Tweets
            </div>
          </div>
        </div>

        <div className="h-3/4 w-full ">
          <div
            className="h-full w-full flex justify-center items-center flex-col "
            id="tGraph"
          >
            <svg ref={d3TimeV}></svg>
            {isOpen && <Popup userInfo={hoverInfo} y={popY} />}
          </div>
          <div className="twitter-embed " id="theTweet"></div>
        </div>
        <div className="flex flex-col space-y-3 py-7  ">
          <div className="flex justify-center space-x-10 ">
            <div className="flex justify-start items-center space-x-3">
              <div className="bc w-5 h-5 rounded-full"></div>
              <div className="text-gray-600 flex justify-center items-center text-center">
                BlackLivesMatter Community
              </div>
            </div>
            <div className="flex justify-start items-center space-x-3">
              <div className="ac w-5 h-5 rounded-full"></div>
              <div className="text-gray-600 flex justify-center items-center text-center">
                AllLivesMatter Community
              </div>
            </div>
            <div className="flex justify-start items-center space-x-3">
              <div className="mc w-5 h-5 rounded-full"></div>
              <div className="text-gray-600 flex justify-center items-center text-center">
                Mixed Community
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-10 ">
            <div className="flex justify-start items-center space-x-3">
              <div className="bg-blue-600 border border-black border-1 w-5 h-5 rounded-full"></div>
              <div className="bg-green-600 border border-black border-1 w-5 h-5 rounded-full"></div>
              <div className="bg-red-500 border border-black border-1 w-5 h-5 rounded-full"></div>
              <div className="text-gray-600 flex justify-center items-center text-center">
                Verified Account
              </div>
            </div>
            <div className="flex justify-start items-center space-x-3">
              <div className="bg-gray-600 text-gray-100 w-5 h-5 rounded-full "></div>
              <div className="text-gray-600 flex justify-center items-center text-center">
                Radius Represents Number of Followers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeV;
