import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { documentsApi, Document } from "../lib/api/documents";
import { Upload, X, File, FileText, Image as ImageIcon, Download, Trash2 } from "lucide-react";

interface FileUploadModalProps {
  entityType: string;
  entityId: string;
  entityName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FileUploadModal({ entityType, entityId, entityName, onClose, onSuccess }: FileUploadModalProps) {
  const { isDark } = useTheme();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");

  // Load documents on mount
  useState(() => {
    loadDocuments();
  });

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documentsApi.getByEntity(entityType, entityId);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      await documentsApi.upload(selectedFile, entityType, entityId, category, description);
      await loadDocuments();
      setSelectedFile(null);
      setDescription("");
      setCategory("other");
      onSuccess();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await documentsApi.delete(docId);
      await loadDocuments();
      onSuccess();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete document");
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const blob = await documentsApi.download(doc.storage_path);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.file_name;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download document");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    if (fileType.includes("pdf")) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className="sticky top-0 z-10 p-6 border-b" style={{ borderColor: "#B8935E", backgroundColor: isDark ? "#1f2937" : "#ffffff" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Documents</h3>
              <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{entityName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <div style={{ borderColor: "#B8935E", borderWidth: "1px" }} className={`rounded-lg p-4 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Upload New Document</h4>

            <div className="space-y-4">
              {/* File Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Select File
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
                />
                {selectedFile && (
                  <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
                >
                  <option value="id_document">ID Document</option>
                  <option value="death_certificate">Death Certificate</option>
                  <option value="invoice">Invoice</option>
                  <option value="photo">Photo</option>
                  <option value="contract">Contract</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Add a description..."
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
                />
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-khambi-accent text-black rounded-lg hover:bg-khambi-gold font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </div>

          {/* Documents List */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Uploaded Documents ({documents.length})
            </h4>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khambi-accent"></div>
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{ borderColor: "#B8935E", borderWidth: "1px" }}
                    className={`rounded-lg p-4 ${isDark ? "bg-gray-700" : "bg-white"} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${isDark ? "bg-gray-600" : "bg-gray-100"}`}>
                          {getFileIcon(doc.file_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>{doc.file_name}</p>
                          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {doc.category?.replace("_", " ").toUpperCase()} • {formatFileSize(doc.file_size)}
                          </p>
                          {doc.description && (
                            <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{doc.description}</p>
                          )}
                          <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                            Uploaded by {doc.users?.first_name} {doc.users?.last_name} on {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 hover:bg-khambi-accent/20 rounded-lg"
                          title="Download"
                        >
                          <Download className="w-4 h-4 text-khambi-accent" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 hover:bg-red-100 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 p-6 border-t" style={{ borderColor: "#B8935E", backgroundColor: isDark ? "#1f2937" : "#ffffff" }}>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
