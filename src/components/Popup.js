import React, { useState, useEffect } from "react";

function Popup({ userInfo, y }) {
  //console.log(y);

  return (
    <div
      style={{ top: y - 200 }}
      className=" popup  pt-2 pb-3 flex flex-col justify-center items-center px-4 md:px-6 shadow-xl bg-white space-y-7 text-lg"
    >
      <div className="flex flex-col space-y-5 text-gray-800">
        <div className="flex justify-start items-center space-x-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="pt-0">{userInfo.userN}</span>
        </div>

        <div className="flex space-x-3 ">
          <div className="flex flex-col space-y-3">
            <div className=" flex space-x-3">
              <div
                id="twRetweet"
                className="flex justify-start items-center space-x-2 bg-gray-50 px-3 py-1 rounded shadow-s "
              >
                <svg
                  className="h-6 w-6 "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <polyline points="17 1 21 5 17 9" />{" "}
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />{" "}
                  <polyline points="7 23 3 19 7 15" />{" "}
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
                <span className="">{userInfo.twRetweet}</span>
              </div>
              <div
                id="twFav"
                className="flex justify-start items-center space-x-2 bg-gray-50 px-3 py-1 rounded shadow-s "
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
                <span className="">{userInfo.twFav}</span>
              </div>
              <div
                id="followers"
                className="flex justify-start items-center space-x-2 bg-gray-50 px-3 py-1 rounded shadow-s "
              >
                <div>Followers:</div>
                <span className="">{userInfo.followersCount}</span>
              </div>
              <div
                id="following"
                className="flex justify-start items-center space-x-2 bg-gray-50 px-3 py-1 rounded shadow-s "
              >
                <div>Following:</div>
                <span className="">{userInfo.friendsCount}</span>
              </div>
            </div>
            <div className=" flex space-x-3">
              <div
                id="language"
                className="flex justify-start items-center space-x-2 bg-gray-50 px-3 py-1 rounded shadow-s "
              >
                <svg
                  className="h-6 w-6 text-red-500"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <path d="M5 7h7m-2 -2v2a5 8 0 0 1 -5 8m1 -4a7 4 0 0 0 6.7 4" />{" "}
                  <path d="M11 19l4 -9l4 9m-.9 -2h-6.2" />
                </svg>
                <span className="">{userInfo.lang}</span>
              </div>
              <div
                id="verified"
                className="flex justify-start items-center space-x-2 bg-gray-50 px-3 py-1 rounded shadow-s "
              >
                <svg
                  className="h-6 w-6 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />{" "}
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {userInfo.isVerified == "true" ? (
                  <span>Verified</span>
                ) : (
                  <span>Not verified</span>
                )}
              </div>
              <div
                id="community"
                className="flex justify-start items-center space-x-2 bg-gray-50 px-3 py-1 rounded shadow-s "
              >
                <div>Community:</div>
                <span className="">{userInfo.Community}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="leading-relaxed text-gray-700">
            {userInfo.CurrentTweet}
          </div>
          <div className="text-gray-400 text-sm pt-1">{userInfo.twDate}</div>
        </div>
      </div>
    </div>
  );
}

export default Popup;
