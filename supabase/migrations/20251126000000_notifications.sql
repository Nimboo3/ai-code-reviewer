-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN NOT NULL DEFAULT false,
    dismissed BOOLEAN NOT NULL DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read) WHERE NOT dismissed;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications"
    ON notifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications for any user"
    ON notifications
    FOR INSERT
    WITH CHECK (true);

-- Function to create welcome notification on user signup
CREATE OR REPLACE FUNCTION create_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
        NEW.id,
        '🎉 Welcome to CodeReview.ai!',
        'Start by uploading your first code file for an AI-powered review. We''ll analyze your code for bugs, security issues, and quality improvements.',
        'info',
        '/app/code-review'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create welcome notification on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created_notification ON auth.users;
CREATE TRIGGER on_auth_user_created_notification
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_welcome_notification();
