import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, CheckCircle2, AlertTriangle, Loader2, Eye, ShieldCheck, FileCheck, Trash2 } from 'lucide-react';
import type { Prescription } from '../../types';
import { prescriptionService } from '../../services/api';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

export const PrescriptionUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await prescriptionService.getMyPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      console.error('Failed to load prescription history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const validateFile = (file: File): string | null => {
    if (!file) {
      return 'Please upload a valid prescription image or PDF.';
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type);
    const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

    if (!isMimeValid && !isExtValid) {
      return 'Please upload a valid prescription image or PDF.';
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'File size must be less than 5 MB.';
    }

    if (file.size === 0) {
      return 'Please upload a valid prescription image or PDF.';
    }

    return null;
  };

  const handleFileSelect = (file: File | undefined | null) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setErrorMsg(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please upload a valid prescription image or PDF.');
      return;
    }

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await prescriptionService.uploadPrescription(selectedFile);
      if (result.success) {
        setSuccessMsg('Prescription uploaded successfully!');
        handleClearSelection();
        await fetchHistory();
      } else {
        setErrorMsg(result.message || 'Failed to upload prescription.');
      }
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || 'File size must be less than 5 MB.';
      setErrorMsg(backendMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusBadge = (status: Prescription['status']) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Prescription Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Upload size={20} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Upload Prescription
            </h2>
            <p className="text-xs text-slate-500">
              Upload doctor's prescription for quick verification and medicine fulfillment.
            </p>
          </div>
        </div>

        {/* Validation Errors */}
        {errorMsg && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-xs font-bold text-rose-700 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          {/* File Drag and Drop Zone */}
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50/60 hover:bg-teal-50/30 rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <div className="w-14 h-14 rounded-full bg-white shadow-xs text-teal-600 group-hover:scale-110 flex items-center justify-center mx-auto mb-3 transition-transform">
                <Upload size={24} />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Click to upload <span className="font-normal text-slate-500">or drag & drop file</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supported Formats: <strong>JPG, PNG, PDF</strong> (Max size: <strong>5 MB</strong>)
              </p>
            </div>
          ) : (
            /* Selected File Preview Box */
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {previewUrl ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 shrink-0 bg-white">
                    <img src={previewUrl} alt="Prescription Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                    <FileText size={28} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="uppercase font-semibold text-teal-700">{selectedFile.name.split('.').pop()}</span>
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 border border-emerald-200">
                    <FileCheck size={12} /> Ready for Secure Upload
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleClearSelection}
                  disabled={isUploading}
                  className="px-3 py-2 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={14} /> Remove
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Submit Prescription
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Confidentiality Notice */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck size={14} className="text-teal-600 shrink-0" />
          <span>Your uploaded prescription is encrypted and accessible strictly by you and authorized healthcare providers.</span>
        </div>
      </div>

      {/* Prescription History Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText size={18} className="text-teal-600" />
            My Uploaded Prescriptions
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {prescriptions.length} Records
          </span>
        </div>

        {loadingHistory ? (
          <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin text-teal-600" />
            Loading prescription history...
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <FileText size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-600">No prescriptions uploaded yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Upload a doctor's prescription above to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
            {prescriptions.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 bg-white hover:bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
                    {item.fileType.includes('pdf') ? <FileText size={20} /> : <ImageIcon size={20} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {item.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>Uploaded {new Date(item.uploadedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{formatFileSize(item.fileSize)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <a
                    href={prescriptionService.getPrescriptionFileUrl(item.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-1 text-slate-700 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 hover:border-teal-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    title="Secure View / Download"
                  >
                    <Eye size={13} /> View File
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionUpload;
