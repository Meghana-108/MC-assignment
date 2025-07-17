import React, { useEffect, useState } from "react";

const App = () => {
  const [jobIds, setJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch job IDs on mount
  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/jobstories.json")
      .then((res) => res.json())
      .then((ids) => {
        setJobIds(ids);
      });
  }, []);

  // Fetch visible job details
  useEffect(() => {
    const fetchJobs = async () => {
      const jobsToFetch = jobIds.slice(jobs.length, visibleCount);
      const jobDetails = await Promise.all(
        jobsToFetch.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
            (res) => res.json()
          )
        )
      );
      setJobs((prev) => [...prev, ...jobDetails]);
    };

    if (jobIds.length > 0) fetchJobs();
  }, [visibleCount, jobIds]);

  // Format timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">🚀 Hacker News Jobs</h1>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white shadow-md p-4 rounded">
            <h2 className="text-xl font-semibold text-blue-600">
              {job.url ? (
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  {job.title}
                </a>
              ) : (
                job.title
              )}
            </h2>
            <p className="text-gray-600">👤 {job.by}</p>
            <p className="text-sm text-gray-500">🕒 {formatDate(job.time)}</p>
          </div>
        ))}
      </div>
      {jobs.length < jobIds.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount(visibleCount + 6)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
