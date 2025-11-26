"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Download, Share2, Trash2, Loader2, FileIcon, AlertCircle, CheckCircle, Copy, HardDrive } from 'lucide-react';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';
import { FileObject } from '@supabase/storage-js';

export default function FileManagementPage() {
    const { user } = useGlobal();
    const [files, setFiles] = useState<FileObject[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (user?.id) {
            loadFiles();
        }
    }, [user]);

    const loadFiles = async () => {
        try {
            setLoading(true);
            setError('');
            const supabase = await createSPASassClient();
            const { data, error } = await supabase.getFiles(user!.id);

            if (error) throw error;
            setFiles(data || []);
        } catch (err) {
            setError('Failed to load files');
            console.error('Error loading files:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            setError('');

            const supabase = await createSPASassClient();
            const { error } = await supabase.uploadFile(user!.id!, file.name, file);

            if (error) throw error;

            await loadFiles();
            setSuccess('File uploaded successfully');
        } catch (err) {
            setError('Failed to upload file');
            console.error('Error uploading file:', err);
        } finally {
            setUploading(false);
        }
    };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;
        handleFileUpload(fileList[0]);
        event.target.value = '';
    };


    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, []);


    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);


    const handleDownload = async (filename: string) => {
        try {
            setError('');
            const supabase = await createSPASassClient();
            const { data, error } = await supabase.shareFile(user!.id!, filename, 60, true);

            if (error) throw error;

            window.open(data.signedUrl, '_blank');
        } catch (err) {
            setError('Failed to download file');
            console.error('Error downloading file:', err);
        }
    };

    const handleShare = async (filename: string) => {
        try {
            setError('');
            const supabase = await createSPASassClient();
            const { data, error } = await supabase.shareFile(user!.id!, filename, 24 * 60 * 60);

            if (error) throw error;

            setShareUrl(data.signedUrl);
            setSelectedFile(filename);
        } catch (err) {
            setError('Failed to generate share link');
            console.error('Error sharing file:', err);
        }
    };

    const handleDelete = async () => {
        if (!fileToDelete) return;

        try {
            setError('');
            const supabase = await createSPASassClient();
            const { error } = await supabase.deleteFile(user!.id!, fileToDelete);

            if (error) throw error;

            await loadFiles();
            setSuccess('File deleted successfully');
        } catch (err) {
            setError('Failed to delete file');
            console.error('Error deleting file:', err);
        } finally {
            setShowDeleteDialog(false);
            setFileToDelete(null);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            setError('Failed to copy to clipboard');
        }
    };


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <HardDrive className="h-8 w-8 text-cyan-400" />
                    File Management
                </h1>
                <p className="mt-2 text-gray-400">Upload, download, and share your files</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-white/[0.06] p-6 space-y-6">
                {error && (
                    <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/30 text-red-400">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-4 bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                        <CheckCircle className="h-4 w-4"/>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-center w-full">
                    <label
                        className={`w-full flex flex-col items-center px-4 py-8 bg-white/[0.02] rounded-xl cursor-pointer transition-all border-2 border-dashed ${
                            isDragging
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-white/[0.1] hover:border-cyan-500/50 hover:bg-white/[0.03]'
                        }`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="w-8 h-8 text-cyan-400"/>
                        <span className="mt-2 text-base text-gray-400">
                            {uploading
                                ? 'Uploading...'
                                : isDragging
                                    ? 'Drop your file here'
                                    : 'Drag and drop or click to select a file (max 50mb)'}
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleInputChange}
                            disabled={uploading}
                        />
                    </label>
                </div>

                <div className="space-y-3">
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-cyan-400"/>
                        </div>
                    )}
                    {!loading && files.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No files uploaded yet</p>
                    ) : (
                        files.map((file) => (
                            <div
                                key={file.name}
                                className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <FileIcon className="h-6 w-6 text-gray-500"/>
                                    <span className="font-medium text-white">{file.name.split('/').pop()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleDownload(file.name)}
                                        className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors"
                                        title="Download"
                                    >
                                        <Download className="h-5 w-5"/>
                                    </button>
                                    <button
                                        onClick={() => handleShare(file.name)}
                                        className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-colors"
                                        title="Share"
                                    >
                                        <Share2 className="h-5 w-5"/>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFileToDelete(file.name);
                                            setShowDeleteDialog(true);
                                        }}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-5 w-5"/>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Share Dialog */}
                <Dialog open={Boolean(shareUrl)} onOpenChange={() => {
                    setShareUrl('');
                    setSelectedFile(null);
                }}>
                    <DialogContent className="bg-[#0f1117] border-white/[0.1]">
                        <DialogHeader>
                            <DialogTitle className="text-white">Share {selectedFile?.split('/').pop()}</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Copy the link below to share your file. This link will expire in 24 hours.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 p-2 border border-white/[0.1] rounded-lg bg-[#0a0c0f] text-white text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(shareUrl)}
                                className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors relative"
                            >
                                <Copy className="h-5 w-5"/>
                                {showCopiedMessage && (
                                    <span
                                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white text-xs px-2 py-1 rounded">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent className="bg-[#0f1117] border-white/[0.1]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete File</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to delete this file? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 border-white/[0.1] text-gray-300 hover:bg-white/10">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}