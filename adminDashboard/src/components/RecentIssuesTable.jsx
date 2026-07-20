import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, MoreVertical, ImageOff } from 'lucide-react';

const categoryStyles = {
  'Road Damage': 'bg-blue-50 text-blue-700 border-blue-100',
  'Garbage': 'bg-green-50 text-green-700 border-green-100',
  'Street Light': 'bg-purple-50 text-purple-700 border-purple-100',
  'Water Supply': 'bg-teal-50 text-teal-700 border-teal-100',
  'Drainage': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Others': 'bg-slate-50 text-slate-700 border-slate-200',
};

const priorityStyles = {
  High: 'bg-red-50 text-red-600 border-red-100',
  Medium: 'bg-amber-50 text-amber-600 border-amber-100',
  Low: 'bg-green-50 text-green-600 border-green-100',
};

const statusStyles = {
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
  'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
  'Completed': 'bg-purple-50 text-purple-700 border-purple-100',
};

export default function RecentIssuesTable({ issues = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  const getIssueLocationName = (lat, lon) => {
    if (!lat || !lon) return "Koramangala, Bengaluru";
    const dKora = Math.hypot(lat - 12.9348, lon - 77.6208);
    const dHsr = Math.hypot(lat - 12.9116, lon - 77.6388);
    if (dKora > 0.05 && dHsr > 0.05) {
      return `Location (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
    }
    return dHsr < dKora ? "HSR Layout, Bengaluru" : "Koramangala, Bengaluru";
  };

  const formatDate = (dateStr) => {
    try {
      let formattedStr = dateStr;
      if (dateStr && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
        formattedStr = dateStr.replace(' ', 'T') + 'Z';
      }
      const d = new Date(formattedStr);
      return {
        date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch (_) {
      return { date: 'Recent', time: '' };
    }
  };

  // Filter Logic
  const filteredIssues = issues.filter((issue) => {
    const issueLoc = getIssueLocationName(issue.latitude, issue.longitude);
    
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(issue.id).includes(searchTerm) ||
      issueLoc.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'All Status' || 
      issue.status === statusFilter;
      
    const matchesCategory = 
      categoryFilter === 'All Categories' || 
      issue.category === categoryFilter;

    const matchesLocation = 
      locationFilter === 'All Locations' || 
      issueLoc === locationFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header and Filter Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-[15px] font-bold text-slate-900 leading-none">Recent Issues</h3>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Dropdown Filters */}
          <select 
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-slate-600 text-xs font-bold outline-none cursor-pointer hover:border-slate-300 w-full sm:w-auto"
          >
            <option value="All Locations">All Locations</option>
            <option value="Koramangala, Bengaluru">Koramangala</option>
            <option value="HSR Layout">HSR Layout</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-slate-600 text-xs font-bold outline-none cursor-pointer hover:border-slate-300 w-full sm:w-auto"
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-slate-600 text-xs font-bold outline-none cursor-pointer hover:border-slate-300 w-full sm:w-auto"
          >
            <option value="All Categories">All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Garbage">Garbage</option>
            <option value="Street Light">Street Light</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Drainage">Drainage</option>
            <option value="Others">Others</option>
          </select>

          {/* Search Input */}
          <div className="relative flex items-center w-full sm:w-auto">
            <Search className="absolute left-3.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search issue ID, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200/80 rounded-xl text-slate-600 text-xs font-semibold outline-none w-full sm:w-56 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Issue ID</th>
              <th className="pb-3">Title</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Priority</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Reported On</th>
              <th className="pb-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredIssues.map((issue) => {
              const { date, time } = formatDate(issue.created_at);
              const issueLoc = getIssueLocationName(issue.latitude, issue.longitude);
              return (
                <tr key={issue.id} className="text-slate-800 hover:bg-slate-50/50 transition duration-150 text-xs font-bold group">
                  {/* ID */}
                  <td className="py-3.5 pl-2 text-slate-400 font-extrabold">UP-{issue.id}</td>
                  
                  {/* Title and Thumbnail */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      {issue.image_url ? (
                        <img
                          src={issue.image_url}
                          alt={issue.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <ImageOff className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                      <span className="text-slate-900 font-extrabold max-w-[200px] truncate">{issue.title}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 border rounded-md text-[10px] bg-slate-50 text-slate-700">
                      {issue.category}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 text-slate-500 font-medium">{issueLoc}</td>

                  {/* Priority */}
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 border rounded-md text-[10px] ${priorityStyles[issue.priority] || 'bg-slate-50 text-slate-600'}`}>
                      {issue.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 border rounded-md text-[10px] ${statusStyles[issue.status] || 'bg-slate-50 text-slate-700'}`}>
                      {issue.status}
                    </span>
                  </td>

                  {/* Date / Time */}
                  <td className="py-3.5 text-slate-500 leading-normal font-medium">
                    <div>{date}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{time}</div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition text-[11px]">
                        View
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Row */}
      <div className="flex items-center justify-between border-t border-slate-100 mt-5 pt-4 text-xs font-bold text-slate-500">
        <div>
          <span>Showing 1 to {filteredIssues.length} of {filteredIssues.length} results</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          </button>
          
          <button className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-sm">
            1
          </button>
          
          <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
