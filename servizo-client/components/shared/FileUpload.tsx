import { useRef, useState, useEffect } from "react"; // Import useEffect
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileText } from "lucide-react"; // Make sure lucide-react is installed

interface FancyFileUploadProps {
    label: string;
    accept?: string;
    multiple?: boolean;
    onFileSelect: (files: File[] | null) => void; // Changed FileList to File[] for consistency
    currentFile: File | null; // New prop to receive the currently selected file
}

const FancyFileUpload = ({ label, accept = "", multiple = false, onFileSelect, currentFile }: FancyFileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    // Use useEffect to update fileNames when currentFile prop changes
    useEffect(() => {
        if (currentFile) {
            setFileNames([currentFile.name]);
        } else {
            setFileNames([]); // Clear file names if currentFile is null
        }
    }, [currentFile]); // Dependency array: re-run when currentFile changes

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const selectedFilesArray = Array.from(files);
            setFileNames(selectedFilesArray.map((file) => file.name));
            onFileSelect(selectedFilesArray); // Pass an array of files
        } else {
            setFileNames([]); // No files selected, clear display
            onFileSelect(null); // Indicate no files selected
        }
        // It's generally not recommended to manually clear e.target.value directly
        // React handles this naturally when state controlling the input changes.
        // If you absolutely need to, you might use: e.target.value = '';
        // but often managing the state (formData) is sufficient.
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const droppedFilesArray = Array.from(files);
            setFileNames(droppedFilesArray.map((file) => file.name));
            onFileSelect(droppedFilesArray);
        } else {
            setFileNames([]);
            onFileSelect(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    return (
        <div className="space-y-2 w-full"> {/* Added w-full for better responsiveness */}
            <Label className="text-sm font-medium">{label}</Label>
            <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="text-center block cursor-pointer" // Added block and cursor-pointer
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    onChange={handleFileChange}
                    // For controlled input behavior if needed, though often not for type="file"
                    // value={currentFile ? '' : undefined} // This helps in some reset scenarios but can be tricky
                />
                <div
                    className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl p-8 h-[180px] transition
                        ${isDragOver ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-500"}`}
                >
                    <UploadCloud className="w-6 h-6 text-blue-600" />
                    <p className="text-sm text-gray-600">
                        <span
                            className="text-blue-600 font-medium underline cursor-pointer"
                            onClick={(e) => { // Prevent label click from triggering input click twice
                                e.stopPropagation();
                                inputRef.current?.click();
                            }}
                        >
                            choose file
                        </span>
                        {" or drag and drop here"} {/* Added text for drag and drop */}
                    </p>
                </div>
            </label>

            {/* Displaying selected/current file name */}
            {fileNames.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-gray-700 max-h-[100px] overflow-y-auto">
                    {fileNames.map((name, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            {name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FancyFileUpload;