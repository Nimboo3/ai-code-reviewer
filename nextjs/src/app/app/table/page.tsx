"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import {
    createSPASassClientAuthenticated as createSPASassClient
} from '@/lib/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2, Plus, Trash2, AlertCircle, ListTodo } from 'lucide-react';
import Confetti from '@/components/Confetti';

// Local types for todo_list (legacy feature)
interface Task {
    id: number;
    created_at: string;
    title: string;
    description: string | null;
    done: boolean;
    urgent: boolean;
    owner: string;
}

interface NewTask {
    title: string;
    description: string | null;
    urgent: boolean;
    owner: string;
    done: boolean;
}

interface CreateTaskDialogProps {
    onTaskCreated: () => Promise<void>;
}

function CreateTaskDialog({ onTaskCreated }: CreateTaskDialogProps) {
    const { user } = useGlobal();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');
    const [isUrgent, setIsUrgent] = useState<boolean>(false);

    const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !user?.id) return;

        try {
            setLoading(true);
            const supabase = await createSPASassClient();
            const newTask: NewTask = {
                title: newTaskTitle.trim(),
                description: newTaskDescription.trim() || null,
                urgent: isUrgent,
                owner: user.id,
                done: false
            };

            const { error: supabaseError } = await supabase.createTask(newTask);
            if (supabaseError) throw supabaseError;

            setNewTaskTitle('');
            setNewTaskDescription('');
            setIsUrgent(false);
            setOpen(false);
            await onTaskCreated();
        } catch (err) {
            setError('Failed to add task');
            console.error('Error adding task:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all border border-cyan-500/30">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2e333d] border-slate-600/40">
                <DialogHeader>
                    <DialogTitle className="text-slate-100">Create New Task</DialogTitle>
                </DialogHeader>
                {error && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Task title"
                            required
                            className="bg-slate-900/60 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            placeholder="Task description (optional)"
                            rows={3}
                            className="bg-slate-900/60 border-slate-700/50 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={isUrgent}
                                onChange={(e) => setIsUrgent(e.target.checked)}
                                className="rounded border-slate-700/50 bg-slate-800/60 focus:ring-cyan-500/50 text-cyan-500"
                            />
                            <span className="text-sm text-slate-400">Mark as urgent</span>
                        </label>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Task
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function TaskManagementPage() {
    const { user } = useGlobal();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [filter, setFilter] = useState<boolean | null>(null);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    const loadTasks = useCallback(async (): Promise<void> => {
        try {
            const isFirstLoad = initialLoading;
            if (!isFirstLoad) setLoading(true);

            const supabase = await createSPASassClient();
            const { data, error: supabaseError } = await supabase.getMyTodoList(1, 100, 'created_at', filter);

            if (supabaseError) throw supabaseError;
            setTasks(data || []);
        } catch (err) {
            setError('Failed to load tasks');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    }, [filter, initialLoading]);

    useEffect(() => {
        if (user?.id) {
            loadTasks();
        }
    }, [filter, user?.id, loadTasks]);

    const handleRemoveTask = async (id: number): Promise<void> => {
        try {
            const supabase = await createSPASassClient();
            const { error: supabaseError } = await supabase.removeTask(id);
            if (supabaseError) throw supabaseError;
            await loadTasks();
        } catch (err) {
            setError('Failed to remove task');
            console.error('Error removing task:', err);
        }
    };

    const handleMarkAsDone = async (id: number): Promise<void> => {
        try {
            const supabase = await createSPASassClient();
            const { error: supabaseError } = await supabase.updateAsDone(id);
            if (supabaseError) throw supabaseError;
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);

            await loadTasks();
        } catch (err) {
            setError('Failed to update task');
            console.error('Error updating task:', err);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <ListTodo className="h-8 w-8 text-cyan-400" />
                        Task Management
                    </h1>
                    <p className="mt-2 text-slate-400">Manage your tasks and to-dos</p>
                </div>
                <CreateTaskDialog onTaskCreated={loadTasks} />
            </div>

            <div className="bg-[#2e333d] backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                {error && (
                    <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="mb-6 flex gap-2">
                    <Button
                        onClick={() => setFilter(null)}
                        size="sm"
                        className={filter === null 
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                            : "bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:bg-slate-700/60"
                        }
                    >
                        All Tasks
                    </Button>
                    <Button
                        onClick={() => setFilter(false)}
                        size="sm"
                        className={filter === false 
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                            : "bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:bg-slate-700/60"
                        }
                    >
                        Active
                    </Button>
                    <Button
                        onClick={() => setFilter(true)}
                        size="sm"
                        className={filter === true 
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                            : "bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:bg-slate-700/60"
                        }
                    >
                        Completed
                    </Button>
                </div>

                <div className="space-y-3 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-[#2e333d]/50 flex items-center justify-center backdrop-blur-sm rounded-lg z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                        </div>
                    )}

                    {tasks.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-500">No tasks found</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`p-4 rounded-lg transition-colors border ${
                                    task.done 
                                        ? 'bg-slate-800/20 border-slate-800/40' 
                                        : 'bg-slate-800/40 border-slate-700/40'
                                } ${
                                    task.urgent && !task.done ? 'border-red-500/30' : ''
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium ${task.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                                        )}
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-xs text-slate-600">
                                                Created: {new Date(task.created_at).toLocaleDateString()}
                                            </span>
                                            {task.urgent && !task.done && (
                                                <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
                                                    Urgent
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {!task.done && (
                                            <Button
                                                onClick={() => handleMarkAsDone(task.id)}
                                                variant="ghost"
                                                size="icon"
                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleRemoveTask(task.id)}
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Confetti active={showConfetti} />
        </div>
    );
}