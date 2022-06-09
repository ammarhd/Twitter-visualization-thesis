import * as d3 from "d3";

/*
Create accessors that specify data from the csv-file
*/
export const x = (d) => d.followersCount;
export const y = (d) => d.twRetweet;
export const radius = (d) => d.twFav;
export const color = (d) => d.followersCount;
export const name = (d) => d.userSn;
export const id = (d) => d.userSn;

// Returns the largest x-value in the data.
export const getMaxX = (data) => Math.max(...data.map((d) => x(d)));

//Returns the largest y-value in the data.
export const getMaxY = (data) => Math.max(...data.map((d) => y(d)));

//Returns the largest radius in the data.
export const getMaxRadius = (data) => Math.max(...data.map((d) => radius(d)));

//Returns the "largest" color in the data.
export const getMaxColor = (data) => {
  var maxColor = Math.max(...data.map((d) => color(d)));
  var cutOff = 10000;

  if (maxColor > cutOff) return cutOff;
  return maxColor;
};

//Order so that largest circle gets placed deepest.
export const orderLargestBelow = (a, b) => radius(b) - radius(a);
