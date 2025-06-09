'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSetup() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    gender: '',
    religion: '',
    education: '',
    profession: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await fetch('/api/profile/setup', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push('/profile/list');
    } else {
      alert('Failed to save profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        <input
          type="date"
          name="dob"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        <select
          name="gender"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="text"
          name="religion"
          placeholder="Religion"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        <input
          type="text"
          name="education"
          placeholder="Education"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        <input
          type="text"
          name="profession"
          placeholder="Profession"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          required
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
