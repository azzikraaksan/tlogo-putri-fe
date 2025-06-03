import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from "/src/app/lib/withAuth";

const EditAnggota = ({ user }) => {
  const [userDetails, setUserDetails] = useState(user || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserDetails(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:8000/api/users/all/${userDetails.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (res.ok) {
        router.push(`/detail-anggota/${userDetails.id}`);
      } else {
        console.error("Gagal update anggota");
      }
    } catch (error) {
      console.error("Error saat mengupdate anggota:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <button
          onClick={() => router.push(`/detail-anggota/${userDetails.id}`)}
          className="text-blue-500 underline mb-4"
        >
          Kembali ke Detail Anggota
        </button>
        <h1 className="text-2xl font-semibold mb-6">Edit Anggota</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nama</label>
            <input
              type="text"
              name="name"
              value={userDetails.name || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userDetails.email || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Peran</label>
            <input
              type="text"
              name="role"
              value={userDetails.role || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <input
              type="text"
              name="status"
              value={userDetails.status || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={userDetails.alamat || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Telepon</label>
            <input
              type="text"
              name="telepon"
              value={userDetails.telepon || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Plat Jeep</label>
            <input
              type="text"
              name="plat_jeep"
              value={userDetails.plat_jeep || ""}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-[#1C7AC8] text-white py-2 px-4 rounded mt-6 hover:bg-[#7ba2d0] transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Mengirim..." : "Update Anggota"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default withAuth(EditAnggota);
