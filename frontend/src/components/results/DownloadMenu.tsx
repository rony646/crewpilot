import { useState, useRef, useEffect } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadMenuProps {
  onDownloadMarkdown: () => void;
  onDownloadPDF: () => void;
  isDownloading: boolean;
}

export function DownloadMenu({
  onDownloadMarkdown,
  onDownloadPDF,
  isDownloading,
}: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
        disabled={isDownloading}
      >
        <Download className="w-4 h-4" />
        Download
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-elevated border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={() => {
              onDownloadMarkdown();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-text-secondary" />
            <div className="flex-1">
              <div className="text-sm font-medium">Markdown</div>
              <div className="text-xs text-text-muted">Download as .md file</div>
            </div>
          </button>

          <div className="h-px bg-border" />

          <button
            onClick={() => {
              onDownloadPDF();
              setIsOpen(false);
            }}
            disabled={isDownloading}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 text-text-secondary" />
            <div className="flex-1">
              <div className="text-sm font-medium">
                {isDownloading ? "Generating PDF..." : "PDF"}
              </div>
              <div className="text-xs text-text-muted">Download as .pdf file</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
