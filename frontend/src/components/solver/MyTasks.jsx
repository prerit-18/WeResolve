import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, ImagePlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { tasksApi } from '../../api';

export default function MyTasks({ refreshTrigger, triggerRefresh, onViewAll }) {
  const [activeTab, setActiveTab] = useState('In Progress');
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.listMyTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'In Progress') {
      return t.status === 'In Progress';
    } else {
      return t.status === 'Completed' || t.status === 'Approved' || t.status === 'Rejected';
    }
  });

  const handleToggleExpand = (taskId) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      setUploadFile(null);
      setUploadError('');
    } else {
      setExpandedTaskId(taskId);
      setUploadFile(null);
      setUploadError('');
    }
  };

  const handleUploadProof = async (taskId) => {
    if (!uploadFile) {
      setUploadError('Please select an after image proof.');
      return;
    }
    
    setUploadError('');
    setUploadingId(taskId);

    const formData = new FormData();
    formData.append('image', uploadFile);

    try {
      await tasksApi.submitProof(taskId, formData);
      setExpandedTaskId(null);
      setUploadFile(null);
      triggerRefresh();
    } catch (err) {
      setUploadError(err.message || 'Failed to upload verification.');
    } finally {
      setUploadingId(null);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return `Accepted on ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } catch (_) {
      return 'Recently accepted';
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'In Progress') return 'bg-amber-100/70 text-amber-700';
    if (status === 'Completed') return 'bg-secondary/15 text-secondary';
    if (status === 'Approved') return 'bg-green-100/70 text-green-700';
    return 'bg-red-100/70 text-red-700'; // Rejected
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[17px] font-bold text-slate-900">My Tasks</h3>
        <button 
          onClick={onViewAll}
          className="text-primary text-xs font-bold hover:text-primaryDark transition"
        >
          View All
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-100 mb-4">
        <button
          onClick={() => setActiveTab('In Progress')}
          className={`px-2 py-2.5 border-b-2 text-sm font-bold flex items-center gap-1.5 transition-all duration-150 ${
            activeTab === 'In Progress'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>In Progress</span>
          <span className="bg-primary text-white text-[10px] font-black rounded-full px-1.5 py-0.5">
            {tasks.filter((t) => t.status === 'In Progress').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('Completed')}
          className={`px-2 py-2.5 border-b-2 text-sm font-bold transition-all duration-150 ${
            activeTab === 'Completed'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center p-8 text-slate-400 text-xs font-bold">
          No tasks in this section.
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const isUploading = uploadingId === task.id;
            const issue = task.issue || {};

            return (
              <div key={task.id} className="border border-slate-100/50 rounded-2xl bg-slate-50 overflow-hidden transition-all duration-150 shadow-sm">
                <div 
                  onClick={() => handleToggleExpand(task.id)}
                  className="flex gap-3.5 p-3 hover:bg-slate-100/70 border-b border-transparent rounded-t-2xl cursor-pointer transition duration-150 items-center"
                >
                  <img
                    src={task.before_image || '/issue1.png'}
                    alt={issue.title || 'Task'}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-slate-950 truncate leading-snug">{issue.title || 'Civic Issue'}</p>
                     <p className="text-[10px] text-slate-500 font-medium mt-1">{formatDate(task.accepted_at)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Action Panel */}
                {isExpanded && (
                  <div className="p-3.5 bg-white border-t border-slate-100 text-xs text-slate-700 space-y-3">
                    <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                      Click the file input below to upload a photo of the completed resolution (the "After" proof) to submit it for verification.
                    </p>

                    {uploadError && (
                      <p className="text-[10px] font-bold text-red-500 bg-red-50 p-1.5 rounded">{uploadError}</p>
                    )}

                    <div className="flex flex-col gap-2">
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">After Resolution Proof Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        className="w-full text-[11px] text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-section file:text-primary hover:file:bg-teal-50 cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={() => handleUploadProof(task.id)}
                      disabled={isUploading}
                      className="w-full py-2 bg-primary hover:bg-primaryDark disabled:opacity-60 text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-3.5 h-3.5" />
                          <span>Submit Resolution Proof</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}