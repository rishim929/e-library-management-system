import { useEffect, useState } from "react";
import UserLayout from "../Layouts/Userlayouts";
import { getReadingHistory } from "../services/readingHistoryService";
import { API_BASE_URL } from "../config";

function ReadingHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getReadingHistory();
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserLayout>
      <h1 className="text-3xl font-bold mb-8">
        📖 Reading History
      </h1>

      {history.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold">
            No books read yet.
          </h2>

          <p className="text-gray-600 mt-2">
            Start reading books and your history will appear here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <img
                src={
                  item.cover_image
                    ? `${API_BASE_URL}/uploads/covers/${item.cover_image}`
                    : "https://via.placeholder.com/300x400"
                }
                alt={item.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-bold">
                  {item.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  <b>Author:</b> {item.author}
                </p>

                <p className="mt-2">
                  <b>Last Page:</b> {item.last_page}
                </p>

                <p className="mt-2">
                  <b>Last Opened:</b>{" "}
                  {new Date(item.last_opened).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  );
}

export default ReadingHistory;