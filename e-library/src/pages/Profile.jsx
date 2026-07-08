import { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
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

      <h1 className="text-3xl font-bold mb-8">
        👤 My Profile
      </h1>

      <div className="bg-white rounded-xl shadow p-8 max-w-2xl">

        <div className="mb-5">
          <label>Name</label>

          <input
            className="border w-full p-3 rounded mt-2"
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
          <label>Email</label>

          <input
            className="border w-full p-3 rounded mt-2 bg-gray-100"
            value={profile.email}
            readOnly
          />
        </div>

        <div className="mb-5">
          <label>Preferred Category</label>

          <select
            className="border w-full p-3 rounded mt-2"
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
          <label>New Password</label>

          <input
            type="password"
            placeholder="Leave blank to keep current password"
            className="border w-full p-3 rounded mt-2"
            value={profile.password}
            onChange={(e) =>
              setProfile({
                ...profile,
                password: e.target.value,
              })
            }
          />
        </div>

        <div className="mb-5">
          <label>Membership</label>

          <input
            className="border w-full p-3 rounded mt-2 bg-gray-100"
            value={profile.membership_type}
            readOnly
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-green-700 text-white px-8 py-3 rounded hover:bg-green-800"
        >
          Save Changes
        </button>

      </div>

    </UserLayout>
  );
}

export default Profile;