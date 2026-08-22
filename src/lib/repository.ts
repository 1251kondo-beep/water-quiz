import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LessonResult, UserStats } from '@/types/quiz';
import { getUserStats as getLocalStats, saveLessonResult as saveLocalResult } from '@/lib/storage';

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server_session';
  let id = localStorage.getItem('water_quiz_session_id');
  if (!id) {
    id = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('water_quiz_session_id', id);
  }
  return id;
};

export async function syncLessonResultToSupabase(result: LessonResult, courseId?: string): Promise<void> {
  // Always save locally first
  saveLocalResult(result, courseId);

  if (!isSupabaseConfigured() || !supabase) return;

  const sessionId = getSessionId();

  try {
    const { error } = await supabase.from('user_progress').upsert(
      {
        user_session_id: sessionId,
        lesson_id: result.lessonId,
        score: result.score,
        total_questions: result.totalQuestions,
        percentage: result.percentage,
        passed: result.passed,
        stars: result.stars,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_session_id,lesson_id' }
    );

    if (error) {
      console.warn('Supabase sync warning (user_progress):', error.message);
    } else {
      console.log('✅ Successfully synced lesson result to Supabase PostgreSQL!');
    }
  } catch (err) {
    console.error('Failed to sync to Supabase:', err);
  }
}

export async function syncMistakesToSupabase(questionIds: string[]): Promise<void> {
  if (!isSupabaseConfigured() || !supabase || questionIds.length === 0) return;

  const sessionId = getSessionId();
  const rows = questionIds.map((qId) => ({
    user_session_id: sessionId,
    question_id: qId,
  }));

  try {
    await supabase.from('user_mistakes').upsert(rows, { onConflict: 'user_session_id,question_id' });
  } catch (err) {
    console.warn('Supabase mistake sync warning:', err);
  }
}

export async function syncBookmarksToSupabase(questionId: string, isBookmarked: boolean): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return;

  const sessionId = getSessionId();

  try {
    if (isBookmarked) {
      await supabase.from('user_bookmarks').upsert(
        { user_session_id: sessionId, question_id: questionId },
        { onConflict: 'user_session_id,question_id' }
      );
    } else {
      await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_session_id', sessionId)
        .eq('question_id', questionId);
    }
  } catch (err) {
    console.warn('Supabase bookmark sync warning:', err);
  }
}
