/**
 * BaoPulse — Profiles
 */
import { supabase } from './supabase.js';
import { getState, setState } from './state.js';
import { showToast, validateUsername } from './utils.js';
import { isFollowing, toggleFollow } from './follows.js';
import { CONFIG } from './config.js';

export async function getProfileByUsername(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', username)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function getProfileById(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function updateProfile(updates) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  if (updates.username) {
    const err = validateUsername(updates.username);
    if (err) return { error: err };
    updates.username = updates.username.toLowerCase();
  }

  if (updates.bio && updates.bio.length > CONFIG.MAX_BIO_LENGTH) {
    return { error: `Описание максимум ${CONFIG.MAX_BIO_LENGTH} символов` };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return { error: 'Username уже занят' };
    return { error: error.message };
  }

  setState({ profile: data });
  return { data };
}

export async function uploadAvatar(file) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  if (!file.type.startsWith('image/')) return { error: 'Только изображения' };
  if (file.size > CONFIG.MAX_AVATAR_SIZE_MB * 1024 * 1024) {
    return { error: `Максимум ${CONFIG.MAX_AVATAR_SIZE_MB} МБ` };
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
  // Cache bust
  const url = publicUrl + '?t=' + Date.now();

  return updateProfile({ avatar_url: url });
}

export async function getUserPosts(userId, type = 'posts', cursor = null, limit = 20) {
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(id, username, display_name, avatar_url, is_verified),
      media:post_media(*)
    `)
    .eq('author_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (type === 'posts') {
    query = query.eq('is_reply', false);
  } else if (type === 'replies') {
    query = query.eq('is_reply', true);
  } else if (type === 'media') {
    // Will filter client-side or use join
  }

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { data, nextCursor: data?.length === limit ? data[data.length - 1].created_at : null };
}
