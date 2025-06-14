'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FiArrowLeftCircle, FiImage } from 'react-icons/fi';

export default function EditorArtikel({ article, onSave, onDelete, onBack }) {
  const judulRef = useRef(null);
  const captionRef = useRef(null);
  const deskripsiRef = useRef(null);
  const kategoriRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (article?.gambar) {
      const url = `http://127.0.0.1:8000/storage/gambar/${article.gambar}`;
      setImagePreview(url);
    }
  }, [article]);

  const applyFormatting = (formatType) => {
    switch (formatType) {
      case 'bold':
      case 'italic':
      case 'underline':
        document.execCommand(formatType, false, null);
        break;
      case 'link':
        const url = prompt('Masukkan URL:');
        if (url) document.execCommand('createLink', false, url);
        break;
      default:
        break;
    }
  };

  const uploadImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('gambar', file);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/content-generate/article/${article.id}/gambar`,
        { method: 'POST', body: formData }
      );
      if (!res.ok) throw new Error('Gagal upload gambar');
      const data = await res.json();
      alert('Gambar berhasil diupload!');
      setImagePreview(`http://127.0.0.1:8000/storage/${data.gambar}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      uploadImage(file);
    }
  };

  const handleSaveClick = () => {
    onSave({
      id: article.id,
      judul: judulRef.current.value,
      isi_konten: deskripsiRef.current.innerHTML,
      status: article.status,
      caption_gambar: captionRef.current.value,
      kategori: kategoriRef.current.innerHTML
      // gambar: article.gambar,
    });
  };
  
  const handleUploadClick = () => {
    onSave(
      {
        id: article.id,
        judul: judulRef.current.value,
        isi_konten: deskripsiRef.current.innerHTML,
        status: 'terbit',
        caption_gambar: captionRef.current.value,
        kategori: kategoriRef.current.innerHTML
        // gambar: article.gambar,
      },
      true
    );
  };

  return (
    <div className="min-h-screen flex bg-white font-poppins">
      <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={onBack} className="text-black-600 hover:text-blue-800">
            <FiArrowLeftCircle className="w-6 h-6 cursor-pointer" />
          </button>
          <h1 className="text-3xl font-bold text-black">Editor Artikel</h1>
        </div>

        <div className="space-y-6 mb-4">
          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Artikel</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-60 rounded-md object-contain" />
              ) : (
                <div className="space-y-1 text-center">
                  <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <p className="pl-1">Klik untuk mengunggah gambar</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 2 MB</p>
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption untuk gambar</label>
            <input
              ref={captionRef}
              className="w-full p-2 border rounded-md"
              defaultValue={article.caption_gambar || ''}
            />
          </div>

          {/* Toolbar Format */}
          <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-2 rounded-md">
            <button
              onClick={() => applyFormatting('bold')}
              className="p-2 rounded hover:bg-gray-200 font-bold"
            >
              B
            </button>
            <button
              onClick={() => applyFormatting('italic')}
              className="p-2 rounded hover:bg-gray-200 italic"
            >
              I
            </button>
            <button
              onClick={() => applyFormatting('underline')}
              className="p-2 rounded hover:bg-gray-200 underline"
            >
              U
            </button>
            <button
              onClick={() => applyFormatting('link')}
              className="p-2 rounded hover:bg-gray-200"
            >
              🔗
            </button>
          </div>

          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              ref={judulRef}
              className="w-full p-2 border rounded-md"
              defaultValue={article.judul || ''}
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <div
              ref={deskripsiRef}
              contentEditable
              className="w-full p-2 border rounded-md min-h-[150px]"
              dangerouslySetInnerHTML={{ __html: article.isi_konten || '' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori / Keyword</label>
            <div
              ref={kategoriRef}
              contentEditable
              className="w-full p-2 border rounded-md min-h-[150px]"
              dangerouslySetInnerHTML={{ __html: article.kategori || '' }}
            />
          </div>
          {/* Tombol Aksi */}
          <div className="flex space-x-4">
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-[#3D6CB9] text-white rounded-md cursor-pointer"
              >
                Simpan Perubahan
              </button>

              {article.status?.toLowerCase() !== 'terbit' && (
                <button
                  onClick={handleUploadClick}
                  className="px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer"
                >
                  Unggah
                </button>
              )}
            </div>
        </div>
      </main>
    </div>
  );
}
