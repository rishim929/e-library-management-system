import { useEffect, useState } from "react";
import UserLayout from "../Layouts/Userlayouts";
import { getReadingHistory } from "../services/readingHistoryService";
import { API_BASE_URL } from "../config";
import { FaBookOpen } from "react-icons/fa";

function ReadingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getReadingHistory();
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
        📖 Reading History
      </h1>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-semibold text-base">
          Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
          <span className="text-4xl block mb-3">📚</span>
          <h2 className="text-xl font-bold text-white mb-2">
            No books read yet.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Start reading books from the library and your reading progress will automatically appear here.
          </p>
        </div>
      ) : (
        /* Reading History Books Grid - ~3.5x wider (320px) 1-column per row & ~3x shorter (h-48) balanced cards */
        <div className="user-history-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl hover:border-indigo-500/50 transition duration-300 flex flex-col max-w-[320px] sm:max-w-sm mx-auto w-full"
            >
              {/* Balanced Rectangular Cover Container (h-48 sm:h-56) */}
              <div className="h-48 sm:h-56 bg-slate-950 relative overflow-hidden flex items-center justify-center p-2">
                {item.cover_image ? (
                  <img
                    src={`${API_BASE_URL}/uploads/covers/${item.cover_image}`}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                    <FaBookOpen className="text-4xl mb-2 text-slate-600" />
                    <span>No Cover Image</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1.5">
                    Author: <span className="text-slate-200 font-semibold">{item.author}</span>
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Last Page Read: <span className="text-indigo-300 font-extrabold">Page {item.last_page}</span>
                  </p>

                  <p className="text-[11px] text-slate-400 mt-2.5 font-medium border-t border-slate-700/60 pt-2 flex items-center gap-1">
                    🕒 {new Date(item.last_opened).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  );
}

export default ReadingHistory;