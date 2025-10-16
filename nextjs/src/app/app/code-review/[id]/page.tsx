import React from 'react'
import { createSSRClient } from '@/lib/supabase/server'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Tables } from '@/lib/types';

type CodeReview = Tables<'code_reviews'>;

export default async function CodeReviewDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createSSRClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return (
      <div className="p-8">Unauthorized</div>
    )
  }
  const { data: review } = (await supabase
    .from('code_reviews')
    .select('*')
    .eq('id', Number(id))
    .eq('owner', user.id)
    .single()) as { data: CodeReview | null }
  if (!review) {
    return notFound()
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-md border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">{review.file_name}</div>
            <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleString()} • {review.language || 'unknown'} • {review.model}</div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-md border prose">
        <ReactMarkdown>{review.report_md || 'No report.'}</ReactMarkdown>
      </div>
      <div className="flex items-center justify-between">
        <Link href="/app/code-review" className="text-sm text-blue-600 hover:underline">
          Back to list
        </Link>
      </div>
    </div>
  )
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSSRClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      title: 'Unauthorized',
      description: 'Unauthorized',
    }
  }
  const { data: review } = (await supabase
    .from('code_reviews')
    .select('*')
    .eq('id', Number(id))
    .eq('owner', user.id)
    .single()) as { data: CodeReview | null }
  if (!review) {
    return {
      title: 'Not found',
      description: 'Not found',
    }
  }
  return {
    title: review.file_name,
    description: review.report_md || 'No report.',
  }
}
