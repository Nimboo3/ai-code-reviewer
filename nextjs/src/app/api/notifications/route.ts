import { NextRequest, NextResponse } from 'next/server';
import { createSSRClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSSRClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Use any to bypass strict typing for tables not yet in schema
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any;
    
    let queryBuilder = client
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('dismissed', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      queryBuilder = queryBuilder.eq('read', false);
    }

    const { data: notifications, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }

    // Get unread count
    const { count: unreadCount } = await client
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false)
      .eq('dismissed', false);

    return NextResponse.json({ 
      notifications: notifications || [],
      unreadCount: unreadCount || 0
    });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSSRClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    // Use any to bypass strict typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any;

    if (action === 'markAllRead') {
      const { error: bulkError } = await client
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('dismissed', false);

      if (bulkError) {
        return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    let updateData: Record<string, boolean> = {};

    switch (action) {
      case 'read':
        updateData = { read: true };
        break;
      case 'dismiss':
        updateData = { dismissed: true };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { error } = await client
      .from('notifications')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating notification:', error);
      return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
