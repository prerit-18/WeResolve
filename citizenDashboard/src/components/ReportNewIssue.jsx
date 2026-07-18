import { useState } from 'react'
import { MapPin, ListChecks, ImagePlus, Send, Plus, X } from 'lucide-react'
import { issuesApi } from '../api'

const steps = [
  { label: 'Add', sub: 'Location', icon: MapPin },
  { label: 'Select', sub: 'Category', icon: ListChecks },
  { label: 'Upload', sub: 'Photo', icon: ImagePlus },
  { label: 'Submit', sub: 'Issue', icon: Send },
]

export default function ReportNewIssue({ location, onReportSubmitted }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Road Damage');
  const [priority, setPriority] = useState('Medium');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title || !description || !file) {
      setError('Please fill in all fields and select a photo.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('priority', priority);
    formData.append('image', file);
    
    if (location) {
      formData.append('latitude', location.latitude + (Math.random() - 0.5) * 0.001);
      formData.append('longitude', location.longitude + (Math.random() - 0.5) * 0.001);
    } else {
      // Default Koramangala coordinates fallback
      formData.append('latitude', 12.9348 + (Math.random() - 0.5) * 0.01);
      formData.append('longitude', 77.6208 + (Math.random() - 0.5) * 0.01);
    }

    try {
      await issuesApi.create(formData);
      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setShowForm(false);
      if (onReportSubmitted) onReportSubmitted();
    } catch (err) {
      setError(err.message || 'Failed to submit issue report.');
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Submit Civic Report</h2>
            <p className="text-xs text-slate-400">Describe the issue and upload proof</p>
          </div>
          <button 
            onClick={() => setShowForm(false)} 
            className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 flex-1 flex flex-col">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Broken pipe flooding lane"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Description</label>
            <textarea
              required
              rows={2}
              placeholder="Detail the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold bg-white outline-none"
              >
                <option value="Road Damage">Road Damage</option>
                <option value="Garbage">Garbage</option>
                <option value="Street Light">Street Light</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Drainage">Drainage</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold bg-white outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Attach photo</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm mt-auto flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Uploading report...' : 'Submit Report'}</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <h2 className="text-base font-bold text-slate-900">Report New Issue</h2>
      <p className="mt-1 text-sm text-slate-400">Help us by reporting issues in your area</p>

      <div className="mt-8 flex flex-1 items-start justify-center gap-1 px-1">
        {steps.map(({ label, sub, icon: Icon }, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                <Icon className="h-5 w-5 text-brand-500" strokeWidth={2} />
              </div>
              <div className="text-xs leading-tight text-slate-500">
                <p className="font-medium text-slate-600">{label}</p>
                <p>{sub}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-1 mb-6 h-px flex-1 border-t border-dashed border-slate-200" />
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={() => setShowForm(true)} 
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-200 transition-colors hover:bg-brand-600"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Report an Issue
      </button>
    </div>
  )
}
