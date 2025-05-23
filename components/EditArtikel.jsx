'use client';

import React, { useRef } from 'react';
import { FiArrowLeftCircle, FiImage, FiEdit3 } from 'react-icons/fi';

export default function EditorArtikel({ article, onSave, onDelete, onBack }) {
  const judulRef = useRef(null);
  const deskripsiRef = useRef(null);
  const fileInputRef = React.useRef();
  const [imagePreview, setImagePreview] = React.useState(null);

  const applyFormatting = (ref, formatType) => {
    const input = ref.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selectedText = input.value.substring(start, end);

    let formatted = selectedText;

    switch (formatType) {
      case 'bold':
        formatted = `**${selectedText}**`;
        break;
      case 'italic':
        formatted = `*${selectedText}*`;
        break;
      case 'underline':
        formatted = `<u>${selectedText}</u>`;
        break;
      case 'link':
        formatted = `[${selectedText}](https://)`;
        break;
      default:
        break;
    }

    input.setRangeText(formatted, start, end, 'end');
    input.focus();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = () => {
    onSave({
      id: article.id,
      judul: judulRef.current.value,
      isi_konten: deskripsiRef.current.value,
      status: article.status,
    });
  };

  const handleUploadClick = () => {
    onSave({
      id: article.id,
      judul: judulRef.current.value,
      isi_konten: deskripsiRef.current.value,
      status: 'Diterbitkan',
    });
  };

  return (
    <div className="min-h-screen flex bg-white font-poppins">
      <main className="flex-1 px-8 md:px-10 py-6 space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={onBack} className="text-black-600 hover:text-blue-800">
            <FiArrowLeftCircle className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-black">Editor Artikel</h1>
        </div>

        <div className="flex justify-end items-center space-x-4">
          <span className="text-sm italic text-gray-500">Kutip Sumber Anda</span>
          <button className="flex items-center space-x-1 text-blue-600 hover:underline">
            <FiEdit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-6 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <FiImage className="w-6 h-6 text-gray-700" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              onClick={() => applyFormatting(judulRef, 'bold')}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => applyFormatting(judulRef, 'italic')}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 italic"
            >
              I
            </button>
            <button
              onClick={() => applyFormatting(judulRef, 'underline')}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 underline"
            >
              U
            </button>
            <button
              onClick={() => applyFormatting(judulRef, 'link')}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              🔗
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              ref={judulRef}
              className="w-full p-2 border rounded-md"
              defaultValue={article.judul}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              ref={deskripsiRef}
              className="w-full p-2 border rounded-md"
              rows={5}
              defaultValue={article.isi_konten}
            />
          </div>

          {imagePreview && (
            <div>
              <img src={imagePreview} alt="Preview" className="max-w-xs rounded" />
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-[#3D6CB9] text-white rounded-md"
            >
              Simpan
            </button>
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Unggah
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
