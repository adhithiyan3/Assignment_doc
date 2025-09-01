import { useEffect, useState } from "react";
import API from "../utils/api";

function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const res = await API.get("/documents/activity/feed");
      setActivities(res.data.slice(-5).reverse()); // last 5, newest first
    } catch (err) {
      console.error("Error fetching activity feed:", err);
    }
  };

  useEffect(() => {
    fetchActivities(); // fetch on mount

    // auto-refresh every 10 seconds
    const interval = setInterval(fetchActivities, 10000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activity found.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li
              key={index}
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow"
            >
              {/* Action with colored status */}
              <span
                className={`font-semibold ${
                  activity.action === "uploaded"
                    ? "text-green-600"
                    : activity.action === "updated"
                    ? "text-blue-600"
                    : activity.action === "deleted"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {activity.action}
              </span>{" "}
              {activity.documentId && activity.documentId.title
                ? `on ${activity.documentId.title}`
                : "(document deleted)"}{" "}
              by <span className="italic">{activity.userId?.email}</span>

              {/* Timestamp */}
              {activity.timestamp && (
                <div className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityFeed;
