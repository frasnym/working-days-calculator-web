"use client";

import { useState } from "react";

export default function Home() {
  const [inputDateStr, setInputDateStr] = useState<string>("2024-03-25");
  const [workingDays, setWorkingDays] = useState<string>("4");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    console.log({ inputDateStr, workingDays });

    try {
      const response = await fetch("http://localhost:3000/api/calculator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputDateStr, workingDays }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      alert(JSON.stringify(data));
      // Handle the response data as needed
    } catch (e) {
      if (typeof e === "string") {
        console.error("Error calculating result date:", e.toUpperCase());
      } else if (e instanceof Error) {
        console.error("Error calculating result date:", e.message);
      }
      // Handle errors
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Move to components
  const loadingEl = (
    <div className="flex items-center justify-center w-full h-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
        loading...
      </div>
    </div>
  );

  // TODO: Create larger form size
  return (
    <main className="flex items-center justify-center h-screen">
      {isLoading ? (
        loadingEl
      ) : (
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          {/* TODO: Refactor components */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Date Start
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={inputDateStr}
              placeholder="YYYY-MM-DD"
              onChange={(e) => setInputDateStr(e.target.value)}
              required={true}
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Working Days Number
            </label>
            <input
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setWorkingDays(e.target.value)}
              value={workingDays}
              required
            />
          </div>
          <div className="flex space-x-4 ">
            {/* TODO: Refactor components */}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
            <button
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => {
                setInputDateStr("");
                setWorkingDays("");
              }}
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
