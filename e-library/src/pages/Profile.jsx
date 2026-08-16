import { useEffect, useState } from "react";
import UserLayout from "../Layouts/Userlayouts";
import {
  getMyProfile,
  updateMyProfile,
} from "../services/userService";
import { getCategories } from "../services/categoryService";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    membership_type: "",
    preferred_category: "",
    password: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProfile();
    loadCategories();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();

      setProfile({
        ...res.data,
        password: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      await updateMyProfile(profile);

      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        name: profile.name,
        preferred_category: profile.preferred_category,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      alert("Profile updated successfully!");

      loadProfile();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <UserLayout>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight">
        👤 My Profile
      </h1>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 max-w-2xl">
        <div className="mb-5">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Name
          </label>
          <input
            className="border border-slate-300 w-full p-3 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            value={profile.name}
            onChange={(e) =>
              setProfile({
                ...profile,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <input
            className="border border-slate-300 w-full p-3 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100/90 cursor-not-allowed"
            value={profile.email}
            readOnly
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Preferred Category
          </label>
          <select
            className="border border-slate-300 w-full p-3 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            value={profile.preferred_category || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                preferred_category: e.target.value,
              })
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.category_name}
              >
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            New Password
          </label>
          <input
            type="password"
            placeholder="Leave blank to keep current password"
            className="border border-slate-300 w-full p-3 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            value={profile.password}
            onChange={(e) =>
              setProfile({
                ...profile,
                password: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Membership
          </label>
          <input
            className="border border-slate-300 w-full p-3 rounded-xl text-sm font-bold text-slate-800 bg-slate-100/90 capitalize cursor-not-allowed"
            value={profile.membership_type || "basic"}
            readOnly
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-green-700 hover:bg-green-800 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-green-700/20 transition text-sm"
        >
          Save Changes
        </button>
      </div>
    </UserLayout>
  );
}

export default Profile;