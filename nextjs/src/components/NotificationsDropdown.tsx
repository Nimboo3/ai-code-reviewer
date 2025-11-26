"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { Notification, NotificationType } from '@/lib/types';

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const dismissNotification = async (id: string) => {
        try {
            const response = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, dismissed: true }),
            });
            
            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error('Failed to dismiss notification:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, read: true }),
            });
            
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-amber-400" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-400" />;
            case 'info':
            default:
                return <Info className="w-4 h-4 text-cyan-400" />;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-lg transition-all"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] font-bold bg-cyan-500 text-white rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#2e333d] border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-cyan-500/15 text-cyan-400 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-8 text-center">
                                <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
                                <p className="text-sm text-slate-500 mt-2">Loading...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">No notifications</p>
                                <p className="text-xs text-slate-500 mt-1">You&apos;re all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-700/40">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`relative px-4 py-3 hover:bg-slate-700/30 transition-colors group cursor-pointer ${
                                            !notification.read ? 'bg-slate-700/20' : ''
                                        }`}
                                        onClick={() => !notification.read && markAsRead(notification.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${
                                                    !notification.read ? 'text-slate-100' : 'text-slate-300'
                                                }`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-1">
                                                    {formatTime(notification.created_at)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dismissNotification(notification.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-600/40 rounded transition-all"
                                                title="Dismiss"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        {!notification.read && (
                                            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-slate-700/50 bg-slate-800/30">
                            <button
                                onClick={() => {
                                    notifications.forEach(n => dismissNotification(n.id));
                                }}
                                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                Clear all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
