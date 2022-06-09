import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";

var head = "All Communities";

var coms = [
  "All Communities",
  "BlackLivesMatter C",
  "AllLivesMatter C",
  "Mixed Community",
];

function DropDown({ options, setSelectedCommunity }) {
  const [headValue, setHeadValue] = useState(options[0]);

  //const [opt2, setOpt2] = useState([1,2,3,4,56,7,3,23,34,4546,243,23,12,12,12,2,455,46,345,234,12,221])
  return (
    <div className=" top-16">
      <Menu as="div" className="relative inline-block w-full text-left ">
        <div>
          <Menu.Button className="w-52 bg-gray-100 text-gray-600 hover:bg-gray-200 inline-flex justify-center px-4 py-3 text-sm font-medium  rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <div className="w-3/4">{headValue}</div>

            <ChevronDownIcon
              className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-10 w-44 mt-2 overflow-y-auto origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg -left-3 max-h-52 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {options &&
                options.map((option) => (
                  <Menu.Item key={option}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-500 text-white" : "text-gray-900"
                        }  group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {
                          setSelectedCommunity(option);
                          option == "blm"
                            ? setHeadValue(coms[1])
                            : option == "alm"
                            ? setHeadValue(coms[2])
                            : option == "both"
                            ? setHeadValue(coms[3])
                            : setHeadValue(option);
                        }}
                      >
                        {option == "blm" ? (
                          <>BlackLivesMatter C</>
                        ) : option == "alm" ? (
                          <>AllLivesMatter C</>
                        ) : option == "both" ? (
                          <>Mixed Community</>
                        ) : (
                          <>{option}</>
                        )}
                      </button>
                    )}
                  </Menu.Item>
                ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
export default DropDown;
