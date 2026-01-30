import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { Modal } from './Modal';
import { cn } from '../utils';

interface CsvDataRow { [key: string]: string | number | null; }
type ImportStep = 'UPLOAD' | 'PREVIEW' | 'IMPORTING' | 'RESULT';

const SAMPLE_CSV_DATA: CsvDataRow[] = [
  { 'Task Name': 'Thiết kế Logo', 'Description': 'Logo cho dự án mới', 'Due Date': '2023-11-01', 'Priority': 'High', 'Assignee': 'design@company.com' },
  { 'Task Name': 'Viết Content', 'Description': '', 'Due Date': '2023-11-05', 'Priority': 'Medium', 'Assignee': 'content@company.com' },
  { 'Task Name': 'Fix Bug #102', 'Description': 'Lỗi login', 'Due Date': 'invalid-date', 'Priority': 'Urgent', 'Assignee': '' },
];

export const CsvImportModal = ({ isOpen, onClose, onImportSuccess }: { isOpen: boolean; onClose: () => void; onImportSuccess: (count: number) => void; }) => {
  const [step, setStep] = useState<ImportStep>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CsvDataRow[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResults, setImportResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setStep('UPLOAD'); setFile(null); setParsedData([]); setUploadProgress(0); }, 300);
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) { alert('Vui lòng chỉ tải lên file .csv'); return; }
    setFile(file);
    setTimeout(() => { setParsedData(SAMPLE_CSV_DATA); setStep('PREVIEW'); }, 800);
  };

  const handleImport = () => {
    setStep('IMPORTING');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setImportResults({ success: 2, failed: 1 });
        setStep('RESULT');
      }
    }, 300);
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div 
        className={cn("border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer", isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50")}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]); }}
        onClick={() => document.getElementById('csv-upload-input')?.click()}
      >
        <input id="csv-upload-input" type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4"><UploadCloud className="w-8 h-8" /></div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Kéo thả file CSV vào đây</h3>
        <p className="text-sm text-slate-500 mb-6">hoặc nhấn để chọn từ máy tính</p>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full"><FileSpreadsheet className="w-3.5 h-3.5" /> Hỗ trợ: .csv (Max 5MB)</div>
      </div>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-indigo-500"/> Lưu ý về định dạng</h4>
        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 ml-1">
            <li>Dòng đầu tiên phải là tiêu đề cột.</li>
            <li>Định dạng ngày tháng: <code>YYYY-MM-DD</code>.</li>
            <li>Trường bắt buộc: <strong>Title, Priority, Due Date</strong>.</li>
        </ul>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-4 h-full flex flex-col">
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded"><FileSpreadsheet className="w-5 h-5" /></div>
                <div><p className="text-sm font-medium text-slate-900">{file?.name}</p><p className="text-xs text-slate-500">{(file?.size ? file.size / 1024 : 0).toFixed(2)} KB • {parsedData.length} dòng</p></div>
            </div>
            <button onClick={() => { setFile(null); setStep('UPLOAD'); }} className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="p-3 font-semibold text-slate-600 border-b border-slate-200 w-10">#</th>
                        {Object.keys(parsedData[0] || {}).map((header) => (
                            <th key={header} className="p-3 font-semibold text-slate-600 border-b border-slate-200 whitespace-nowrap">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {parsedData.map((row, idx) => {
                        const hasError = row['Due Date'] === 'invalid-date';
                        return (
                            <tr key={idx} className={cn("hover:bg-slate-50 transition-colors", hasError && "bg-red-50 hover:bg-red-100")}>
                                <td className="p-3 text-slate-500 font-mono text-xs border-r border-slate-100">{idx + 1}</td>
                                {Object.values(row).map((cell, cellIdx) => (
                                    <td key={cellIdx} className="p-3 text-slate-700 whitespace-nowrap">
                                        {hasError && cell === 'invalid-date' ? <div className="flex items-center gap-1 text-red-600 font-medium"><AlertTriangle className="w-3.5 h-3.5" /> Invalid</div> : cell}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderImportingStep = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-6">
        <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-indigo-600 text-sm">{uploadProgress}%</div>
        </div>
        <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">Đang nhập dữ liệu...</h3>
            <p className="text-sm text-slate-500">Vui lòng không tắt trình duyệt.</p>
        </div>
    </div>
  );

  const renderResultStep = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 py-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-in zoom-in duration-300"><CheckCircle2 className="w-10 h-10" /></div>
        <div className="text-center space-y-2"><h3 className="text-2xl font-bold text-slate-900">Hoàn tất!</h3><p className="text-slate-500">Quá trình nhập dữ liệu đã kết thúc.</p></div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center"><span className="block text-2xl font-bold text-emerald-600">{importResults.success}</span><span className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Thành công</span></div>
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center"><span className="block text-2xl font-bold text-red-600">{importResults.failed}</span><span className="text-xs text-red-700 font-medium uppercase tracking-wide">Lỗi / Bỏ qua</span></div>
        </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl max-h-[85vh]">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
        <div><h2 className="text-xl font-bold text-slate-900">Nhập dữ liệu từ CSV</h2><p className="text-sm text-slate-500">Thêm nhanh nhiều công việc vào dự án</p></div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
      </div>
      
      {/* STEPS INDICATOR */}
      <div className="px-10 py-4 bg-slate-50/50 border-b border-slate-100 flex-shrink-0">
         <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10" />
            {['Upload', 'Preview', 'Import'].map((label, index) => {
                const stepIdx = index + 1;
                const currentStepIdx = step === 'UPLOAD' ? 1 : step === 'PREVIEW' ? 2 : 3;
                const isActive = currentStepIdx >= stepIdx; const isCompleted = currentStepIdx > stepIdx;
                return (
                    <div key={label} className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300", isActive ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white text-slate-400", isCompleted && "bg-emerald-500 border-emerald-500")}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4"/> : stepIdx}
                        </div>
                        <span className={cn("text-xs font-medium", isActive ? "text-indigo-700" : "text-slate-400")}>{label}</span>
                    </div>
                )
            })}
         </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">
        {step === 'UPLOAD' && renderUploadStep()}
        {step === 'PREVIEW' && renderPreviewStep()}
        {step === 'IMPORTING' && renderImportingStep()}
        {step === 'RESULT' && renderResultStep()}
      </div>

      {step !== 'IMPORTING' && step !== 'RESULT' && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center rounded-b-2xl flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Hủy bỏ</button>
            <div className="flex gap-3">
                {step === 'PREVIEW' && <button onClick={() => setStep('UPLOAD')} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-white transition-colors">Quay lại</button>}
                <button onClick={step === 'UPLOAD' ? () => document.getElementById('csv-upload-input')?.click() : handleImport} disabled={step === 'UPLOAD' && !file} className={cn("px-6 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all flex items-center gap-2", (step === 'UPLOAD' && !file) ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200")}>
                    {step === 'UPLOAD' ? 'Chọn File' : 'Tiến hành Nhập'} {step === 'PREVIEW' && <ArrowRight className="w-4 h-4" />}
                </button>
            </div>
        </div>
      )}
      {step === 'RESULT' && (
         <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-center items-center rounded-b-2xl flex-shrink-0">
            <button onClick={() => { onImportSuccess(importResults.success); onClose(); }} className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">Đóng & Xem kết quả</button>
         </div>
      )}
    </Modal>
  );
};
