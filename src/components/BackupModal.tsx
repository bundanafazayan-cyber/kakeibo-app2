import React, { useState } from 'react';
import { exportKakeiboBackup, validateBackupFile, restoreKakeiboBackup } from '../db/backup';
import { X, Download, Upload, ShieldCheck, AlertCircle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPersisted: boolean;
  storageInfo: { quotaUsedMB: number; quotaTotalMB: number };
  onRefreshData: () => Promise<void>;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  isPersisted,
  storageInfo,
  onRefreshData
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      await exportKakeiboBackup();
      setStatusMessage('File cadangan JSON berhasil diunduh ke perangkat Anda.');
    } catch (err) {
      setStatusMessage('Gagal mengunduh berkas cadangan.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setIsProcessing(true);
        const parsed = JSON.parse(evt.target?.result as string);
        const validation = validateBackupFile(parsed);

        if (!validation.valid || !validation.data) {
          alert(`Peringatan: ${validation.message}`);
          setIsProcessing(false);
          return;
        }

        const confirmRestore = confirm(
          'Apakah Anda yakin ingin memulihkan data ini? Sistem telah menyiapkan snapshot darurat jika terjadi kesalahan.'
        );

        if (!confirmRestore) {
          setIsProcessing(false);
          return;
        }

        const res = await restoreKakeiboBackup(validation.data, 'replace');
        setStatusMessage(res.message);
        if (res.success) {
          await onRefreshData();
        }
      } catch (err) {
        alert('Format berkas tidak valid atau rusak.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-sumi/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-washi w-full max-w-md rounded-2xl p-6 shadow-xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <h3 className="font-serif font-bold text-lg text-sumi">Cadangan & Penyimpanan</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mt-4 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-sumi">
              <ShieldCheck className={`w-4 h-4 ${isPersisted ? 'text-emerald-600' : 'text-amber-500'}`} />
              Penyimpanan Browser Lokal (IndexedDB)
            </div>
            <p className="text-stone-500 text-[11px]">
              {isPersisted
                ? 'Status: Persisten (OS tidak akan menghapus data ini otomatis).'
                : 'Status: Standar (OS berpotensi menghapus cache jika memori HP kritis).'}
            </p>
            {storageInfo.quotaTotalMB > 0 && (
              <p className="text-[10px] text-stone-400 font-mono">
                Terpakai: {storageInfo.quotaUsedMB} MB dari {storageInfo.quotaTotalMB} MB kuota browser
              </p>
            )}
          </div>

          <div className="p-3 border border-stone-200 rounded-xl space-y-2">
            <h4 className="font-semibold text-sumi flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Ekspor File JSON
            </h4>
            <p className="text-stone-500 text-[11px]">
              Simpan seluruh transaksi, target, dan catatan refleksi ke file fisik di HP/Komputer Anda.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-2 bg-matcha-dark text-washi rounded-lg font-medium hover:bg-matcha transition-colors"
            >
              Unduh File Cadangan
            </button>
          </div>

          <div className="p-3 border border-stone-200 rounded-xl space-y-2">
            <h4 className="font-semibold text-sumi flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Pulihkan dari File JSON
            </h4>
            <p className="text-stone-500 text-[11px]">
              Pilih file cadangan Kakeibo yang pernah diunduh sebelumnya.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="block w-full text-[11px] text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
            />
          </div>

          {statusMessage && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] border border-emerald-200 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
