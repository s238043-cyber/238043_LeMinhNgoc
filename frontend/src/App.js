import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '',
    department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc'
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async (searchQuery = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}${searchQuery ? `?search=${searchQuery}` : ''}`);
      setEmployees(res.data);
    } catch (err) {
      setMessage({ text: 'Lỗi khi tải dữ liệu từ server!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setMessage({ text: 'Cập nhật nhân viên thành công!', type: 'success' });
      } else {
        await axios.post(API_URL, form);
        setMessage({ text: 'Thêm nhân viên mới thành công!', type: 'success' });
      }
      setForm({
        employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '',
        department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc'
      });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Đã có lỗi xảy ra!', type: 'error' });
    }
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage({ text: 'Xóa nhân viên thành công!', type: 'success' });
        fetchEmployees();
      } catch (err) {
        setMessage({ text: 'Xóa nhân viên thất bại!', type: 'error' });
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2>QUẢN LÝ NHÂN SỰ - 2338043 - LE MINH NGOC</h2>

      {message.text && (
        <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24', borderRadius: '4px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Cập nhật thông tin nhân viên' : 'Thêm nhân viên mới'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <input placeholder="Mã nhân viên" value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} required disabled={editingId} />
          <input placeholder="Họ và tên" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
          <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} required />
          <input placeholder="Phòng ban" value={form.department} onChange={e => setForm({...form, department: e.target.value})} required />
          <input placeholder="Chức vụ" value={form.position} onChange={e => setForm({...form, position: e.target.value})} required />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input placeholder="Số điện thoại" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
          <input type="date" value={form.hireDate} onChange={e => setForm({...form, hireDate: e.target.value})} required />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {editingId ? 'Cập nhật' : 'Thêm nhân viên'}
        </button>
      </form>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input placeholder="Tìm kiếm theo mã hoặc họ tên..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '6px', width: '300px', marginRight: '10px' }} />
        <button type="submit" style={{ padding: '6px 12px' }}>Tìm kiếm</button>
      </form>

      <h3>Danh sách nhân viên</h3>
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
            ) : (
              employees.map(emp => (
                <tr key={emp._id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.status}</td>
                  <td>
                    <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px' }}>Sửa</button>
                    <button onClick={() => handleDelete(emp._id)} style={{ color: 'red' }}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;