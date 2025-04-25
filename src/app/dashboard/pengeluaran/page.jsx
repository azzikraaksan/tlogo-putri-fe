// app/dashboard/pengeluaran/page.jsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { Pencil, Trash2 } from 'lucide-react'

export default function PengeluaranPage() {
  const [data, setData] = useState([])
  const [date, setDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)

  const [form, setForm] = useState({
    idPengeluaran: '',
    idPenggajian: '',
    total: '',
    keterangan: ''
  })

  const handleAdd = () => {
    const newData = {
      ...form,
      tglPengeluaran: format(date, 'yyyy-MM-dd'),
    }
    setData([...data, newData])
    setForm({ idPengeluaran: '', idPenggajian: '', total: '', keterangan: '' })
  }

  const handleDelete = (index) => {
    const newData = [...data]
    newData.splice(index, 1)
    setData(newData)
  }

  const handleEdit = (index) => {
    const item = data[index]
    setForm({
      idPengeluaran: item.idPengeluaran,
      idPenggajian: item.idPenggajian,
      total: item.total,
      keterangan: item.keterangan,
    })
    handleDelete(index)
  }

  const exportData = () => {
    const csvRows = [
      ['ID Pengeluaran', 'ID Penggajian', 'Tanggal', 'Total', 'Keterangan'],
      ...data.map(d => [d.idPengeluaran, d.idPenggajian, d.tglPengeluaran, d.total, d.keterangan])
    ]
    const csv = csvRows.map(e => e.join(",")).join("\n")
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pengeluaran.csv'
    a.click()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pengeluaran</h1>
        <div className="space-x-2">
          <button onClick={() => setShowCalendar(!showCalendar)} className="px-3 py-1 bg-gray-200 rounded">📅</button>
          <button onClick={exportData} className="px-3 py-1 bg-green-500 text-white rounded">Export</button>
        </div>
      </div>
      {showCalendar && (
        <div className="my-4">
          <Calendar date={date} onChange={setDate} />
        </div>
      )}
      <div className="my-4 flex flex-wrap gap-2">
        <input className="border p-2 w-48" placeholder="ID Pengeluaran" value={form.idPengeluaran} onChange={e => setForm({...form, idPengeluaran: e.target.value})} />
        <input className="border p-2 w-48" placeholder="ID Penggajian" value={form.idPenggajian} onChange={e => setForm({...form, idPenggajian: e.target.value})} />
        <input className="border p-2 w-48" placeholder="Total" value={form.total} onChange={e => setForm({...form, total: e.target.value})} />
        <input className="border p-2 w-48" placeholder="Keterangan" value={form.keterangan} onChange={e => setForm({...form, keterangan: e.target.value})} />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Tambah</button>
      </div>
      <table className="w-full border">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-2">ID Pengeluaran</th>
            <th className="p-2">ID Penggajian</th>
            <th className="p-2">Tgl Pengeluaran</th>
            <th className="p-2">Total</th>
            <th className="p-2">Keterangan</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center border-t">
              <td className="p-2">{item.idPengeluaran}</td>
              <td className="p-2">{item.idPenggajian}</td>
              <td className="p-2">{item.tglPengeluaran}</td>
              <td className="p-2">{item.total}</td>
              <td className="p-2">{item.keterangan}</td>
              <td className="p-2 flex justify-center space-x-2">
                <button onClick={() => handleEdit(index)} className="text-blue-600 hover:underline"><Pencil className="w-4 h-4 inline" /></button>
                <button onClick={() => handleDelete(index)} className="text-red-600 hover:underline"><Trash2 className="w-4 h-4 inline" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}