import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [adminTasks, setAdminTasks] = useState([]); 
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    }
  };

  const fetchAllSystemTasks = async () => {
    try {
      const { data } = await api.get('/tasks/admin/all');
      setAdminTasks(data.data);
      toast.success('System tasks loaded');
    } catch (error) {
      toast.error('Not authorized to view all tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  
  const handleCreateTask = async (e) => { e.preventDefault(); try { await api.post('/tasks', newTask); toast.success('Task created!'); setNewTask({ title: '', description: '' }); fetchTasks(); } catch (error) { toast.error(error.response?.data?.message || 'Failed to create task'); } };
  const handleUpdateStatus = async (id, currentStatus) => { const newStatus = currentStatus === 'pending' ? 'in-progress' : 'completed'; try { await api.put(`/tasks/${id}`, { status: newStatus }); toast.success('Task updated!'); fetchTasks(); } catch (error) { toast.error('Failed to update task'); } };
  const handleDeleteTask = async (id) => { if (!window.confirm('Are you sure you want to delete this task?')) return; try { await api.delete(`/tasks/${id}`); toast.success('Task deleted!'); fetchTasks(); } catch (error) { toast.error('Failed to delete task'); } };
  const handleLogout = () => {  localStorage.removeItem('user'); navigate('/'); };


  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user?.name} <span style={{fontSize: '14px', color: 'gray'}}>({user?.role})</span></h2>
        <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
      </div>

      
      {user?.role === 'admin' && (
        <div style={{ background: '#ffebee', padding: '15px', marginTop: '20px', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
          <h3 style={{ color: '#721c24', marginTop: 0 }}>🛡️ Admin Panel</h3>
          <button onClick={fetchAllSystemTasks} style={{ background: '#dc3545', padding: '8px', cursor: 'pointer', marginBottom: '10px' }}>
            Load All System Tasks
          </button>
          
          {adminTasks.map((task) => (
             <div key={task._id} style={{ background: 'white', padding: '10px', marginBottom: '10px', borderRadius: '5px', fontSize: '14px' }}>
               <strong>{task.title}</strong> - Status: {task.status} <br/>
               <span style={{color: 'gray'}}>Created by: {task.user?.name} ({task.user?.email})</span>
             </div>
          ))}
        </div>
      )}
      
      <div style={{ background: '#f4f4f4', padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
        <h3>Create New Task</h3>
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
          <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} required />
          <button type="submit" style={{ padding: '8px', cursor: 'pointer' }}>Add Task</button>
        </form>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Your Personal Tasks</h3>
        {tasks.length === 0 ? <p>No tasks yet. Create one above!</p> : null}
        {tasks.map((task) => (
          <div key={task._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <h4>{task.title} <span style={{ fontSize: '12px', color: 'gray' }}>({task.status})</span></h4>
            <p>{task.description}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {task.status !== 'completed' && (
                <button onClick={() => handleUpdateStatus(task._id, task.status)} style={{ cursor: 'pointer' }}>Mark {task.status === 'pending' ? 'In-Progress' : 'Completed'}</button>
              )}
              <button onClick={() => handleDeleteTask(task._id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;